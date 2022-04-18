import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';

import Video from './video';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private historyUrl = 'api/history';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getHistoryList(): Observable<Video[]> {
    return this.http.get<Video[]>(this.historyUrl).pipe(
      tap(_ => console.log("get history list")),
      catchError((err) => {console.log(err); return of([])})
    )
  }

  addHistory(video: Video): Observable<Video> {
    const body = {
      url: video.url
    }
    return this.http.post<Video>(this.historyUrl, body, this.httpOptions).pipe(
      tap(_ => console.log("add video in history")),
      catchError((err) => {console.log(err); return of(new Video(""))})
    )
  }

}
