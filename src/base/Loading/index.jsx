import React from 'react'
import './index.css'
import loading from "./loading.gif";
export default (props) => {
  return (
    <div className="loading">
      <img style={{width:60,height:60}} src={loading} alt="Loading" />
      <p className="desc">{props.title}</p>
    </div>
  )
}
