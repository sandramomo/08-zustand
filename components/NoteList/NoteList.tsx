'use client';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotesByQuery, deleteNote, NoteTag } from "@/lib/api";
import type { Note } from "@/types/note";
import Link from "next/link";
import css from "./NoteList.module.css";

interface NoteListProps {
  category?: NoteTag;
  page: number;
}

export default function NoteList({ category, page }: NoteListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", category ?? "", page],
    queryFn: () => getNotesByQuery(undefined, page, category),
  });

  const { mutate } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) => console.error("Error deleting note:", err),
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (isError || !data) return <p>Failed to load notes.</p>;

  const notes: Note[] = data.notes;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`} className={css.link}>
              View details
            </Link>
            <button
              className={css.button}
              onClick={() => mutate(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
