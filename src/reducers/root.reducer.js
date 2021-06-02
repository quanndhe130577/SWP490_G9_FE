import { combineReducers } from 'redux';
import userInfo from './user/user';
import modals from './modal/modals';
export default combineReducers({
    userInfo, modals
});