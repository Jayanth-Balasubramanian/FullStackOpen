import axios from 'axios';

const baseUrl = '/api/blogs';
let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};
const create = (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  return axios.post(baseUrl, newObject, config);
};

const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.put(`${baseUrl}/${id}`, newObject, config);
  return request.then((response) => response.data);
};

const deleteBlog = (id) => {
  const config = {
    headers: { Authorization: token },
  };
  return axios.delete(`${baseUrl}/${id}`, config);
};

export default {
  setToken, getAll, create, update, deleteBlog,
};
