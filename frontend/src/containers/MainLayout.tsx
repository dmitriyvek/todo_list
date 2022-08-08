import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const mainLayout = (
    <div className="container">
      <ToastContainer />
      <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-10">
              <div className="card rounded-3">
                <div className="card-body p-4">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return <>{mainLayout}</>;
};

export { MainLayout };
