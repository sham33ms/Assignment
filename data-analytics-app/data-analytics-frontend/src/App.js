import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import { DashboardOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './App.css';

import { useAuth } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';


const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isAuthenticated && (
        <Sider collapsible>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
          </Menu>
        </Sider>
      )}
      <Layout>
        {isAuthenticated && (
          <Header className="site-layout-header">
            <Space>
              <UserOutlined />
              <Text strong>{user.username}</Text>
            </Space>
            <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </Header>
        )}
        <Content style={{ margin: '16px' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Data Analytics Platform ©2025 Created by Gemini</Footer>
      </Layout>
    </Layout>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;