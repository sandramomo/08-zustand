import { ErrorMessage, Field, Form, Formik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import * as Yup from "yup";
import { addNote } from "@/lib/api";

interface NoteFormProps {
  handleCancelNote: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const Schema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long"),
  content: Yup.string()
    .max(500, "Content is too long"),
  tag: Yup.string()
    .required("Tag is required")
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag value"),
});

export default function NoteForm({ handleCancelNote }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ["notes"] }); 
      handleCancelNote();
    },
    onError: (error) => {
      console.error("Error adding note:", error);
    },
  });

  const initialValues: FormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  const handleSubmit = async (values: FormValues) => {
    await mutate(values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
      {() => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
            <ErrorMessage name="content" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="div" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={handleCancelNote}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={isPending}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}