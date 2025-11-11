import type { Metadata } from "next";
import CreateNoteClient from "./CreateNote.client";

export const metadata: Metadata = {
  title: "Create Note",
  description: "Created by Oleksandra",
  openGraph: {
    title: 'Create Note',
    description: 'Create and manage your personal notes.',
    url: 'https://08-zustand-vert-three.vercel.app/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Note App',
      },
    ],
  },
};

export default function CreateNote() {
  return <CreateNoteClient />;
}
