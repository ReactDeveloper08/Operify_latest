/* eslint-disable prettier/prettier */
// Base URL
export const BASE_URL = 'https://tpplerp.in/'
// export const BASE_URL = 'https://staging.tpplerp.in/'

// API URL

export const makeRequest = async (url, params = null) => {
  try {
    // request info
    let info = {};
    if (params) {
      // request method type
      info.method = 'POST';
      // Preparing multipart/form-data
      const formData = new FormData();
      for (const key in params) {
        formData.append(key, params[key]);
      }
      // request body
      info.body = formData;
    } else {
      // headers to prevent cache in GET request
      info.headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
      };
    }
    console.log('Request URL:', url);
    console.log('Request Params:', info);

    const response = await fetch(url, info);

    // Check if the response status is okay (status codes between 200 and 299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Request Response:', result);
    return result;
  } catch (error) {
    console.error('Request Error:', error.message);
    return null; // You may want to return a more informative error object or handle the error accordingly
  }
};
