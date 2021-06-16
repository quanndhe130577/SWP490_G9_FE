import { combineReducers } from 'redux';
import user from './user/user';
import modals from './modal/modals';
export default combineReducers({
    user, modals
});