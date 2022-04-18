import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';

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

  constructor(private http: HttpClient) { }

  getHistoryList(): Observable<Video[]> {
    return this.http.get<VideoModel[]>(this.historyUrl).pipe(
      map(videoModelList => videoModelList.map(
        videoModel => new Video(videoModel.url, videoModel.date)
      )),
      catchError((err) => {console.log(err); return of([])})
    )
  }

  addHistory(video: Video): Observable<Video> {
    const body = {
      url: video.url
    }
    return this.http.post<VideoModel>(this.historyUrl, body, this.httpOptions).pipe(
      map(videoModel => new Video(videoModel.url, videoModel.date)),
      catchError((err) => {console.log(err); return of(new Video(""))})
    )
  }

}
