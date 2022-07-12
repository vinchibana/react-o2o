import React from "react";
import { NavBar } from "antd-mobile";
import { withRouter } from "react-router-dom";
import style from "./index.module.css";
import PropTypes from "prop-types";

function Nav({ children, history, onLeftClick }) {
  const defaultHandler = () => history.go(-1);
  return (
    <NavBar
      className={style.navbar}
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={onLeftClick || defaultHandler}
    >
      {children}
    </NavBar>
  );
}

Nav.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,
};
export default withRouter(Nav);
