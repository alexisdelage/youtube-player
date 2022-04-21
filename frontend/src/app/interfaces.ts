export interface HistoryQuery {
  history: [
    {
      url: string,
      date: Date
    }
  ]
}

export interface BookmarkQuery {
  bookmark: [
    {
      url: string
    }
  ]
}
