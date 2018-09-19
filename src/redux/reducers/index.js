import { combineReducers } from 'redux';
import loadedCategories from './loadCategories';
import loadedArticles from './loadedArticles';
import userReducer from './userReducer';
import resetReducer from './reset';
import currentArticle from './currentArticle';

const rootReducer = combineReducers({
  loadedCategories,
  loadedArticles,
  currentUser: userReducer,
  resetReducer,
  currentArticle,
});

export default rootReducer;
