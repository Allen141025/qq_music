import {HOT,SEARCH} from '../api'

const defaultState = {
  hots:[],//热门搜索结果
  songs:sessionStorage.getItem('search_songs')?JSON.parse(sessionStorage.getItem('search_songs')):[],//关键词搜索结果
  keywords:localStorage.getItem('keywords')?JSON.parse(localStorage.getItem('keywords')):[],//搜索过的关键词列表
}

/**
 * 搜索页Store
 */
export default (state=defaultState,action)=>{
  switch(action.type){
    case 'INIT_HOTS':
      return {...state,hots:action.hots};
    case 'INIT_SONGS':
      return {...state,songs:action.songs};
    case 'ADD_KEY_WORDS':
      //在添加新的关键词记录之前，先判断是否已经添加过了
      let index = state.keywords.indexOf(action.word);
      if(index===-1){
        let arr = [...state.keywords,action.word];
        localStorage.setItem('keywords',JSON.stringify(arr));
        return {...state,keywords:arr}
      }
      return state;
    case 'DEL_KEY_WORDS':
      //删除某一条历史记录
      let index2 = state.keywords.indexOf(action.word)
      let arr2= [...state.keywords];
      arr2.splice(index2,1);
      localStorage.setItem('keywords',JSON.stringify(arr2));
      return {...state,keywords:arr2};
    case 'CLEAR_HISTORY':
      //清空历史记录
      localStorage.removeItem('keywords');
      return {...state,keywords:[]}
    default:
      return state;
  }
}

//加载热门搜索
export const loadHots=() => (dispatch) => {
  fetch(HOT).then(response=>response.json()).then(result=>{
    dispatch({
      type:'INIT_HOTS',
      hots:result.result.hots
    })
  })
}

//搜索关键词
export const search = (text) => (dispatch) => {
  fetch(SEARCH+text).then(response=>response.json()).then(result=>{
    sessionStorage.setItem('search_songs',JSON.stringify(result.result.songs));
    dispatch({
      type:'INIT_SONGS',
      songs:result.result.songs
    })
  })
}

//添加搜索关键词
export const addKeywords = (word) => (dispatch) => {
  dispatch({
    type:'ADD_KEY_WORDS',
    word
  })
}

//删除历史记录 
export const delHistory = (word) => (dispatch) => {
  dispatch({
    type:'DEL_KEY_WORDS',
    word
  })
}

//清空历史记录
export const clearHistory = () => (dispatch) => {
  dispatch({
    type:'CLEAR_HISTORY'
  })
}