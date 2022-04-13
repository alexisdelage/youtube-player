import { Component, OnInit } from '@angular/core';
import { getVideoIdFromUrl, getPictureLink } from '../utils';
import Video from '../video';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public videoHistory: Video[] = [];

  constructor() { }

  ngOnInit(): void {
    const historyUrls = [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA"
    ]
    this.videoHistory = historyUrls.map((url) => {
      const videoID = getVideoIdFromUrl(url);
      return {
        id: videoID,
        originalUrl: url,
        internUrl: `/?search=${url}`,
        pictureUrl: getPictureLink(videoID)
      } as Video
    });
  }

}
