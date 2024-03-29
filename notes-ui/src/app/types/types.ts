/**
 * The type of note.
 */
export interface Note {
  noteId?: number,
  notebookId?: number,
  notebookName?: string,
  note?: string,
  files?: MediaFile[],
  links?: Link[],
  updatedOn?: number,
  createdOn?: number
}

export interface NotesResponse {
  notes: Note[],
  pageSize: number,
  nextPage: number;
}

export interface NotesPageResponse {
  content: Note[],
  pageable: { pageNumber: number, pageSize: number },
  last: boolean,
  totalElements: number,
  totalPages: number,
}

/**
 * The type of Notebook.
 */
export interface Notebook {
  notebookId?: number,
  userId: number,
  notebookName: string,
  createdOn?: number,
}

export interface Link {
  linkId: number,
  noteId: number,
  url: string,
  title: string
  description?: string,
}

export interface MediaFile {
  fileId?: number,
  driveId: string,
  fileName: string
  viewLink?: string,
  downloadLink?: string,
}

export interface NewNote {
  userId: number,
  notebookId?: number,
  note: string,
  files: MediaFile[],
}

export enum ActionType {
  CREATE = "Create",
  EDIT = "Edit",
  DELETE = "Delete"
}

export interface NotebookDialogData {
  notebookDialogType: ActionType,
  notebook?: Notebook,
}

export interface NoteDialogData {
  notebookDialogType: ActionType,
  note?: Note,
}

export interface AccessTokenRequest {
  client_id: string,
  client_secret: string,
  code: string
  grant_type: string,
  redirect_uri: string,
}

export interface AccessTokenResponse {
  access_token: string,
  expires_in: number,
  refresh_token: string,
  scope: string,
  token_type: string,
  id_token: string,
}

export interface RefreshTokenRequest {
  client_id: string,
  client_secret: string,
  grant_type: string,
  refresh_token: string,
}

export interface RefreshTokenResponse {
  access_token: string,
  expires_in: number,
  scope: string,
  token_type: string,
  id_token: string,
}

export interface DriveUploadResponse {
  id: string,
  name: string,
  webContentLink: string,
}

export interface FileDetails {
  id?: string,
  name: string,
  size: string,
  downloadLink?: string,
  viewLink?: string,
  progress?: number,
}

export enum SortBy {
  RELEVANCE = "Relevance",
  NEWEST = "Newest",
  OLDEST = "Oldest"
}

export interface SearchResults {
  content: Note[],
  pageable: { pageNumber: number, pageSize: number },
  last: boolean,
  totalElements: number,
  totalPages: number,
}

export interface JWTToken {
  token: string,
  userId: number,
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  refreshToken: string,
}

export interface SignupRequest {
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
}
