// utils/removeProperty.js

export const removeProperty = (obj: any, property: any) => {
  const { [property]: _, ...newObj } = obj;
  return newObj;
};
