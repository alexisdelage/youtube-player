import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, catchError, map, tap} from 'rxjs';

import VideoModel from './interfaces';
import Video from './video';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  private bookmarkUrl = 'api/bookmark';

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private bookmarkListSource = new BehaviorSubject<Video[]>([]);
  public bookmarkList = this.bookmarkListSource.asObservable();


  constructor(private http: HttpClient) { }


  loadBookmarkList(): void {
    this.http.get<VideoModel[]>(this.bookmarkUrl).pipe(
      map(videoModelList => videoModelList.map(
        videoModel => new Video(videoModel.url)
      )),
      catchError((err) => {console.log(err); return of([])})
    ).subscribe(
      bookmarkList => this.bookmarkListSource.next(bookmarkList)
    );
  }


  addBookmark(video: Video): void {
    const body = {
      url: video.url
    }
    const otherHttpOptions = {
      headers: this.headers
    }
    this.http.post<VideoModel>(this.bookmarkUrl, body, otherHttpOptions).pipe(
      map(videoModel => new Video(videoModel.url)),
      catchError((err) => {console.log(err); return of(new Video(""))})
    ).subscribe(
      _ => this.loadBookmarkList()
    );
  }


  deleteBookmark(video: Video): void {
    const httpOptions = {
      headers: this.headers,
      body: {
        url: video.url
      }
    }
    this.http.delete<VideoModel>(this.bookmarkUrl, httpOptions).pipe(
      map(videoModel => new Video(videoModel.url)),
      catchError((err) => {console.log(err); return of(new Video(""))})
    ).subscribe(
      _ =>  this.loadBookmarkList()
    );
  }


  checkIfBookmarked(video: Video): Observable<boolean> {
    const url = this.bookmarkUrl + "/check?url=" + video.url;
    return this.http.get<boolean>(url).pipe(
      tap(_ => {}),
      catchError((err) => {console.log(err); return of(false)})
    )
  }

}
