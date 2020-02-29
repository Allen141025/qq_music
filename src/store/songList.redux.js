import * as api from '../api'
const defaultState = {
  id: 0, //歌单ID
  name: '', //歌单名称
  songs: sessionStorage.getItem('songList_songs')?JSON.parse(sessionStorage.getItem('songList_songs')):[], //歌曲列表
  tags: [], //歌单标签
  coverImgUrl: '', //歌单LOGO
  updateTime: Date.now(), //更新时间
  count: 0 //歌曲数量
}

/**
 * 歌单列表Store
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case 'INIT_PLAY_LIST':
      return {
        ...state,
        id: action.id,
        name: action.name,
        songs: action.songs,
        tags: action.tags,
        coverImgUrl: action.coverImgUrl,
        updateTime: action.updateTime,
        count: action.count
      }
    default:
      return state
  }
}

export const loadSongList = id => dispatch => {
  fetch(api.PLAY_LIST_DETAIL + id)
    .then(response => response.json())
    .then(result => {
      sessionStorage.setItem('songList_songs',JSON.stringify(result.playlist.tracks))
      dispatch({
        type: 'INIT_PLAY_LIST',
        id: result.playlist.id,
        name: result.playlist.name,
        updateTime: result.playlist.updateTime,
        tags: result.playlist.tags,
        coverImgUrl: result.playlist.coverImgUrl,
        songs: result.playlist.tracks,
        count: result.playlist.tracks.length
      })
    })
}
