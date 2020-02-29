import React from 'react';
import { Carousel, WingBlank } from 'antd-mobile';
import './index.css';
export default class Swiper extends React.Component {
  state = {
    imgHeight: 176,
  }
  componentDidMount() {
    // simulate img loading
  }
  render() {
    return (
      <WingBlank>
        <Carousel
          autoplay={false}
          infinite
        >
          {this.props.banners.map(val => (
            <a
              key={val.bannerId}
              href="https://music.163.com/"
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src={val.pic}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))}
        </Carousel>
      </WingBlank>
    );
  }
}