import React from "react";
import "./index.scss";
import Nav from '../../components/nav'

export default class Map extends React.Component {
  componentDidMount() {
    const map = new AMap.Map("container", {
      zoom: 14,
    });
  }

  render() {
    return (
      <div className="map">
        <Nav>地图找房</Nav>
        <div id="container"></div>
      </div>
    );
  }
}
