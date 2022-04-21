import { Injectable } from '@angular/core';
import { Observable, of, catchError, map, tap, BehaviorSubject } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

import Video from './video';
import { HistoryQuery } from './interfaces';


@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  // historyList object
  private historyListSource = new BehaviorSubject<Video[]>([]);
  public historyList = this.historyListSource.asObservable();

  // graphql queries
  private loadHistoryQuery = gql`
    query {
      history (order_by: {date: desc}) {
        url
        date
      }
    }
  `
  private addHistoryQuery = gql`
    mutation ($url: String!) {
      addHistory (url: $url)
    }
  `
  // define an apollo query we can refresh several time
  private postsQuery = this.apollo.watchQuery<HistoryQuery>({
    query: this.loadHistoryQuery
  });

  constructor(private apollo: Apollo) { }

  /**
   * Load the history list from database if connected, else from local storage,
   * and finally update the local storage
   */
  loadHistoryList(): void {
    this.postsQuery.valueChanges.pipe(
      catchError(() => of({data: this.getInLocalStorage()})),
      map((res)  => res.data as HistoryQuery),
      tap((data) => this.saveInLocalStorage(data)),
      map((data) => data.history.map(v => new Video(v.url, v.date))),
      tap((list) => this.historyListSource.next(list))
    ).subscribe();
  }

  /**
   * Save a video in the histroy list on the database.
   * If the video is already in the database, we just update its date.
   * Else we add it to the database.
   * @param video A video we want to add, with at least its url arg
   * @returns A boolean, indicating the success of the operation
   */
  addHistory(video: Video): boolean {
    let success = false;
    // we make the qgraphql query
    this.apollo.mutate<any>({
      mutation: this.addHistoryQuery,
      variables: { url: video.url }
    }).pipe(
      catchError(() => of({ data: { addHistory: false } })),
      map((res)  => res.data.addHistory as boolean),
      tap(()     => this.postsQuery.refetch()),   // update the history list
      tap((bool) => success = bool)
    ).subscribe();
    return success;
  }

  /**
   * Get the history list saved in the local storage
   * @returns A list of videos with same type as in the database
   */
  getInLocalStorage(): HistoryQuery {
    const jsonHistory = window.localStorage.getItem("history") || "[]";
    const historyList = JSON.parse(jsonHistory) as HistoryQuery;
    return historyList;
  }

  /**
   * Save the list of videos from the database in local storage
   * @param list A list of video with same type as in the database
   */
  saveInLocalStorage(list: HistoryQuery): void {
    const jsonHistory = JSON.stringify(list);
    window.localStorage.setItem("history", jsonHistory);
  }

}


