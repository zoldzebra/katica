export const USER_MATCH_CREDENTIALS = 'userMatchCredentials';

export const getObjectFromLocalStorage = (
  key: string
): Record<string, unknown> | undefined => {
  const rawJson = localStorage.getItem(key);
  if (!rawJson) return undefined;
  const parsedObject = JSON.parse(rawJson);
  if (Object.keys(parsedObject).length === 0) return undefined;
  return parsedObject;
}

export const mergeToObjectInLocalStorage = (
  key: string,
  mergeWith: Record<string, unknown>,
): void => {
  const objectToUpdate = getObjectFromLocalStorage(key);
  const updatedObject = {
    ...objectToUpdate,
    ...mergeWith,
  }
  localStorage.setItem(key, JSON.stringify(updatedObject));
}

