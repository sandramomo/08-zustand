'use client';
import { useState, type MouseEventHandler } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { getNotesByQuery, NoteTag} from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import css from "./Notes.module.css";

interface NotesClientProps {
  tag?: NoteTag;
}

function NotesClient({ tag }: NotesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 1000);

  const handleSearchChange = (query: string) => {
    debouncedSearch(query);
  };

  const { data } = useQuery({
    queryKey: ["notes", searchTerm, tag ?? "", currentPage],
    queryFn: () => getNotesByQuery(searchTerm, currentPage, tag),
  });

  const totalPages = data?.totalPages ?? 0;

  const handleOpenModal: MouseEventHandler<HTMLButtonElement> = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm handleCancelNote={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}

export default NotesClient;
