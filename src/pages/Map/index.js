import React from "react";
import "./index.scss";
import { NavBar } from "antd-mobile";
export default class Map extends React.Component {
  componentDidMount() {
    const map = new AMap.Map("container", {
      zoom: 14,
    });
  }

  render() {
    return (
      <div className="map">
        <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back"></i>}
          onLeftClick={() => this.props.history.go(-1)}
        >
          地图找房
        </NavBar>

        <div id="container"></div>
      </div>
    );
  }
}
