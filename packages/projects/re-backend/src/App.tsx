import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import tsIcon from '/typescript.svg';
import { routes } from '@/routes';
import { Outlet } from 'react-router-dom';
import { useRoutes } from '@/hooks';

const { Header, Content, Sider, Footer } = Layout;

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { navigate, menu, openKeys, selectedKeys, setOpenKeys } =
        useRoutes(routes);

    return (
        <Layout className="h-full">
            <Header className="flex items-center">
                <img src={tsIcon} alt="" />
            </Header>
            <Layout>
                <Sider
                    width={200}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <Menu
                        mode="inline"
                        selectedKeys={selectedKeys}
                        openKeys={openKeys}
                        onOpenChange={setOpenKeys}
                        onClick={({ keyPath }) => {
                            navigate(keyPath?.[0]);
                        }}
                        className="h-full border-r-0 overflow-y-auto"
                        items={menu}
                    />
                </Sider>
                <Layout>
                    <Layout className="p-6 overflow-y-auto">
                        <Content className="">
                            <Outlet />
                        </Content>
                    </Layout>
                    <Footer className="text-center">
                        admin ©2023 Created by yhfu@stu.xidian.edu.cn
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;
