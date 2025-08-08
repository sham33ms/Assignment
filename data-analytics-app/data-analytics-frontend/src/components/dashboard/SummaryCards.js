// src/components/dashboard/SummaryCards.js
import React from 'react';
import { Row, Col, Card, Statistic, Skeleton } from 'antd';
import { UserOutlined, BarChartOutlined, FileTextOutlined } from '@ant-design/icons';

const SummaryCards = ({ data, loading }) => {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic title="Total Users" value={data.totalUsers} prefix={<UserOutlined />} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic title="Total Events" value={data.totalEvents} prefix={<BarChartOutlined />} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic title="Reports Generated" value={data.totalReports} prefix={<FileTextOutlined />} />
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;