import { Component, OnInit } from '@angular/core';
import { getVideoIdFromUrl, getPictureLink } from '../utils';
import Video from '../video';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  public videoBookmarks: Video[] = [];

  constructor() { }

  ngOnInit(): void {
    const bookmarksUrls = [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=Kt-tLuszKBA"
    ]
    this.videoBookmarks = bookmarksUrls.map((url) => {
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
