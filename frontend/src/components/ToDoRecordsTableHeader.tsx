import { faSortAsc, faSortDesc } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { getOppositeOrderingDirection } from "../utils";

interface ColumnsData {
  label: string;
  key: string;
  sortable: boolean;
}

interface ToDoRecordsTableHeaderProps {
  orderingField: string;
  orderingDirection: string;
  defaultOrderingDirection: string;
  setOrdering: any;
}

const ToDoRecordsTableHeader: React.FC<ToDoRecordsTableHeaderProps> = ({
  orderingField,
  orderingDirection,
  defaultOrderingDirection,
  setOrdering,
}) => {
  const columnsData: ColumnsData[] = [
    { label: "Username", key: "user_name", sortable: true },
    { label: "Email", key: "user_email", sortable: true },
    { label: "Content", key: "content", sortable: false },
    { label: "Done", key: "is_done", sortable: true },
    { label: "Edited by admin", key: "is_edited_by_admin", sortable: false },
    { label: "Actions", key: "actions", sortable: false },
  ];

  const createIconElem = (fieldKey: string) => {
    if (orderingField === fieldKey) {
      const sortIcon = orderingDirection === "ASC" ? faSortAsc : faSortDesc;
      return <FontAwesomeIcon className="sorting-icon" icon={sortIcon} />;
    }
    return null;
  };

  const createColumn = ({ label, key, sortable }: ColumnsData) => {
    const className = sortable ? "todo-table-header-sortable" : "";
    const sortIconElem = createIconElem(key);
    const onHeaderClick = () => {
      let direction = defaultOrderingDirection;
      if (sortable) {
        if (orderingField === key) {
          direction = getOppositeOrderingDirection(orderingDirection);
        }
        setOrdering(key, direction);
      }
    };

    return (
      <th key={key} className={className} scope="col" onClick={onHeaderClick}>
        {label} {sortIconElem}
      </th>
    );
  };

  const columns = columnsData.map(createColumn);

  const tableHeader = (
    <thead>
      <tr>{columns}</tr>
    </thead>
  );

  return <>{tableHeader}</>;
};

export { ToDoRecordsTableHeader };
