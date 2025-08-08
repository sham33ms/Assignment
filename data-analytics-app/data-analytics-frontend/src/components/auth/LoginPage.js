import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Make sure Link is imported
import { Form, Input, Button, Card, Typography, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');
    try {
      await login(values.username, values.password);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} className="login-title">Data Analytics Platform</Title>
        <Spin spinning={loading} tip="Logging in...">
          <Form name="login" onFinish={handleLogin}>
            <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />}
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Log in
              </Button>
            </Form.Item>
            {/* --- ADD THIS DIV TO LINK TO THE REGISTER PAGE --- */}
            <div style={{ textAlign: 'center' }}>
              <Link to="/register">Don't have an account? Sign Up</Link>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default LoginPage;