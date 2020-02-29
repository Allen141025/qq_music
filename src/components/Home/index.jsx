import React from 'react'
import {NavLink,Route,Switch,Redirect} from 'react-router-dom';
import Recommend from './Recommend';
import Rank from './Rank';
import Search from './Search';
import './index.css';
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="index">
        {/* <!-- 头部 --> */}
        <div className="headbox headbox1">
          <p className="p1">
            <img
              src="//y.gtimg.cn/mediastyle/mod/mobile/img/logo_ch.svg?max_age=2592000"
              alt="logo"
            />
          </p>
          <p className="p2">
            <span>下载APP</span>
          </p>
        </div>
        {/* <!-- 内容区域 --> */}
        <div className="conBox">
          {/* <!-- 导航区 --> */}
          <p className="nav">
            <NavLink to="/recommend" activeClassName="select">推荐</NavLink>
            <NavLink to="/rank" activeClassName="select">排行榜</NavLink>
            <NavLink to="/search" activeClassName="select">搜索</NavLink>
          </p>
          {/* <!-- 路由显示区域 --> */}
          <Switch>
            <Route path="/recommend" component={Recommend} />
            <Route path="/rank" component={Rank} />
            <Route path="/search" component={Search} />
            <Redirect to="/recommend"/>
          </Switch>
        </div>
        {/* <!-- 尾部 --> */}
        <div className="bottom">
          <a href="http://www.qq.com">安装QQ音乐，发现更多精彩</a>
        </div>
      </div>
    )
  }
}
export default Home
