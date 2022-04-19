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
      map(videoModelList => videoModelList.map(
        videoModel => new Video(videoModel.url, videoModel.date)
      )),
      catchError((err) => {console.log(err); return of([])})
    ).subscribe(
      historyList => this.historyListSource.next(historyList)
    );
  }

  addHistory(video: Video): void {
    const body = {
      url: video.url
    }
    this.http.post<VideoModel>(this.historyUrl, body, this.httpOptions).pipe(
      map(videoModel => new Video(videoModel.url, videoModel.date)),
      catchError((err) => {console.log(err); return of(new Video(""))})
    ).subscribe(
      _ => this.loadHistoryList()
    );
  }

}
