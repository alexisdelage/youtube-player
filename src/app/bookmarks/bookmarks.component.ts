import { Component, OnInit } from '@angular/core';

import { BookmarkService } from '../bookmark.service';
import Video from '../video';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
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

}
