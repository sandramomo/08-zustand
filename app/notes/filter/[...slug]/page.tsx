import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getNotesByQuery, NoteTag } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

type Props = {
  params: Promise<{ slug: string[] }>;
};

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
      <NoteList category={category} page={page} />
    </HydrationBoundary>
  );
};

export default NotesByCategory;
