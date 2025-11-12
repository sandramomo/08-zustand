import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getNotesByQuery, NoteTag } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = slug[0] === "all" ? undefined : (slug[0] as NoteTag);
  const displayCategory = category ?? "All";

  return {
    title: `${displayCategory} notes list`,
    description: `A collection of personal ${displayCategory} notes for easy and comfortable access`,
    openGraph: {
      title: `${displayCategory} notes list`,
      description: `A collection of personal ${displayCategory} notes for easy and comfortable access`,
      url: `https://08-zustand-vert-three.vercel.app/notes/filter/${displayCategory}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Note App",
        },
      ],
    },
  };
}

const NotesByCategory = async ({ params }: Props) => {
  const { slug } = await params;
  const category = slug[0] === "all" ? undefined : (slug[0] as NoteTag);
  const page = 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", category ?? "", page],
    queryFn: () => getNotesByQuery(undefined, page, category),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient tag={category} />
    </HydrationBoundary>
  );
};

export default NotesByCategory;
