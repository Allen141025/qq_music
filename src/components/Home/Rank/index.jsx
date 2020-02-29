import React from 'react'
import { connect } from 'react-redux'
import { loadTopList } from '../../../store/rank.redux'
import Loading from '../../../base/Loading'
import './index.css'
@connect(
  state => ({
    list: state.rank.list
  }),
  { loadTopList }
)
class Rank extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.props.loadTopList()
  }
  render() {
    return (
      <div className="rank">
        <ul>
          {this.props.list.length>0?this.props.list.map(val => (
              <li key={val.id}>
                <p className="ph_img">
                  <img src={val.coverImgUrl} alt=""/>
                  <span className="iconfont icon-erji">{val.playCount}</span>
                </p>
                <div className="ph_song_list">
                  <span className="iconfont icon-you"></span>
                  <h2>{val.name}</h2>
                  <p>{val.description}</p>
                </div>
              </li>
          )):<Loading></Loading>
        }
        </ul>
      </div>
    )
  }
}
export default Rank
