
'use client';
import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import css from '@/components/NoteDetails/NoteDetails.module.css'
import { useRouter } from 'next/navigation';


export default function NoteDetailsClient() {
 const { id } = useParams<{ id: string }>();

  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });
  const router = useRouter();
  const handleGoBack = () => {
     const isSure = confirm('Are you sure?');
  if (isSure) {
    router.back();
  }
   };


  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !note) return <p>Something went wrong.</p>;

  const formattedDate = note.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note.createdAt}`;
  

  
  return (
    <div className={css.container}>
      
      <div className={css.item}>
        
	  <div className={css.header}>
	    <h2>{note.title} </h2>
	  </div>
	  <p className={css.content}>{note.content}</p>
        <p className={css.date}>{formattedDate}</p>
        <button onClick={handleGoBack} className={css.tag}>Back</button> 
	</div>
</div>

  );
}
