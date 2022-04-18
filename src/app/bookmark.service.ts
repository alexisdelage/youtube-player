import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';

import Video from './video';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  private bookmarkUrl = 'api/bookmark';

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getBookmarkList(): Observable<Video[]> {
    return this.http.get<Video[]>(this.bookmarkUrl).pipe(
      tap(_ => console.log("get bookmark list")),
      catchError((err) => {console.log(err); return of([])})
    )
  }

  addBookmark(video: Video): Observable<Video> {
    const body = {
      url: video.url
    }
    const otherHttpOptions = {
      headers: this.headers
    }
    return this.http.post<Video>(this.bookmarkUrl, body, otherHttpOptions).pipe(
      tap(_ => console.log("add video in bookmarks")),
      catchError((err) => {console.log(err); return of(new Video(""))})
    )
  }

  deleteBookmark(video: Video): Observable<Video> {
    const httpOptions = {
      headers: this.headers,
      body: {
        url: video.url
      }
    }
    return this.http.delete<Video>(this.bookmarkUrl, httpOptions).pipe(
      tap(_ => console.log("add video in history")),
      catchError((err) => {console.log(err); return of(new Video(""))})
    )
  }

}
