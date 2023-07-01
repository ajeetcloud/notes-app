/**
 * The type of note.
 */
export interface Note {
  noteId?: number,
  notebookId?: number,
  note?: string,
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

export interface NewNote {
  notebookId?: number,
  note: string,
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
