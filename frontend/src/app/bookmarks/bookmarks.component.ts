import { Component, OnInit } from '@angular/core';

import { BookmarkService } from '../bookmark.service';
import Video from '../video';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['../sidenav.scss']
})
export class BookmarksComponent implements OnInit {

  public videoBookmarks: Video[] = [];

  constructor(private bookmarkService: BookmarkService) { }

  ngOnInit(): void {
    this.bookmarkService.bookmarkList.subscribe(
      bookmarkList => this.videoBookmarks = bookmarkList
    );
    this.bookmarkService.loadBookmarkList();
  }

  removeBookmark(event:Event, video: Video): boolean {
    event.stopPropagation();
    this.bookmarkService.deleteBookmark(video);
    return false;
  }

}
