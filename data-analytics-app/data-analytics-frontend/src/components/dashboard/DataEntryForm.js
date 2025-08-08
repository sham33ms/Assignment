import React, { useState } from 'react';
import { Form, Input, Button, Select, Card, Spin, message, Typography } from 'antd';
import DataService from '../../api/data.service';

const { Option } = Select;
const { Title } = Typography;

const DataEntryForm = ({ onDataAdded }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    console.log('[FRONTEND DEBUG] handleSubmit triggered. Form values:', values);
    setLoading(true);

    try {
      let detailsObject = {};
      // This makes JSON parsing safer. If details is empty or just whitespace, it won't try to parse.
      if (values.details && values.details.trim() !== '') {
        console.log('[FRONTEND DEBUG] Parsing JSON details...');
        detailsObject = JSON.parse(values.details);
      }
      
      const payload = { ...values, details: detailsObject };
      
      console.log('[FRONTEND DEBUG] Preparing to call API service...');
      await DataService.createEvent(payload);
      console.log('[FRONTEND DEBUG] API call successful!');
      
      message.success('Event created successfully!');
      form.resetFields();
      if (onDataAdded) {
        onDataAdded();
      }
    } catch (error) {
      console.error('[FRONTEND DEBUG] An error occurred in handleSubmit:', error);
      if (error instanceof SyntaxError) {
        message.error('Invalid JSON format in details field.');
      } else {
        const errorMessage = error.response?.data?.message || "Failed to create event. Check console for details.";
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Title level={4}>Add New Event</Title>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="type" label="Event Type" rules={[{ required: true, message: 'Event type is required!' }]}>
            <Input placeholder="e.g., PageView, Login" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Category is required!' }]}>
            <Select placeholder="Select a category">
              <Option value="User Engagement">User Engagement</Option>
              <Option value="Security">Security</Option>
              <Option value="Reporting">Reporting</Option>
              <Option value="Analytics">Analytics</Option>
            </Select>
          </Form.Item>
          <Form.Item name="details" label="Details (JSON format)">
            <Input.TextArea rows={4} placeholder='e.g., {"page": "/contact"}' />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Event
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default DataEntryForm;