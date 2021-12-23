import Axios from 'axios';
import store from '@/store';

const BASE_URL = process.env.VUE_APP_API_URL;

const httpClient = Axios.create({
  baseURL: BASE_URL,
  timeout: false,
  params: {}, // In need if you want to add new params.
});

httpClient.interceptors.request.use(
  (config) => {
    const defaultConfig = config;
    const { token } = store.state.user;

    if (token) {
      defaultConfig.headers.common.Authorization = `Bearer ${token}`;
    }

    return defaultConfig;
  },
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use((response) => response, (error) => {
  const repStatus = error && error.response ? error.response.status : null;
  // eslint-disable-next-line no-empty
  if (repStatus === 401) {}
  // eslint-disable-next-line no-empty
  if (repStatus === 403) {}
  // eslint-disable-next-line no-empty
  if (repStatus === 404) {}

  return Promise.reject(error.response);
});

/**
 * Override the axios params setter
 * @param {Object} params
 * @param {CancelToken} params.cancelToken
 */
const addParam = ({ cancelToken = null, ...rest } = {}) => {
  const result = {
    ...rest,
  };
  if (cancelToken) {
    result.cancelToken = cancelToken;
  }
  return result;
};

export default {
  getData: (action, requestParams = {}) => httpClient.get(action, addParam(requestParams)),
  // eslint-disable-next-line max-len
  postData: (action, data, requestParams = {}) => httpClient.post(action, data, addParam(requestParams)),
  putData: (action, data) => httpClient.put(action, data),
  deleteData: (action) => httpClient.delete(action),
  downloadFile: (action, requestParams = {}) => httpClient.get(
    action,
    addParam({
      ...requestParams,
      responseType: 'blob',
    }),
  ),
  downloadFilePost: (action, body, requestParams = {}) => httpClient.post(
    action,
    body,
    addParam({
      ...requestParams,
      responseType: 'blob',
    }),
  ),
  uploadloadFiles: (action, data, requestParams = {}) => httpClient.post(
    action,
    data,
    addParam({
      ...requestParams,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  ),
};
