import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, catchError, map, tap, BehaviorSubject } from 'rxjs';

import Video from './video';
import VideoModel from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private historyUrl = 'api/history';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private historyListSource = new BehaviorSubject<Video[]>([]);
  public historyList = this.historyListSource.asObservable();

  constructor(private http: HttpClient) { }


  loadHistoryList(): void {
    this.http.get<VideoModel[]>(this.historyUrl).pipe(
      catchError(() => of(this.getInLocalStorage())),
      tap(list => this.saveInLocalStorage(list)),
      map(list => list.map(v => new Video(v.url, v.date))),
      tap(list => this.historyListSource.next(list))
    ).subscribe();
  }


  addHistory(video: Video): void {
    const body = {
      url: video.url
    }
    this.http.post<boolean>(this.historyUrl, body, this.httpOptions).pipe(
      catchError(() => of(false)),
      tap(success => { if(success) this.loadHistoryList() })
    ).subscribe();
  }


  getInLocalStorage(): VideoModel[] {
    const jsonHistory = window.localStorage.getItem("history") || "[]";
    const historyList = JSON.parse(jsonHistory) as VideoModel[];
    return historyList;
  }


  saveInLocalStorage(list: VideoModel[]): void {
    const jsonHistory = JSON.stringify(list);
    window.localStorage.setItem("history", jsonHistory);
  }

}
