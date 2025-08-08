// src/components/charts/EventsLineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Spin, Typography } from 'antd';

const EventsLineChart = ({ data, loading }) => {
  return (
    <Card title="Events Over Time">
        <Spin spinning={loading}>
            <div style={{ height: 300 }}>
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <Typography.Text type="secondary">No data available for the selected period.</Typography.Text>
                )}
            </div>
      </Spin>
    </Card>
  );
};

export default EventsLineChart;