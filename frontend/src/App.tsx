import { ApolloProvider } from "@apollo/client";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { createStore } from "redux";
import { LoginLayout } from "./containers/LoginLayout";
import { MainLayout } from "./containers/MainLayout";
import { ToDoRecordsLayout } from "./containers/ToDoRecordsLayout";
import { useAppApolloClient } from "./graphqlResources/apolloClient";
import { rootReducer } from "./store/reducers/rootReducer";

function App() {
  const apolloClient = useAppApolloClient();
  const reduxStore = createStore(rootReducer);

  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={reduxStore}>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/login" element={<LoginLayout />} />
              <Route path="/" element={<ToDoRecordsLayout />} />
            </Routes>
          </MainLayout>
        </Router>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
