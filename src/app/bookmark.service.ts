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

  addBookmark(video: Video): void {
    const body = {
      url: video.getUrl()
    }
    const otherHttpOptions = {
      headers: this.headers
    }
    this.http.post(this.bookmarkUrl, body, otherHttpOptions).pipe(
      tap(_ => console.log("add video in bookmarks")),
      catchError((err) => {console.log(err); return of(null)})
    )
  }

  deleteBookmark(video: Video): void {
    const httpOptions = {
      headers: this.headers,
      body: {
        url: video.getUrl()
      }
    }
    this.http.delete(this.bookmarkUrl, httpOptions).pipe(
      tap(_ => console.log("add video in history")),
      catchError((err) => {console.log(err); return of(null)})
    )
  }

}
