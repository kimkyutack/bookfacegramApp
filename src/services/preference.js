import DefaultPreference from 'react-native-default-preference';

export const getItem = async (key) => {
  return await DefaultPreference.get(key);
};
export const setItem = async (key, value) => {
  return await DefaultPreference.set(key, value);
};
export const clearItem = async (key) => {
  return await DefaultPreference.clear(key);
};
