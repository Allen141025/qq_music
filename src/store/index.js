import recommend from './recommend.redux';
import rank from './rank.redux';
import search from './search.redux';
import songList from './songList.redux';
import player from './player.redux';
import {combineReducers} from 'redux';

export default combineReducers({recommend,rank,search,songList,player});