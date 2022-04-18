import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';

import VideoModel from './interfaces';
import Video from './video';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  private bookmarkUrl = 'api/bookmark';

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getBookmarkList(): Observable<Video[]> {
    return this.http.get<VideoModel[]>(this.bookmarkUrl).pipe(
      map(videoModelList => videoModelList.map(
        videoModel => new Video(videoModel.url)
      )),
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
    return this.http.post<VideoModel>(this.bookmarkUrl, body, otherHttpOptions).pipe(
      map(videoModel => new Video(videoModel.url)),
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
    return this.http.delete<VideoModel>(this.bookmarkUrl, httpOptions).pipe(
      map(videoModel => new Video(videoModel.url)),
      catchError((err) => {console.log(err); return of(new Video(""))})
    )
  }

}
