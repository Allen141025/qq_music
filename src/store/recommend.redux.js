import {BANNER,DJ_BANNER,PLAY_LIST} from '../api'
const defaultState = {
  banners: [],//主轮播图
  djBanners:[],//电台轮播图
  playlists:sessionStorage.getItem("recommend_playlist")?JSON.parse(sessionStorage.getItem("recommend_playlist")):[],//精品歌单
}
/**
 * 推荐页Store
 */
export default (state=defaultState,action)=>{
  switch(action.type){
    case 'BANNER':// 加载主轮播图
      return {...state,banners:action.banners};
    case 'DJ_BANNER'://加载电台轮播图
      return {...state,djBanners:action.djBanners};
    case 'PLAY_LIST':
      return {...state,playlists:action.playlists};
    default:
      return state;
  }
}

//fetch主轮播图
export const getRecommend = () => (dispatch) => {
  //fetch使用起来和axios差不多
  //一般的ajax 基于XHR对象实现异步请求
  //fetch不急于XHR,独立的进行数据请求的新的方式，不需要安装任何模块
  setTimeout(()=>{
    fetch(BANNER).then((response)=>{
      return response.json();
    }).then(result => {
      dispatch({
        type:'BANNER',
        banners:result.banners
      })
    })
  },1000)
}

//fetch电台轮播图
export const getDJBanner = () => (dispatch) => {
  fetch(DJ_BANNER).then(response =>response.json()).then(result => {
    dispatch({
      type:'DJ_BANNER',
      // djBanners:result.data.slice(0,2)
      djBanners:result.data
    })
  })
}

//精品歌单
export const getPlayList = () => (dispatch) => {
  fetch(PLAY_LIST).then(response=>response.json()).then(result=>{
    sessionStorage.setItem('recommend_playlist',JSON.stringify(result.playlists.slice(0,48)))
    dispatch({
      type:'PLAY_LIST',
      playlists:result.playlists.slice(0,48)
    })
  })
}