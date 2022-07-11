import React from "react";
import axios from "axios";
import { Carousel, Flex, Grid, WingBlank } from "antd-mobile";
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";
import "./index.scss";

const nav = [
  {
    id: 1,
    img: Nav1,
    title: "整租",
    path: "/home/list",
  },
  {
    id: 2,
    img: Nav2,
    title: "合租",
    path: "/home/list",
  },
  {
    id: 3,
    img: Nav3,
    title: "地图找房",
    path: "/map",
  },
  {
    id: 4,
    img: Nav4,
    title: "去出租",
    path: "/home/list",
  },
];

export default class Index extends React.Component {
  state = {
    data: [1, 2, 3],
    groups: [],
    news: [],
    cityName: "威海",
    imgHeight: 212,
  };

  async getSwipers() {
    const res = await axios.get("http://localhost:8080/home/swiper");
    this.setState({
      data: res.data.body,
    });
  }

  async getGroups() {
    const res = await axios.get("http://localhost:8080/home/groups", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    this.setState({
      groups: res.data.body,
    });
  }

  async getNews() {
    const res = await axios.get("http://localhost:8080/home/news", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    this.setState({
      news: res.data.body,
    });
  }

  getCityName() {
    AMap.plugin("AMap.CitySearch", () => {
      const citySearch = new AMap.CitySearch();
      citySearch.getLocalCity(async (status, result) => {
        if (status === "complete" && result.info === "OK") {
          const res = await axios.get(
            `http://localhost:8080/area/info?name=${result.city}`
          );
          this.setState({
            cityName: res.data.body.label,
          });
        }
      });
    });
  }
  renderSwiper() {
    return this.state.data.map((item) => (
      <a
        href="https://www.google.com"
        key={item}
        style={{
          display: "inline-block",
          width: "100%",
          height: this.state.imgHeight,
        }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: "100%", verticalAlign: "top" }}
          onLoad={() => {
            window.dispatchEvent(new Event("resize"));
            this.setState({ imgHeight: "auto" });
          }}
        />
      </a>
    ));
  }

  renderNav() {
    return nav.map((item) => (
      <Flex.Item
        key={item.id}
        onClick={() => {
          this.props.history.push(item.path);
        }}
      >
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ));
  }

  renderNews() {
    return this.state.news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ));
  }

  componentDidMount() {
    this.getSwipers();
    this.getGroups();
    this.getNews();
    this.getCityName();
  }

  render() {
    return (
      <div className="index">
        <div className="swiper">
          <Carousel autoplay={true} infinite>
            {this.renderSwiper()}
          </Carousel>

          {/* 搜索框 */}
          <Flex className="search-box">
            <Flex className="search">
              <div
                className="location"
                onClick={() => this.props.history.push("/citylist")}
              >
                <span className="name">{this.state.cityName}</span>
                <i className="iconfont icon-arrow"></i>
              </div>
              <div className="form">
                <i className="iconfont icon-search"></i>
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            <i
              className="iconfont icon-map"
              onClick={() => this.props.history.push("/map")}
            ></i>
          </Flex>
        </div>

        {/* 导航栏 */}
        <Flex className="nav">{this.renderNav()}</Flex>

        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            activeStyle={false}
            renderItem={(item) => (
              <Flex className="group-item" justify="around">
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>

        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}
