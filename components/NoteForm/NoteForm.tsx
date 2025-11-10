"use client";

import css from "./NoteForm.module.css";
import { useRouter } from "next/navigation";
import { addNote } from "@/lib/api";
import { useNoteDraftStore } from "@/lib/stores/noteStore";

interface NoteFormProps {
  handleCancelNote: () => void;
}

export default function NoteForm({ handleCancelNote }: NoteFormProps) {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };
  async function handleSubmit(formData: FormData) {
    
    const note = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as string,
    };
      clearDraft();

    try {
      await addNote(note);
      router.refresh();
      handleCancelNote();
    } catch (error) {
      console.error("Error adding note:", error);
    }
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
          defaultValue={draft?.title} onChange={handleChange}
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
          defaultValue={draft?.content} onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" name="tag" className={css.select} required defaultValue={draft?.tag} onChange={handleChange}>
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
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}
