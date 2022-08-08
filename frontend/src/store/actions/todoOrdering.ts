interface ActionChangeOrderingPayload {
  orderingField: string;
  orderingDirection: string;
}

interface ActionChangeOrdering {
  type: ActionType.ORDERING_CHANGE;
  payload: ActionChangeOrderingPayload;
}

type Action = ActionChangeOrdering;

enum ActionType {
  ORDERING_CHANGE = "ORDERING_CHANGE",
}

const changeOrdering = (payload: ActionChangeOrderingPayload) => {
  return {
    type: ActionType.ORDERING_CHANGE,
    payload,
  };
};

export { ActionType, changeOrdering };
export type { Action, ActionChangeOrdering };
