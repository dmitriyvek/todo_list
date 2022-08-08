import React from "react";
import { ToDoRecordsPaginationItem } from "./ToDoRecordsPaginationItem";

interface ToDoRecordsPaginationProps {
  hasPrev: boolean;
  hasNext: boolean;
  fetchPrevRecordsChunk: () => Promise<void>;
  fetchNextRecordsChunk: () => Promise<void>;
}

const ToDoRecordsPagination: React.FC<ToDoRecordsPaginationProps> = ({
  hasPrev,
  hasNext,
  fetchPrevRecordsChunk,
  fetchNextRecordsChunk,
}) => {
  const prevPageItem = (
    <ToDoRecordsPaginationItem
      buttonLabel="Previous page"
      enabled={hasPrev}
      onClick={fetchPrevRecordsChunk}
    />
  );

  const nextPageItem = (
    <ToDoRecordsPaginationItem
      buttonLabel="Next page"
      enabled={hasNext}
      onClick={fetchNextRecordsChunk}
    />
  );

  const todoRecordsPagination = (
    <nav>
      <ul className="pagination justify-content-center">
        {prevPageItem}
        {nextPageItem}
      </ul>
    </nav>
  );

  return <>{todoRecordsPagination}</>;
};

export { ToDoRecordsPagination };
