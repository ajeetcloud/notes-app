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
