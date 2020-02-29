import { ALBUM, URL, CHECK, LRC, DETAIL } from '../api'
import {convert} from '../util';
const defaultState = {
  songId: 0, //歌曲ID
  songName: '', //歌曲名称
  singer: [{ id: 0, name: '' }], //歌手列表
  singerPicUrl: '', //歌手图片
  albumId: 0, //专辑ID
  albumName: '', //专辑名称
  albumPicUrl: '', //专辑LOGO
  url: '', //歌曲播放地址
  isCheck: {
    //版权检测
    success: true,
    message: ''
  },
  lyric: [] //歌词
}

/**
 * 播放页Store
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case 'IS_CHECK':
      return { ...state, isCheck: action.isCheck }
    case 'DETAIL':
      return {
        ...state,
        songId: action.songId,
        songName: action.songName,
        singer: action.singer,
        albumId: action.albumId,
        albumName:action.albumName,
        albumPicUrl:action.albumPicUrl
      }
    case 'SINGER_PIC':
      return {...state,singerPicUrl:action.singerPicUrl};
    case 'URL':
      return {...state,url:action.url};
    case 'LYRIC':
      return {...state,lyric:action.lrc};
    default:
      return state
  }
}

//加载专辑信息
export const loadAlbum = id => dispatch => {
  fetch(ALBUM + id)
    .then(response => response.json())
    .then(result => {
      dispatch({
        type:'SINGER_PIC',
        singerPicUrl:result.album.artist.picUrl
      })
    })
}

//加载播放地址
export const loadUrl = (id,ck) => dispatch => {
  fetch(URL + id)
    .then(response => response.json())
    .then(result => {
      ck();
      dispatch({
        type:'URL',
        url:result.data[0].url
      })
    })
}

//能否播放
export const checkSong = (id,ck=(res)=>{}) => dispatch => {
  fetch(CHECK + id)
    .then(response => response.json())
    .then(result => {
      dispatch({
        type: 'IS_CHECK',
        isCheck: result
      })
      ck(result);
    })
}

//加载歌词
export const loadLyric = (id,ck=(res)=>{}) => dispatch => {
  fetch(LRC + id)
    .then(response => response.json())
    .then(result => {
      ck();
     if(!result.lrc){
       //纯音乐
       dispatch({
        type:'LYRIC',
        lrc:[{time:0,words:'纯音乐'}]
      })
      return;
     }
      let lrc = result.lrc.lyric;//获取原始歌词内容
      let arr = lrc.split('\n');//根据换行符将歌词分割成数组
      let len = arr.length;//缓存数组length
      let results=[];//存放处理好的歌词和时间轴
      for(let i =0;i<len;i++){
        let index = arr[i].lastIndexOf(']');//找到最后一个]的位置,作为歌词与时间轴的分界线
        let time = arr[i].substring(1,index);//时间轴是从1到分界线之前的位置
        let words = arr[i].substring(index+1);//歌词是从分界线的下一个位置开始到结尾
        //时间轴分两种情况：
        //1.情况一(一句词对应一个时间轴)：01:23.2
        //2.情况二(一句词对应多个时间轴)：01:23.2][02:22][04:03
        if(time!=='' && words!=='' && time.indexOf(']')===-1){
          //处理情况一
          results.push({
            time:convert(time),
            words
          })
        }else{
          //处理情况二
          if(words!==''){
            //继续用][再次分割时间轴
            let times = time.split('][');
            //遍历多个时间轴，这多个时间轴对应的是同一句歌词
            times.forEach((tt)=> {
              //给新数组push的时候，就是多条记录，时间轴不同，但是歌词相同
              results.push({
                time:convert(tt),
                words
              })
            })
          }
        }
      }
      //对歌词排序，按照时间轴从小到大排,因为从小到大排序就是歌曲演唱的顺序
      results.sort((a,b) => {
        return a.time - b.time;
      })
      //再给Satate里面添加
      dispatch({
        type:'LYRIC',
        lrc:results
      })
    })
}

//加载歌曲详情
export const loadDetail = (id,ck) => dispatch => {
  fetch(DETAIL + id)
    .then(response => response.json())
    .then(result => {
      ck();
      let song = result.songs[0]
      dispatch({
        type:'DETAIL',
        songId: song.id,
        songName: song.name,
        singer: song.ar,
        albumId: song.al.id,
        albumName:song.al.name,
        albumPicUrl:song.al.picUrl
      })
    })
}
