import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotePreview from '@/components/NotePreview/NotePreviewModal';
import { fetchNoteById } from '@/lib/api';

type Props = {
  params: Promise<{ id: string }>;
};


const NotePreviewPage = async ({ params }: Props) => {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotePreview noteId={id} />
    </HydrationBoundary>
  );
};

export default NotePreviewPage;
