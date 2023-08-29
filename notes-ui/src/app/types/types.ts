/**
 * The type of note.
 */
export interface Note {
  noteId?: number,
  notebookId?: number,
  note?: string,
  files?: MediaFile[],
  updatedOn?: number,
  createdOn?: number
}

export interface NotesResponse {
  notes: Note[],
  pageSize: number,
  nextPage: number;
}

/**
 * The type of Notebook.
 */
export interface Notebook {
  notebookId?: number,
  notebookName: string,
  createdOn?: number,
}

export interface MediaFile {
  fileId?: number,
  driveId: string,
  fileName: string
  viewLink?: string,
  downloadLink?: string,
}

export interface NewNote {
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
