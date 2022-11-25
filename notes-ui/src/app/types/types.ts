/**
 * The type of note .
 */
export interface Note {
  noteId?: number,
  note: string,
}

export interface NewNote {
  notebookId?: number,
  note: string,
}
