import React from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import './index.css'
import Swiper from '../../../base/Swiper'
import Loading from '../../../base/Loading'
import {
  getRecommend,
  getDJBanner,
  getPlayList
} from '../../../store/recommend.redux'

@connect(
  state => ({
    banners: state.recommend.banners,
    djBanners: state.recommend.djBanners,
    playlists: state.recommend.playlists
  }),
  {
    getRecommend,
    getDJBanner,
    getPlayList
  }
)
class Recommend extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.props.getRecommend() //调用常规轮播图
    this.props.getDJBanner() //DJ轮播图
    this.props.getPlayList() //精品歌单
  }
  render() {
    return (
      <div className="recommend">
        {/* <Loading title="请稍后"></Loading> */}
        {/* <!-- 轮播图 --> */}
        <div className="banner">
          {
            this.props.banners.length>0?<Swiper banners={this.props.banners}></Swiper>:<Loading title="请稍后"></Loading>
          }
        </div>
        {/* // <!-- 电台 --> */}
        <div className="station">
          <h2 className="sta_title">电台</h2>
          <ul>
            {this.props.djBanners.map((val, index) => (
              <a href={val.url} key={index}>
                <li>
                  <div>
                    <img src={val.pic} alt="" />
                    <span className="iconfont icon-bofang"></span>
                  </div>
                  <h2 className="station_name">{val.typeTitle}</h2>
                </li>
              </a>
            ))}
          </ul>
        </div>
        {/* 歌单推荐 */}
        <div className="playlist">
          <h2 className="sta_title">精品歌单</h2>
          <ul>
            {this.props.playlists.map((p, i) => (
              <Link key={p.id} to={`/songList/${p.id}`}>
                <li>
                  <div className="list_photo">
                    <img src={p.coverImgUrl} alt={p.description} />
                    <span className="iconfont icon-erji">{p.playCount}</span>
                  </div>
                  <h2 className="station_name">{p.name}</h2>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        {/* <!-- 底部 --> */}
        <div className="foot">
          <p className="foot_computer">
            <a href="https://y.qq.com/?ADTAG=myqq&amp;nomobile=1#type=index">
              查看电脑版网页
            </a>
          </p>
          <p className="foot_logo">
            <img
              src="//y.gtimg.cn/mediastyle/mod/mobile/img/logo_ch.svg?max_age=2592000"
              alt=""
            />
          </p>
          <div className="copyright">
            <p>Copyright © 1998 - Tencent. All Rights Reserved.</p>
            <p>联系电话：0755-86013388 QQ群：55209235</p>
          </div>
        </div>
      </div>
    )
  }
}
export default Recommend
