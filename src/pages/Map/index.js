import React from "react";
import style from "./index.module.css";
import Nav from "../../components/nav";
import axios from "axios";
import { Toast } from "antd-mobile";
import { Link } from "react-router-dom";

export default class Map extends React.Component {
  state = {
    houseList: [],
    isShowList: false,
  };
  componentDidMount() {
    this.initMap();
  }

  initMap() {
    const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));
    let map = new AMap.Map("container", {
      zoom: 11,
      center: [118.397428, 39.90923],
      viewMode: "3D",
    });
    this.map = map;
    AMap.plugin(["AMap.Geocoder", "AMap.Scale", "AMap.ToolBar"], () => {
      map.addControl(new AMap.ToolBar());
      map.addControl(new AMap.Scale());
      const geocoder = new AMap.Geocoder({
        city: label,
      });
      geocoder.getLocation(label, async (status, result) => {
        if (status === "complete" && result.info === "OK") {
          const res = result.geocodes[0].location;
          map.setZoomAndCenter(10, [res.lng, res.lat]);
          await this.renderOverlays(value);
        }
      });
    });
  }

  // 区级房源数据
  async renderOverlays(id) {
    try {
      Toast.loading("加载中...", 0, null, false);
      const res = await axios.get(`http://localhost:8080/area/map?id=${id}`);
      Toast.hide();
      const data = res.data.body;
      const { nextZoom, type } = this.getZoomLevel();
      data.forEach((item) => {
        this.createOverlays(item, nextZoom, type);
      });
    } catch (e) {
      Toast.hide();
    }
  }

  createOverlays(data, zoom, type) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value,
    } = data;

    const position = new AMap.LngLat(longitude, latitude);
    const markerContent =
      "" +
      `<div class="${style.bubble}">` +
      `    <p class="${style.name}">${areaName}</p>` +
      `    <p>${count}</p>` +
      "</div>";

    const marker = new AMap.Marker({
      position: position,
      content: markerContent,
      offset: new AMap.Pixel(-35, -35),
    });
    if (type === "circle") {
      marker.on("click", () => {
        this.renderOverlays(value);
        this.map.setZoomAndCenter(zoom, position);
        this.map.clearMap();
      });
    } else {
      marker.on("click", async (e) => {
        await this.getHouseList(value);
        const target = e.pixel;
        this.map.panBy(
          window.innerWidth / 2 - target.x,
          (window.innerHeight - 330) / 2 - target.y,
          200
        );
      });
    }
    this.map.add(marker);
  }

  getZoomLevel() {
    const zoom = this.map.getZoom();
    let nextZoom, type;
    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13;
      type = "circle";
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15;
      type = "circle";
    } else if (zoom >= 14 && zoom < 16) {
      type = "rect";
    }
    return {
      nextZoom,
      type,
    };
  }

  async getHouseList(id) {
    const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`);
    this.setState({
      houseList: res.data.body.list,
      isShowList: true,
    });
  }

  renderHousesList() {
    return this.state.houseList.map((item) => (
      <div className={style.house} key={item.houseCode}>
        <div className={style.imgWrap}>
          <img
            className={style.img}
            src={`http://localhost:8080${item.houseImg}`}
            alt=""
          />
        </div>
        <div className={style.content}>
          <h3 className={style.title}>{item.title}</h3>
          <div className={style.desc}>{item.desc}</div>
          <div>
            {/* 动态匹配 tag 样式 */}
            {item.tags.map((tag, index) => {
              const tagClass = "tag" + (index + 1);
              return (
                <span
                  className={[style.tag, style[tagClass]].join(" ")}
                  key={tag}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          <div className={style.price}>
            <span className={style.priceNum}>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <div className={style.map}>
        {/* 顶部导航栏组件 */}
        <Nav>地图找房</Nav>
        {/* 地图容器元素 */}
        <div id="container" className={style.container} />
        <div
          className={[
            style.houseList,
            this.state.isShowList ? style.show : "",
          ].join(" ")}
        >
          <div className={style.titleWrap}>
            <h1 className={style.listTitle}>房源列表</h1>
            <Link className={style.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

          <div className={style.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    );
  }
}
