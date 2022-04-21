import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, catchError, map, tap} from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

import Video from './video';
import { BookmarkQuery } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  private bookmarkListSource = new BehaviorSubject<Video[]>([]);
  public bookmarkList = this.bookmarkListSource.asObservable();

  // graphql queries
  private loadBookmarkQuery = gql`
    query {
      bookmark {
        url
      }
    }
  `
  private addBookmarkQuery = gql`
    mutation ($url: String!) {
      addBookmark (url: $url)
    }
  `
  private removeBookmarkQuery = gql`
    mutation ($url: String!) {
      removeBookmark (url: $url)
    }
  `
  // define an apollo query we can refresh several time
  private postsQuery = this.apollo.watchQuery<BookmarkQuery>({
    query: this.loadBookmarkQuery
  });

  constructor(private apollo: Apollo) { }


  /**
   * Load the bookmark list from database if connected, else from local storage,
   * and finally update the local storage
   */
  loadBookmarkList(): void {
    this.postsQuery.valueChanges.pipe(
      catchError(() => of({data: this.getInLocalStorage()})),
      map((res)  => res.data as BookmarkQuery),
      tap((data) => this.saveInLocalStorage(data)),
      map((data) => data.bookmark.map(v => new Video(v.url))),
      tap((list) => this.bookmarkListSource.next(list))
    ).subscribe();
  }

  /**
   * Save a new bookmark in the database
   * @param video The video to save
   * @returns A boolean, indicating the succes of the operation
   */
  addBookmark(video: Video): boolean {
    let success = false;
    // we make the qgraphql query
    this.apollo.mutate<any>({
      mutation: this.addBookmarkQuery,
      variables: { url: video.url }
    }).pipe(
      catchError(() => of({ data: { addBokmark: false } })),
      map((res)  => res.data.addBokmark as boolean),
      tap(()     => this.postsQuery.refetch()),   // update the bookmark list
      tap((bool) => success = bool)
    ).subscribe();
    return success;
  }

  /**
   * Delete a bookmark from the list
   * @param video The video we want to remove from bookmarks
   * @returns A boolean, indicating the success of the operation
   */
  deleteBookmark(video: Video): boolean {
    let success = false;
    // we make the qgraphql query
    this.apollo.mutate<any>({
      mutation: this.removeBookmarkQuery,
      variables: { url: video.url }
    }).pipe(
      catchError(() => of({ data: { removeBookmark: false } })),
      map((res)  => res.data.removeBookmark as boolean),
      tap(()     => this.postsQuery.refetch()),   // update the bookmark list
      tap((bool) => success = bool)
    ).subscribe();
    return success;
  }

  /**
   * Get the bookmark list saved in the local storage
   * @returns A list of videos with same type as in the database
   */
  getInLocalStorage(): BookmarkQuery {
    const jsonBookmarks = window.localStorage.getItem("bookmarks") || "[]";
    const bookmarkList = JSON.parse(jsonBookmarks) as BookmarkQuery;
    return bookmarkList;
  }

  /**
   * Save the list of videos from the database in local storage
   * @param list A list of video with same type as in the database
   */
  saveInLocalStorage(list: BookmarkQuery): void {
    const jsonBookmarks = JSON.stringify(list);
    window.localStorage.setItem("bookmarks", jsonBookmarks);
  }

}
