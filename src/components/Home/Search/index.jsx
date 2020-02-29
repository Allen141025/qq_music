import React from "react";
import music from "./music.svg";
import "./index.css";
import { connect } from "react-redux";
import {
  loadHots,
  search,
  addKeywords,
  delHistory,
  clearHistory
} from "../../../store/search.redux";
import { checkSong } from "../../../store/player.redux";
import { Toast } from "antd-mobile";
import Loading from "../../../base/Loading";
@connect(
  state => ({
    hots: state.search.hots,
    songs: state.search.songs,
    keywords: state.search.keywords,
    isCheck: state.player.isCheck
  }),
  {
    loadHots,
    search,
    addKeywords,
    delHistory,
    clearHistory,
    checkSong
  }
)
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0, //准备要播放的歌曲ID
      hideSearchBtn: true, // 控制“搜索”和“取消”按钮的
      hideHistory: true, //控制“历史搜索记录”
      hideResult: true, //控制“搜索结果”
      hideHots: false //控制“热门搜索”
    };
  }
  componentDidMount() {
    this.props.loadHots(); //加载热门搜索
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
  showSearchBar = () => {
    //当文本框获得焦点的时候，让文本框容器宽度缩小，右侧按钮显示出来
    this.refs.ipt.style.width = "88%";
    //隐藏热门搜索、显示历史记录
    this.setState({
      hideHots: true,
      hideHistory: this.state.hideResult === false ? true : false
    });
  };
  toggleSearchBar = event => {
    let len = event.target.value.trim().length; //获取文本框内容的长度
    //根据长度来决定，是显示“搜索”还是“取消”
    this.setState({
      hideSearchBtn: len > 0 ? false : true
    });
  };
  cancel = () => {
    //点击“取消”，让文本框容器恢复成默认宽度
    this.refs.ipt.style.width = "96%";
    //让搜索列表隐藏,热门搜索显示
    this.setState({
      hideResult: true,
      hideHots: false,
      hideHistory: true
    });
  };
  find = () => {
    //点击“搜索”，获取文本框的值，调用数据接口
    let text = this.refs.searchInput.value.trim();
    this.props.search(text);
    //让搜索列表显示,热门搜索隐藏
    this.setState({
      hideResult: false,
      hideHots: true,
      hideHistory: true
    });
    this.props.addKeywords(text); //将搜索内容添加到历史记录中
  };
  searchHot = text => {
    //将搜索的热门词放到文本框里
    this.refs.searchInput.value = text;
    //以热门内容作为搜索条件
    this.props.search(text);
    //让搜索列表显示,热门搜索隐藏
    this.setState({
      hideResult: false,
      hideHots: true,
      hideHistory: true
    });
    this.props.addKeywords(text); //将搜索内容添加到历史记录中
  };
  render() {
    return (
      <div className="searchBox">
        <div className="iptBox">
          <div className="ipt" ref="ipt">
            <span className="iconfont icon-sousuo" id="search"></span>
            <input
              type="search"
              placeholder="搜索歌曲、歌单、专辑"
              id="searchInput"
              ref="searchInput"
              onFocus={this.showSearchBar}
              onChange={this.toggleSearchBar}
            />
          </div>
          <p
            className="callOff"
            hidden={!this.state.hideSearchBtn}
            onClick={this.cancel}
          >
            取消
          </p>
          <p
            className="callOff search_btn"
            hidden={this.state.hideSearchBtn}
            onClick={this.find}
          >
            搜索
          </p>
        </div>
        <div className="searchBar" v-show="!showSongList">
          <div className="search_hisTory" hidden={this.state.hideHistory}>
            <div className="search_hisTory_box">
              {this.props.keywords.map((key, index) => (
                <p key={index} onClick={() => this.searchHot(key)}>
                  {key}
                  <span
                    className="cross"
                    onClick={event => {
                      event.stopPropagation();
                      this.props.delHistory(key);
                    }}
                  >
                    X
                    {/* <Icon type="cross" size="lg" /> */}
                  </span>
                </p>
              ))}
              <h1
                hidden={this.props.keywords.length === 0}
                onClick={this.props.clearHistory}
              >
                清空历史搜索记录
              </h1>
            </div>
          </div>
          <div className="hotsearch" hidden={this.state.hideHots}>
            <h2 className="hotsearch_title">热门搜索</h2>
            <div className="hot_sea">
              {this.props.hots.map((h, i) => (
                <span
                  className={i === 0 ? "on" : ""}
                  key={i}
                  onClick={() => this.searchHot(h.first)}
                >
                  {h.first}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="search_songList" hidden={this.state.hideResult}>
          <ul>
            {this.props.songs.length > 0 ? (
              this.props.songs.map((song, index) => (
                <li key={song.id} onClick={() => this.check(song.id)}>
                  <img src={music} alt="" />
                  <div className="search_song_name">
                    <p className="search_song_name1">{song.name}</p>
                    <p className="search_song_name2">
                      {song.artists.map((singer, i) => (
                        <span key={i}>{singer.name}</span>
                      ))}
                    </p>
                  </div>
                  <span>{index + 1}</span>
                </li>
              ))
            ) : (
              <Loading></Loading>
            )}
            <li v-show="isEnd" className="isEnd">
              已经到底啦~
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
export default Search;
