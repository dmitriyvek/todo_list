import { combineReducers } from "redux";
import todoOrderingReducer from "./todoOrdering";

type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  todoOrdering: todoOrderingReducer,
});

export { rootReducer };
export type { RootState };
