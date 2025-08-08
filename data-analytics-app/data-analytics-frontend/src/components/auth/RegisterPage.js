import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import AuthService from '../../services/auth.service';
import './LoginPage.css'; // We can reuse the login page's CSS

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (values) => {
    setLoading(true);
    setError('');
    AuthService.signup(values.username, values.email, values.password)
      .then(() => {
        message.success('Registration successful! You can now log in.');
        navigate('/login'); // Redirect to login page on success
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} className="login-title">Create an Account</Title>
        <Spin spinning={loading} tip="Registering...">
          <Form name="register" onFinish={handleRegister}>
            <Form.Item name="username" rules={[{ required: true, message: 'Please input your desired username!' }]}>
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
            </Form.Item>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />}
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Register
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Link to="/login">Already have an account? Log In</Link>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default RegisterPage;