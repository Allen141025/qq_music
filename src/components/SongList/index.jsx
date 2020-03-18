import React from "react";
import "./index.css";
import { loadSongList } from "../../store/songList.redux";
import { connect } from "react-redux";
import { checkSong } from "../../store/player.redux";
import { Toast } from "antd-mobile";
import Loading from "../../base/Loading";
@connect(
  state => ({
    id: state.songList.id,
    name: state.songList.name,
    coverImgUrl: state.songList.coverImgUrl,
    updateTime: new Date(state.songList.updateTime).toLocaleDateString(),
    tags: state.songList.tags,
    songs: state.songList.songs,
    count: state.songList.count,
    isCheck: state.player.isCheck
  }),
  {
    loadSongList,
    checkSong
  }
)
class SongList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0 //准备要播放的歌曲ID
    };
  }
  componentDidMount() {
    this.props.loadSongList(this.props.match.params.id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isCheck.message !== "") {
      //点击了某一首歌
      if (nextProps.isCheck.success && this.state.id > 0) {
        //去播放
        // this.props.history.push('/player/'+this.state.id);
        this.props.history.push({
          pathname: "/player/" + this.state.id,
          state: { from: this.props.location.pathname }
        });
      } else if (!nextProps.isCheck.success) {
        //提示
        Toast.info(nextProps.isCheck.message, 2);
      }
    } else {
      //还没点击歌曲
    }
  }
  check = id => {
    this.setState({
      id
    });
    //根据歌曲ID，去验证是否有版权问题
    this.props.checkSong(id);
  };
  //播放第一首歌
  playFirst = () => {
    this.check(this.props.songs[0].id);
  };
  render() {
    return (
      <div className="songList">
        <div className="songListBox">
          <div className="loging"></div>
          <div className="headbox headbox2">
            <p className="p1">
              <img
                src="//y.gtimg.cn/mediastyle/mod/mobile/img/logo_ch.svg?max_age=2592000"
                alt=""
              />
            </p>
            <p className="p2">
              <span>戳我查看</span>
            </p>
          </div>
          <div className="songInfoBox">
            <div className="songInfo">
              <p className="song_pic">
                <img src={this.props.coverImgUrl} alt="" />
              </p>
              <h2 className="song_title">{this.props.name}</h2>
              <h3 className="song_tags">
                {this.props.tags.map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </h3>
              <h3 className="song_time">更新时间: {this.props.updateTime}</h3>
              <span
                className="iconfont icon-you song_play"
                onClick={this.playFirst}
              ></span>
            </div>
            <div className="songList">
              <p className="songList_num">
                排行榜
                <span>共{this.props.count}首</span>
              </p>
              <ul>
                {this.props.songs.length > 0 ? (
                  this.props.songs.map((song, index) => {
                    return (
                      <li key={song.id} onClick={() => this.check(song.id)}>
                        <p className="songlist_index songlist_num3">
                          {index + 1}
                        </p>
                        <div className="songlist_name">
                          <p className="song_name">{song.name}</p>
                          <p className="singer_name">
                            {song.ar.map(singer => (
                              <span key={singer.id}>{singer.name}</span>
                            ))}
                          </p>
                        </div>
                        <p className="iconfont icon-download songList_xiazai"></p>
                      </li>
                    );
                  })
                ) : (
                  <Loading></Loading>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SongList;
