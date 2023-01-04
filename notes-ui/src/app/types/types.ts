/**
 * The type of note.
 */
export interface Note {
  noteId?: number,
  note: string,
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
