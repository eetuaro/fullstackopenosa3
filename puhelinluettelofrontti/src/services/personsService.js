import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request;
};

const deleteOne = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};

const updateOne = (id, newObject) => {
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then((response) => response.data);
};

export default {
  getAll,
  create,
  deleteOne,
  updateOne,
};
