import axios from 'axios';
import consts from '../libs/consts';
import {setItem, getItem} from './preference';
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
        'user-token': `${await getItem('accessToken')}`,
        version: consts.version,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response.data?.data?.code === 'T03') {
      try {
        const response2 = await axios.post(
          consts.apiUrl + '/auth/refreshToken',
          {},
          {
            headers: {
              'user-token': `${await getItem('refreshToken')}`,
              version: consts.version,
            },
          },
        );
        if (response2.data.status === 'SUCCESS') {
          await setItem('accessToken', response2.data.data.accessToken);
          await setItem('refreshToken', response2.data.data.refreshToken);
          // 새로받은 accesstoken으로 origin request
          try {
            const fun = method
              ? String(method).toLowerCase() === 'put'
                ? axios.put
                : axios.post
              : axios.post;
            const response3 = await fun(url, form, {
              headers: {
                ...headers,
                'Content-Type': 'multipart/form-data',
                'content-Type': 'multipart/form-data',
                'cache-control': 'no-cache',
                'user-token': `${await getItem('accessToken')}`,
                version: consts.version,
              },
            });
            return response3.data;
          } catch (e) {
            throw 'origin request Error';
          }
        } else if (response2.data.status === 'FAIL') {
          throw 'refresh request FAIL';
        }
      } catch (e) {
        throw 'token expire request Error';
      }
    }
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

export const requestPost = async ({url, body = {}, headers = {}, file}) => {
  try {
    const response = await axios.post(url, body, {
      headers: {
        ...headers,
        'user-token': `${await getItem('accessToken')}`,
        version: consts.version,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response.data?.data?.code === 'T03') {
      try {
        const response2 = await axios.post(
          consts.apiUrl + '/auth/refreshToken',
          {},
          {
            headers: {
              'user-token': `${await getItem('refreshToken')}`,
              version: consts.version,
            },
          },
        );
        if (response2.data.status === 'SUCCESS') {
          await setItem('accessToken', response2.data.data.accessToken);
          await setItem('refreshToken', response2.data.data.refreshToken);
          // 새로받은 accesstoken으로 origin request
          try {
            const response3 = await axios.post(url, body, {
              headers: {
                ...headers,
                'user-token': `${await getItem('accessToken')}`,
                version: consts.version,
              },
            });
            return response3.data;
          } catch (e) {
            throw 'origin request Error';
          }
        } else if (response2.data.status === 'FAIL') {
          throw 'refresh request FAIL';
        }
      } catch (e) {
        throw 'token expire request Error';
      }
    }
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

export const requestDelete = async ({url, headers, query = {}}) => {
  try {
    const response = await axios.delete(
      `${url}?${Object.keys(query)
        .map(key => `${key}=${query[key]}`)
        .join('&')}`,
      {
        headers: {
          ...headers,
          'user-token': `${await getItem('accessToken')}`,
          version: consts.version,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response.data?.data?.code === 'T03') {
      try {
        const response2 = await axios.post(
          consts.apiUrl + '/auth/refreshToken',
          {},
          {
            headers: {
              'user-token': `${await getItem('refreshToken')}`,
              version: consts.version,
            },
          },
        );
        if (response2.data.status === 'SUCCESS') {
          await setItem('accessToken', response2.data.data.accessToken);
          await setItem('refreshToken', response2.data.data.refreshToken);
          // 새로받은 accesstoken으로 origin request
          try {
            const response3 = await axios.delete(
              `${url}?${Object.keys(query)
                .map(key => `${key}=${query[key]}`)
                .join('&')}`,
              {
                headers: {
                  ...headers,
                  'user-token': `${await getItem('accessToken')}`,
                  version: consts.version,
                },
              },
            );
            return response3.data;
          } catch (e) {
            throw 'origin request Error';
          }
        } else if (response2.data.status === 'FAIL') {
          throw 'refresh request FAIL';
        }
      } catch (e) {
        throw 'token expire request Error';
      }
    }
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

export const requestPut = async ({url, body = {}, headers = {}, file}) => {
  try {
    const response = await axios.put(url, body, {
      headers: {
        ...headers,
        'user-token': `${await getItem('accessToken')}`,
        version: consts.version,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response.data?.data?.code === 'T03') {
      try {
        const response2 = await axios.post(
          consts.apiUrl + '/auth/refreshToken',
          {},
          {
            headers: {
              'user-token': `${await getItem('refreshToken')}`,
              version: consts.version,
            },
          },
        );
        if (response2.data.status === 'SUCCESS') {
          await setItem('accessToken', response2.data.data.accessToken);
          await setItem('refreshToken', response2.data.data.refreshToken);
          // 새로받은 accesstoken으로 origin request
          try {
            const response3 = await axios.put(url, body, {
              headers: {
                ...headers,
                'user-token': `${await getItem('accessToken')}`,
                version: consts.version,
              },
            });
            return response3.data;
          } catch (e) {
            throw 'origin request Error';
          }
        } else if (response2.data.status === 'FAIL') {
          throw 'refresh request FAIL';
        }
      } catch (e) {
        throw 'token expire request Error';
      }
    }
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

export const fetchGet = async ({url, query = {}}) => {
  try {
    // request 토큰 유효
    const response = await axios.get(
      `${url}?${Object.keys(query)
        .map(key => `${key}=${query[key]}`)
        .join('&')}`,
    );
    return response.data;
  } catch (error) {
    // other error
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

export const requestGet = async ({url, headers, query = {}}) => {
  try {
    // request 토큰 유효
    const response = await axios.get(
      `${url}?${Object.keys(query)
        .map(key => `${key}=${query[key]}`)
        .join('&')}`,
      {
        headers: {
          ...headers,
          'user-token': `${await getItem('accessToken')}`,
          version: consts.version,
        },
      },
    );
    return response.data;
  } catch (error) {
    // request 토큰 만료 accesstoken 만료시 refeshtoken으로 다시 accesstoken, refreshtoken 가져와서 저장
    if (error.response.data?.data?.code === 'T03') {
      try {
        const response2 = await axios.post(
          consts.apiUrl + '/auth/refreshToken',
          {},
          {
            headers: {
              'user-token': `${await getItem('refreshToken')}`,
              version: consts.version,
            },
          },
        );
        if (response2.data.status === 'SUCCESS') {
          await setItem('accessToken', response2.data.data.accessToken);
          await setItem('refreshToken', response2.data.data.refreshToken);
          // 새로받은 accesstoken으로 origin request
          try {
            const response3 = await axios.get(
              `${url}?${Object.keys(query)
                .map(key => `${key}=${query[key]}`)
                .join('&')}`,
              {
                headers: {
                  ...headers,
                  'user-token': `${await getItem('accessToken')}`,
                  version: consts.version,
                },
              },
            );
            return response3.data;
          } catch (e) {
            throw 'origin request Error';
          }
        } else if (response2.data.status === 'FAIL') {
          throw 'refresh request FAIL';
        }
      } catch (e) {
        throw 'token expire request Error';
      }
    }
    // other error
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
        'user-token': `${await getItem('accessToken')}`,
        version: consts.version,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response.data?.data?.code === 'T03') {
      try {
        const response2 = await axios.post(
          consts.apiUrl + '/auth/refreshToken',
          {},
          {
            headers: {
              'user-token': `${await getItem('refreshToken')}`,
              version: consts.version,
            },
          },
        );
        if (response2.data.status === 'SUCCESS') {
          await setItem('accessToken', response2.data.data.accessToken);
          await setItem('refreshToken', response2.data.data.refreshToken);
          // 새로받은 accesstoken으로 origin request
          try {
            const response3 = await axios.patch(url, body, {
              headers: {
                ...headers,
                'user-token': `${await getItem('accessToken')}`,
                version: consts.version,
              },
            });
            return response3.data;
          } catch (e) {
            throw 'origin request Error';
          }
        } else if (response2.data.status === 'FAIL') {
          throw 'refresh request FAIL';
        }
      } catch (e) {
        throw 'token expire request Error';
      }
    }
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
