import {TOP_LIST} from '../api'
const defaultState = {
  list:sessionStorage.getItem('rank_list')?JSON.parse(sessionStorage.getItem('rank_list')):[]
}

/**
 * 排行榜Store
 */
export default (state=defaultState,action)=>{
  switch(action.type){
    case 'INIT_LIST':
      return {...state,list:action.list}
    default:
      return state;
  }
}

//加载所有榜单
export const loadTopList = () => (dispatch) => {
  fetch(TOP_LIST).then(response =>response.json()).then(result => {
    let list = result.list.map(val => {
      if(val.playCount>10000){
        val.playCount = parseInt(val.playCount/10000) + '万'
      }
      return val;
    })
    sessionStorage.setItem('rank_list',JSON.stringify(list));
    dispatch({
      type:'INIT_LIST',
      list
    })
  })
}