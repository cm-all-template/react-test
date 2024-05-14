import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import './index.less';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("终端管理", "1", <PieChartOutlined />),
  getItem("基准库", "2", <DesktopOutlined />),
  getItem("策略管理", "sub1", <UserOutlined />, [
    getItem("静态度量", "3"),
    getItem("动态度量", "4"),
    getItem("文件访问控制", "5"),
  ]),
  getItem("软件升级", "6", <FileOutlined />),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "user" }, { title: "buill" }]}
          >
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            这是内容.
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
