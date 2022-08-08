import React, { FormEvent } from "react";
import { useAuthToken } from "../hooks";

interface ToDoRecordsHeaderProps {
  logout: () => Promise<any>;
}

const ToDoRecordsHeader: React.FC<ToDoRecordsHeaderProps> = ({ logout }) => {
  const [authToken] = useAuthToken();
  const isAuthenticated = Boolean(authToken);

  const onLogoutClick = async (event: FormEvent) => {
    await logout();
  };

  const authButton = isAuthenticated ? (
    <button
      type="submit"
      className="btn btn-primary"
      aria-current="page"
      onClick={onLogoutClick}
    >
      Logout
    </button>
  ) : (
    <a className="btn btn-primary" aria-current="page" href="/login">
      Login
    </a>
  );

  const todoRecordsHeader = (
    <div className="row justify-content-center align-items-center h-100 mb-5">
      <div className="col-7">
        <div className="row align-items-center">
          <div className="col-3 mx-auto">{authButton}</div>
        </div>
      </div>
    </div>
  );

  return <>{todoRecordsHeader}</>;
};

export { ToDoRecordsHeader };
