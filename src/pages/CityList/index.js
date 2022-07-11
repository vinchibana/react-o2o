import React from "react";
import { NavBar} from "antd-mobile";
import "./index.scss";
import axios from "axios";

export default class CityList extends React.Component {

  componentDidMount() {
    this.getCityList()
  }

  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    this.setState({

    })
  }

  render() {
    return (
      <div className="citylist">
        <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back"></i>}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar>
      </div>
    );
  }
}
