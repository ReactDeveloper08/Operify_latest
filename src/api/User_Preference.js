import AsyncStorage from '@react-native-async-storage/async-storage';

// KEYS
export const KEYS = {
  ROLE: 'role',
  USER_INFO: 'userInfo',
  USER_TOKEN: 'userToken',
};

// Using KEYS for consistency
export const storeData = async (key, data) => {
  try {
    const dataString = JSON.stringify(data);
    await AsyncStorage.setItem(key, dataString);
    console.log('Data stored successfully:', key, dataString);
  } catch (error) {
    console.error('Failed to store data!', error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export const getData = async key => {
  try {
    const dataString = await AsyncStorage.getItem(key);
    return dataString ? JSON.parse(dataString) : null;
  } catch (error) {
    console.error('Failed to retrieve data!', error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export const clearData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared successfully.');
  } catch (error) {
    console.error('Failed to clear AsyncStorage!', error);
    throw error; // Rethrow the error for the caller to handle
  }
};
