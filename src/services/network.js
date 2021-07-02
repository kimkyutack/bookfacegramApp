import axios from 'axios';
import consts from '../libs/consts';
import {getItem} from './preference';
export const requestFile = async ({url, method, headers = {}}, form) => {
  try {
    const fun = method
      ? String(method).toLowerCase() === 'put'
        ? axios.put
        : axios.post
      : axios.post;
    const response = await fun(url, form, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
        'content-Type': 'multipart/form-data',
        'cache-control': 'no-cache',
        // authorization: `KdisConnectUser ${await getItem('token')}`,
        version: consts.version,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const {data} = error.response;
      let errorObj;
      if (typeof data === 'string') {
        errorObj = {message: data};
      } else {
        errorObj = data;
      }
      throw errorObj;
    } else {
      throw error;
    }
  }
};

export const requestPost = async ({url, body = {}, headers = {}, file}) => {
  try {
    const response = await axios.post(url, body, {
      headers: {
        ...headers,
        // authorization: `KdisConnectUser ${await getItem('token')}`,
        version: consts.version,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const {data} = error.response;
      let errorObj;
      if (typeof data === 'string') {
        errorObj = {message: data};
      } else {
        errorObj = data;
      }
      throw errorObj;
    } else {
      throw error;
    }
  }
};

export const requestDelete = async ({url, headers, query = {}}) => {
  try {
    const response = await axios.delete(
      `${url}?${Object.keys(query)
        .map(key => `${key}=${query[key]}`)
        .join('&')}`,
      {
        headers: {
          ...headers,
          // authorization: `KdisConnectUser ${await getItem('token')}`,
          version: consts.version,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const {data} = error.response;
      let errorObj;
      if (typeof data === 'string') {
        errorObj = {message: data};
      } else {
        errorObj = data;
      }
      throw errorObj;
    }
  }
};

export const requestPut = async ({url, body = {}, headers = {}, file}) => {
  try {
    const response = await axios.put(url, body, {
      headers: {
        ...headers,
        // authorization: `KdisConnectUser ${await getItem('token')}`,
        version: consts.version,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const {data} = error.response;
      let errorObj;
      if (typeof data === 'string') {
        errorObj = {message: data};
      } else {
        errorObj = data;
      }
      throw errorObj;
    } else {
      throw error;
    }
  }
};
export const requestGet = async ({url, headers, query = {}}) => {
  try {
    const response = await axios.get(
      `${url}?${Object.keys(query)
        .map(key => `${key}=${query[key]}`)
        .join('&')}`,
      {
        headers: {
          ...headers,
          // authorization: `KdisConnectUser ${await getItem('token')}`,
          version: consts.version,
        },
      },
    );
    return response.data;
  } catch (error) {
    let errorObj;
    if (error.response) {
      const {data} = error.response;
      if (typeof data === 'string') {
        errorObj = {message: data};
      } else {
        errorObj = data;
      }
    } else {
      errorObj = error;
    }
    throw errorObj;
  }
};
export const requestPatch = async ({url, body = {}, headers}) => {
  try {
    const response = await axios.patch(url, body, {
      headers: {
        ...headers,
        // authorization: `KdisConnectUser ${await getItem('token')}`,
        version: consts.version,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const {data} = error.response;
      let errorObj;
      if (typeof data === 'string') {
        errorObj = {message: data};
      } else {
        errorObj = data;
      }
      throw errorObj;
    } else {
      throw error;
    }
  }
};
