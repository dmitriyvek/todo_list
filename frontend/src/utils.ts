const isEmailValid = (email: string) => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
};

const updateObject = (initialObject: object, updatedProperties: object) => {
  return {
    ...initialObject,
    ...updatedProperties,
  };
};

const getOppositeOrderingDirection = (orderingDirection: string) => {
  if (orderingDirection === "ASC") return "DESC";
  return "ASC";
};

export { isEmailValid, updateObject, getOppositeOrderingDirection };
