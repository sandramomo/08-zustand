import { NewNote, Note } from "@/types/note";
import Axios from "axios";

export enum NoteTag {
  all = '',
  Work = "Work",
  Meeting = "Meeting",
  Personal = "Personal",
  Shopping = "Shopping",
  Todo = "Todo",
}

interface NotesHttpResponse {
  notes: Note[],
  totalPages: number,
}

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;



const axios = Axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    accept: "application/json",
      Authorization: `Bearer ${myKey}`,
    email: 'mikaella.hiyakuya@gmail.com'
  },
  params: {
  },
});

export async function getNotesByQuery(search?: string, page?: number, tag?:NoteTag): Promise<NotesHttpResponse>
{
  return axios
    .get<NotesHttpResponse>("/notes" , { params: { search, page, tag } })
    .then((res) => res.data);
}

export function addNote(newNote: NewNote): Promise<Note> {
  return axios.post<Note>("/notes", newNote).then(res => res.data);
}

export function deleteNote(id: string): Promise<Note> {
  return axios.delete<Note>(`/notes/${id}`).then(res => res.data);
}

export function fetchNoteById(id: string): Promise<Note> {
  return axios.get<Note>(`/notes/${id}`).then(res => res.data)
}
