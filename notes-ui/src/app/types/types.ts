/**
 * The type of note.
 */
export interface Note {
  noteId?: number,
  note: string,
}

/**
 * Notebook name
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
