import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'youtube-player';
  showHistory = true;
  showBookmarks = false;
  showPanel = true;

  /**
   * Open or close the History or Bookmarks menu
   * @param menu The menu to open ("history" or "bookmarks")
   */
  togglePanel(menu: string): void {
    // if we click on the opened menu
    if (this.showHistory && menu === "history" ||
        this.showBookmarks && menu === "bookmarks") {
      // close the panel
      this.showPanel = false;
      // deactivate both menus after panel closed
      setTimeout(()=>{
        this.showHistory = false;
        this.showBookmarks = false;
      }, 300)
      return;
    }
    // if we open a menu which was closed
    // time to wait before reopen the panel (300 if panel was opened, 0 if close)
    const time = this.showPanel ? 300 : 0;
    // close the panel
    this.showPanel = false;
    // when the panel is closed, change menu and reopen it
    setTimeout(()=>{
      this.showHistory = menu === "history";
      this.showBookmarks = menu === "bookmarks";
      this.showPanel=true;
    }, time)
  }

}
