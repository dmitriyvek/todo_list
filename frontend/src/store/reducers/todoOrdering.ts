import {
  DEFAULT_TODO_ORDERING_DIRECTION,
  DEFAULT_TODO_ORDERING_FIELD,
} from "../../constants";
import { updateObject } from "../../utils";
import {
  Action,
  ActionChangeOrdering,
  ActionType,
} from "../actions/todoOrdering";

interface State {
  orderingField: string;
  orderingDirection: string;
}

const initialState = {
  orderingField: DEFAULT_TODO_ORDERING_FIELD,
  orderingDirection: DEFAULT_TODO_ORDERING_DIRECTION,
};

const changeOrdering = (state: State, action: ActionChangeOrdering) => {
  const payload = action.payload;
  return updateObject(state, {
    orderingField: payload.orderingField,
    orderingDirection: payload.orderingDirection,
  });
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.ORDERING_CHANGE:
      return changeOrdering(state, action);
    default:
      return state;
  }
};

export default reducer;
export { DEFAULT_TODO_ORDERING_DIRECTION, DEFAULT_TODO_ORDERING_FIELD };
