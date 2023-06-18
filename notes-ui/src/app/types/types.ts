/**
 * The type of note.
 */
export interface Note {
  noteId?: number,
  notebookId?: number,
  note: string,
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
  createdOn: number,
}

export interface NewNote {
  notebookId?: number,
  note: string,
}

export enum NotebookDialogType {
  CREATE = "Create",
  EDIT = "Edit",
}

export interface NotebookDialogData {
  notebookDialogType: NotebookDialogType,
  notebookId?: number,
  notebookName?: string,
}
