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
      catchError(() => of(this.getInLocalStorage())),
      tap(list => this.saveInLocalStorage(list)),
      map(list => list.map(v => new Video(v.url))),
      tap(list => this.bookmarkListSource.next(list))
    ).subscribe();
  }


  addBookmark(video: Video): boolean {
    const body = {
      url: video.url
    }
    const otherHttpOptions = {
      headers: this.headers
    }
    let success = false;
    this.http.post<boolean>(this.bookmarkUrl, body, otherHttpOptions).pipe(
      catchError(() => of(false)),
      tap(success => { if(success) this.loadBookmarkList() })
    ).subscribe(
      res => success = res
    );
    return success;
  }


  deleteBookmark(video: Video): boolean {
    const httpOptions = {
      headers: this.headers,
      body: {
        url: video.url
      }
    }
    let success = false;
    this.http.delete<boolean>(this.bookmarkUrl, httpOptions).pipe(
      catchError(() => of(false)),
      tap(success => { if(success) this.loadBookmarkList() })
    ).subscribe(
      res => success = res
    );
    return success;
  }


  getInLocalStorage(): VideoModel[] {
    const jsonBookmarks = window.localStorage.getItem("bookmarks") || "[]";
    const bookmarkList = JSON.parse(jsonBookmarks) as VideoModel[];
    return bookmarkList;
  }


  saveInLocalStorage(list: VideoModel[]): void {
    const jsonBookmarks = JSON.stringify(list);
    window.localStorage.setItem("bookmarks", jsonBookmarks);
  }

}
