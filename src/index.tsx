import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import './assets/common.less';
import LayoutWapper from "./layout";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // theme={{ token: { colorPrimary: "#00b96b" } }}
  <ConfigProvider >
    <LayoutWapper/>
  </ConfigProvider>
);
