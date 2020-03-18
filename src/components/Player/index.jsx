import React from "react";
import "./index.css";
import {
  loadAlbum,
  loadUrl,
  checkSong,
  loadLyric,
  loadDetail
} from "../../store/player.redux";
import { connect } from "react-redux";
import { Toast } from "antd-mobile";
import { reverseConvert } from "../../util";
@connect(
  state => ({
    songId: state.player.songId, //歌曲ID
    songName: state.player.songName, //歌曲名称
    singer: state.player.singer, //歌手列表
    singerPicUrl: state.player.singerPicUrl, //歌手图片
    albumId: state.player.albumId, //专辑ID
    albumName: state.player.albumName, //专辑名称
    albumPicUrl: state.player.albumPicUrl, //专辑LOGO
    url: state.player.url, //歌曲播放地址
    lyric: state.player.lyric, //歌词
    songs_search: state.search.songs, //搜索出来的歌单列表
    songs_list: state.songList.songs, //精品歌单列表
    isCheck: state.player.isCheck //是否能播放
  }),
  {
    loadAlbum,
    loadUrl,
    checkSong,
    loadLyric,
    loadDetail
  }
)
class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: true, //是否正在播放
      currentIndex: 0, //播放到几句歌词，从0开始
      from: "", //从哪个组件跳转过来
      hideSpeed: true, //是否显示速度菜单
      speed: 1, //当前播放速度
      muted: false, //是否静音
      currentTime: 0, //当前的播放进度
      duration: 0, //总时长
      songId: 0,
      fetchCount: 0, //请求数量
      playPercent: 0, //播放进度时间比
      volume: 100 //默认音量
    };
  }
  componentDidMount() {
    console.log("从哪来的: ", this.props.location.state);
    this.setState({
      from: this.props.location.state ? this.props.location.state.from : ""
    });
    let audioId = this.props.match.params.id;
    console.log("歌曲ID：", audioId);
    this.init(audioId);
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.albumId !== this.props.albumId ||
      (nextProps.albumId !== 0 && nextProps.singerPicUrl === "")
    ) {
      this.props.loadAlbum(nextProps.albumId);
    }
    //fetchCount为并发数量，如果为4，说明四大接口请求都已经完成了，然后再去判断当前这首歌能不能播放
    if (this.state.fetchCount === 4) {
      if (
        (!nextProps.isCheck.success &&
          nextProps.isCheck.message !== "" &&
          nextProps.songId === this.state.songId) ||
        (nextProps.url === null && nextProps.songId === this.state.songId)
      ) {
        console.log(this.state.songId + "不能放");
        Toast.info("亲爱的，歌曲暂时无法播放", 5);
        setTimeout(() => this.refs.audio.pause(), 0);
        this.setState({
          playing: false
        });
      } else {
        console.log(this.state.songId + "能放", nextProps.url);
        this.refs.audio.play();
        this.setState({
          playing: true
        });
      }
    }
  }
  //歌词处理函数
  process = event => {
    let inner = this.refs.inner; //歌词容器
    let plist = inner.getElementsByTagName("p"); //找到所有存放歌词的P标签
    //1.当前的播放进度
    let audio = event.target;
    let currentTime = parseInt(audio.currentTime);
    //2.遍历歌词数组(对比，当前播放进度是否能在数组里找到对应的时间轴)
    this.props.lyric.forEach((l, i) => {
      if (currentTime === parseInt(l.time)) {
        this.setState({
          currentIndex: i
        });
        //3.找到下标对应的P标签的高度 * i 作为 inner的 -top值
        inner.style.top = plist[i].offsetHeight * -i + "px";
      }
    });
    //3.设置当前播放进度和总时长(duration初识时是NaN)
    //播放时间比
    let playPercent = (currentTime / audio.duration).toFixed(2) * 100;
    this.setState({
      currentTime,
      duration: isNaN(audio.duration) ? 0 : audio.duration,
      playPercent
    });
  };
  //播放与暂停
  run = () => {
    this.setState(
      {
        playing: !this.state.playing
      },
      () => {
        if (this.state.playing) {
          this.refs.audio.play(); //播放
        } else {
          this.refs.audio.pause(); //暂停
        }
      }
    );
  };
  //速度菜单隐藏与显示
  toggleSpeedMenu = () => {
    this.setState({
      hideSpeed: !this.state.hideSpeed
    });
  };
  //改变速度
  changeSpeed = currentSpeed => {
    this.refs.audio.playbackRate = currentSpeed;
    this.setState({
      speed: currentSpeed
    });
  };
  //静音设置
  setMuted = () => {
    this.setState(
      {
        muted: !this.state.muted
      },
      () => {
        this.refs.audio.muted = this.state.muted;
      }
    );
  };
  //上一首
  prev = () => {
    let s = this.getIndex();
    //本首歌已经是第一首了，或者歌单暂时是空的，所以Index是-1
    if (s.index === -1 || s.index === 0) {
      Toast.info("暂无上一曲", 2);
    } else {
      let prevIndex = s.index - 1;
      let prevSong = s.songs[prevIndex];
      this.init(prevSong.id);
    }
  };

  //下一首
  next = () => {
    // search  songList/123123
    let s = this.getIndex();
    //本首歌已经是最后一首了，或者歌单暂时是空的，所以Index是-1
    if (s.index === -1 || s.index === s.songs.length - 1) {
      Toast.info("暂无下一曲", 2);
    } else {
      let nextIndex = s.index + 1;
      let nextSong = s.songs[nextIndex];
      this.init(nextSong.id);
    }
  };

  init = audioId => {
    this.setState({ fetchCount: 0 });
    this.props.checkSong(audioId, this.calcCount); //歌曲是否能播放
    this.props.loadDetail(audioId, this.calcCount); //加载歌曲详情信息
    this.props.loadUrl(audioId, this.calcCount); //加载播放地址
    this.props.loadLyric(audioId, this.calcCount); //加载歌词
    this.setState({
      songId: audioId
    });
  };

  calcCount = () => {
    this.setState({
      fetchCount: this.state.fetchCount + 1
    });
  };

  //根据当前歌曲ID去对应的歌单列表里寻找其坐在下标
  getIndex = () => {
    if (this.state.from.includes("search")) {
      let index = this.props.songs_search.findIndex(
        song => song.id === this.props.songId
      );
      return { index, songs: this.props.songs_search };
    } else if (this.state.from.includes("songList")) {
      let index = this.props.songs_list.findIndex(
        song => song.id === this.props.songId
      );
      return { index, songs: this.props.songs_list };
    } else {
      return { index: -1, songs: [] };
    }
  };

  //音量设置
  setVolume = e => {
    //1.获取鼠标坐标 - 父容器的Left
    let parent = e.currentTarget; //这里取绑定的标签才是真正的父元素、target则是指被触发的元素，不一定是父元素
    let sub = e.pageX - parent.getBoundingClientRect().left;
    //2.用sub除以父容器宽度 *１００　＝进度百分比
    let p = parseInt((sub / parent.clientWidth) * 100);
    console.log("当前音量：", p);
    this.refs.audio.volume = p / 100;
    this.setState({
      volume: p
    });
  };

  //播放进度控制(思路和音量一样)
  setProgress = e => {
    let parent = e.currentTarget;
    let sub = e.pageX - parent.getBoundingClientRect().left;
    let p = (sub / parent.clientWidth).toFixed(2);
    //p是当前位置与总宽度的比例，通过该比例计算当前音频的播放进度：比例 * 总时长
    this.refs.audio.currentTime = this.state.duration * p;
    this.setState({
      playPercent: p * 100
    });
  };
  render() {
    return (
      <div className="player">
        <div className="playHead">
          <p className="p1">
            <img
              src="https://y.gtimg.cn/music/common/upload/t_playsong_ad/1207759.png?max_age=2592000"
              alt=""
            />
          </p>
          <p className="p2">千万正版音乐,海量无损曲库</p>
          <p className="p3">立即使用</p>
        </div>
        <div className="playInfo">
          <div className="loging"></div>
          <p
            className="songPic"
            style={{ backgroundImage: `url(${this.props.albumPicUrl})` }}
          ></p>
          <div className="playVideo">
            {/* 海报、人名 */}
            <div className="play_song">
              <p className={`singerPic1 ${this.state.playing ? "" : "pause"}`}>
                <img src={this.props.singerPicUrl} alt="" />
              </p>
              <p className="play_songName">{this.props.songName}</p>
              <p className="play_singeName">
                {this.props.singer.map((s, i) => (
                  <span key={s.id}>{s.name}</span>
                ))}
              </p>
            </div>
            {/* 歌词 */}
            <div className="lrc" ref="lrc">
              <div className="lrc_box">
                <div className="inner" style={{ top: 100 }} ref="inner">
                  {this.props.lyric.map((mc, ind) => (
                    <p
                      time={mc.time}
                      key={ind}
                      className={
                        this.state.currentIndex === ind ? "active" : ""
                      }
                    >
                      {mc.words}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="audioBox">
              <audio
                loop
                src={this.props.url}
                ref="audio"
                onTimeUpdate={this.process}
              ></audio>
              <h2 className="play_btn_songname">
                {this.props.songName} | 歌手 :
                {this.props.singer.map((s, i) => (
                  <span key={s.id}>{s.name}</span>
                ))}
              </h2>
              {/* 播放控制按钮 */}
              <div className="play_btn_box">
                <p
                  className="preve iconfont icon-zuobofang"
                  onClick={this.prev}
                ></p>
                <p
                  className={`iconfont bofang ${
                    this.state.playing ? "icon-bofang2" : "icon-bofang1"
                  }`}
                  onClick={this.run}
                ></p>
                <p
                  className="next iconfont icon-youbofang"
                  onClick={this.next}
                ></p>
              </div>
              {/* 音量 */}
              <div className="play_acound">
                {/* <p className="['iconfont','muted',isMuted?'icon-jingyin':'icon-yinliang']"></p> */}
                <p
                  className={`iconfont muted ${
                    this.state.muted ? "icon-jingyin" : "icon-yinliang"
                  }`}
                  onClick={this.setMuted}
                ></p>
                <div
                  className="acoundBox"
                  ref="progressBar"
                  onClick={this.setVolume}
                >
                  <div
                    className="acoundJindu"
                    ref="progress"
                    style={{ width: this.state.volume }}
                  ></div>
                </div>
              </div>
              {/* 进度 */}
              <div className="play_plan_box">
                <div className="play_plan" onClick={this.setProgress}>
                  <div
                    className="play_plan_aa"
                    style={{ width: this.state.playPercent + "%" }}
                    ref="playProgress"
                  ></div>
                </div>
                <p className="play_time">
                  {reverseConvert(this.state.currentTime)} /{" "}
                  {reverseConvert(this.state.duration)}
                </p>
              </div>
              {/* 速度 */}
              <div className="speedBox" onClick={this.toggleSpeedMenu}>
                <span>倍速</span>
                <b ref="speedBox">{this.state.speed}</b>
                <div
                  className="speed_cont speed_cont1"
                  hidden={this.state.hideSpeed}
                >
                  <p
                    spedd="0.5"
                    className={this.state.speed === 0.5 ? "speedOn" : ""}
                    onClick={() => this.changeSpeed(0.5)}
                  >
                    0.5
                  </p>
                  <p
                    spedd="1"
                    className={this.state.speed === 1 ? "speedOn" : ""}
                    onClick={() => this.changeSpeed(1)}
                  >
                    1.0
                  </p>
                  <p
                    spedd="1.5"
                    className={this.state.speed === 1.5 ? "speedOn" : ""}
                    onClick={() => this.changeSpeed(1.5)}
                  >
                    1.5
                  </p>
                  <p
                    spedd="2"
                    className={this.state.speed === 2 ? "speedOn" : ""}
                    onClick={() => this.changeSpeed(2)}
                  >
                    2.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Player;
