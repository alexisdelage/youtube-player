/**
 * Interface for showing videos in templates
 */
export interface TemplateVideo {
  id: string,
  originalUrl: string,
  internUrl: string,
  pictureUrl: string
}

/**
 * Interface for videos in Database
 */
export interface DataVideo {
  url: string,
  date?: Date
}