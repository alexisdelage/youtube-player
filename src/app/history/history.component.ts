import { Component, OnInit } from '@angular/core';

import { HistoryService } from '../history.service';
import Video from '../video';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public videoHistory: Video[] = [];

  constructor(private historyService: HistoryService) { }

  ngOnInit(): void {
    this.getHistoryList();
  }

  getHistoryList(): void {
    this.historyService.getHistoryList().subscribe(
      historyList => this.videoHistory = historyList
    )
  }

}
