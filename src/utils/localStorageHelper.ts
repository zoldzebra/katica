export const getObjectFromLocalStorage = (
  key: string
): Record<string, unknown> | undefined => {
  const rawJson = localStorage.getItem(key);
  if (!rawJson) return undefined;
  return JSON.parse(rawJson);
}

export const updateObjectInLocalStorage = (
  key: string,
  updateWith: Record<string, unknown>,
): void => {
  const objectToUpdate = getObjectFromLocalStorage(key);
  const updatedObject = {
    ...objectToUpdate,
    ...updateWith,
  }
  localStorage.setItem(key, JSON.stringify(updatedObject));
}

