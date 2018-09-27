import axios from 'axios';
import GET_ALL_TAGS from '../constants/tags';
import { EDIT_ARTICLE } from '../constants/articles';
import api from '../api';


export const editArticle = articleData => ({
  type: EDIT_ARTICLE,
  payload: articleData,
});

export const getTags = tagData => ({
  type: GET_ALL_TAGS,
  payload: tagData,
});

export const getAllTags = () => dispatch => api.get('/api/tags').then((res) => {
  dispatch(getTags(res.data));
});

const updateArticle = (modifiedDetails, slug) => (dispatch) => {
  const { image, article } = modifiedDetails;
  console.log('article', image);
  const formData = new FormData();
  console.log('article', article.imageData);
  if (article.imageData) formData.append('file', image);
  formData.append('data', JSON.stringify({ article }));
  console.log('form', formData);
  axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('authorsHaven-token')}`;
  return api.put(`/api/articles/${slug}`, formData).then(res => dispatch(editArticle(res.data)));
};

export default updateArticle;