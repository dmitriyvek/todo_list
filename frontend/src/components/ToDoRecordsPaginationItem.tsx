import React from "react";

interface ToDoRecordsPaginationItemProps {
  buttonLabel: string;
  enabled: boolean;
  onClick: () => Promise<void>;
}

const ToDoRecordsPaginationItem: React.FC<ToDoRecordsPaginationItemProps> = ({
  buttonLabel,
  enabled,
  onClick,
}) => {
  const enabledLabel = enabled ? "enabled" : "disabled";
  const liClassName = `page-item ${enabledLabel}`;

  const todoRecordsPaginationItem = (
    <li className={liClassName}>
      <button onClick={onClick} className="page-link">
        {buttonLabel}
      </button>
    </li>
  );

  return <>{todoRecordsPaginationItem}</>;
};

export { ToDoRecordsPaginationItem };
