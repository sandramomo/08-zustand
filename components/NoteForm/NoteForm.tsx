"use client";

import css from "./NoteForm.module.css";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote } from "@/lib/api";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { NewNote } from "@/types/note";

interface NoteFormProps {
  handleCancelNote: () => void;
}

export default function NoteForm({ handleCancelNote }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const { mutate, isPending } = useMutation({
    mutationFn: (note: NewNote) => addNote(note),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });

      clearDraft();
      router.back();
    },
    onError: (error) => {
      console.error(" Error adding note:", error);
    },
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  async function handleSubmit(formData: FormData) {
    const note: NewNote = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as string,
    };
    mutate(note);
  }

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          minLength={3}
          maxLength={50}
          required
          defaultValue={draft?.title}
          onChange={handleChange}
          disabled={isPending}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          maxLength={500}
          className={css.textarea}
          defaultValue={draft?.content}
          onChange={handleChange}
          disabled={isPending}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          required
          defaultValue={draft?.tag}
          onChange={handleChange}
          disabled={isPending}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancelNote}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isPending}
        >
Create note
        </button>
      </div>
    </form>
  );
}
