import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getNotesByQuery, NoteTag } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import { Metadata } from "next";
import css from '../../Notes.module.css'
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string[] }>;
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
const { slug } = await params;
const category = slug[0] === "all" ? undefined : (slug[0] as NoteTag);
const note = await getNotesByQuery("", 1, category);
  console.log(note)
  return {
    title: `Notes list`,
    description: 'Notes list',
    openGraph: {
    title: 'Notes list',
    description: 'A collection of personal notes for easy and comfortable access',
    url: `https://08-zustand-vert-three.vercel.app/notes/filter/${category}`,
    images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Note App',
        },
      ],
  }
  }
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
      <div className={css.toolbar}>
              <Link className={css.button} href='/notes/action/create'>Create note + </Link>
      </div>

      <NoteList category={category} page={page} />
    </HydrationBoundary>
  );
};

export default NotesByCategory;
