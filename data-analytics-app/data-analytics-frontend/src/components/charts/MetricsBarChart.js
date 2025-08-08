import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Spin, Typography } from 'antd';

const MetricsBarChart = ({ data, loading }) => {
  return (
    <Card title="Average Metric Value by User">
        <Spin spinning={loading}>
            <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="username" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="averageValue" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
      </Spin>
    </Card>
  );
};

export default MetricsBarChart;