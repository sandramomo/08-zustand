'use client';
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import { getNotesByQuery, NoteTag } from "@/lib/api";

import css from "../../Notes.module.css";

interface NotesClientProps {
  tag?: NoteTag;
}

function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, 1000);

  const handleSearchChange = (query: string) => {
    debouncedSearch(query);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { tag, search, page: currentPage }],
    queryFn: () => getNotesByQuery(search, currentPage, tag),
     placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={handleSearchChange} />
        <Link href="/notes/action/create" className={css.button}>
          + Create note
        </Link>
      </div>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Failed to load notes.</p>}

      {!isLoading && !isError && <NoteList notes={notes} />}

      <div className={css.paginationWrapper}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default NotesClient;
