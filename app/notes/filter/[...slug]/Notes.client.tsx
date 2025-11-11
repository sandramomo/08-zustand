'use client';
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import { NoteTag } from "@/lib/api";
import css from "./Notes.module.css";

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

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={handleSearchChange} />
        <Link href="/notes/action/create" className={css.createButton}>
          + Create note
        </Link>
      </div>
      <NoteList category={tag} page={currentPage} />

      <div className={css.paginationWrapper}>
        <Pagination
          totalPages={1}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default NotesClient;
