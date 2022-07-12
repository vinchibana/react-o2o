import React from "react";
import { Toast } from "antd-mobile";
import "./index.scss";
import axios from "axios";
import { getCurrentCity } from "../../utils";
import { List, AutoSizer } from "react-virtualized";
import Nav from '../../components/nav'

const formatCity = (list) => {
  const cityList = {};
  list.forEach((item) => {
    const first = item.short.substring(0, 1);
    if (cityList[first]) {
      cityList[first].push(item);
    } else {
      cityList[first] = [item];
    }
  });

  const cityIndex = Object.keys(cityList).sort();
  return {
    cityList,
    cityIndex,
  };
};
const HOUSE_CITY = ["北京", "上海", "广州", "深圳"];
const TITLE_HEIGHT = 36;
const NAME_HEIGHT = 50;
const formatCityIndex = (letter) => {
  switch (letter) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return letter.toUpperCase();
  }
};

export default class CityList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0,
    };
    this.cityListComponent = React.createRef();
  }

  async componentDidMount() {
    await this.getCityList();
    this.cityListComponent.current.measureAllRows();
  }

  async getCityList() {
    const res = await axios.get("http://localhost:8080/area/city?level=1");
    const { cityList, cityIndex } = formatCity(res.data.body);
    const hotRes = await axios.get("http://localhost:8080/area/hot");
    cityList["hot"] = hotRes.data.body;
    cityIndex.unshift("hot");
    const currentCity = await getCurrentCity();
    cityList["#"] = [currentCity];
    cityIndex.unshift("#");

    this.setState({
      cityList,
      cityIndex,
    });
  }

  changeCity({ label, value }) {
    if (HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem("hkzf_city", JSON.stringify({ label, value }));
      this.props.history.go(-1);
    } else {
      Toast.info("该城市暂无房源数据", 2, null, false);
    }
  }
  rowRenderer = ({ key, index, style }) => {
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index];

    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => {
              this.changeCity(item);
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  renderCityIndex() {
    const { cityIndex, activeIndex } = this.state;
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          this.cityListComponent.current.scrollToRow(index);
        }}
      >
        <span className={activeIndex === index ? "index-active" : ""}>
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
  }

  getRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state;
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
  };

  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex)
      this.setState({
        activeIndex: startIndex,
      });
  };

  render() {
    return (
      <div className="citylist">
        <Nav>城市选择</Nav>
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              ref={this.cityListComponent}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
