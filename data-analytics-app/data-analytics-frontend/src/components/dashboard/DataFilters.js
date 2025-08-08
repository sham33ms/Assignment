

import React, { useState, useEffect } from 'react';
import { Row, Col, DatePicker, Button, Select, Space , Card} from 'antd';
import DataService from '../../api/data.service';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DataFilters = ({ onFilterChange, onExport }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    DataService.getUsers().then(response => {
      setUsers(response.data);
    });
  }, []);

  const handleDateChange = (dates) => {
    onFilterChange({ 
      startDate: dates ? dates[0].startOf('day').toISOString() : null,
      endDate: dates ? dates[1].endOf('day').toISOString() : null
    });
  };

  const handleUserChange = (userId) => {
    onFilterChange({ userId: userId || null });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ category: category || null });
  };

  return (
    <Card>
      <Row gutter={[16, 16]} justify="space-between">
        <Col>
          <Space wrap>
            <RangePicker onChange={handleDateChange} />
            <Select placeholder="Filter by User" style={{ width: 200 }} onChange={handleUserChange} allowClear>
              {users.map(user => <Option key={user.id} value={user.id}>{user.username}</Option>)}
            </Select>
            <Select placeholder="Filter by Category" style={{ width: 200 }} onChange={handleCategoryChange} allowClear>
              <Option value="User Engagement">User Engagement</Option>
              <Option value="Security">Security</Option>
              <Option value="Reporting">Reporting</Option>
              <Option value="Analytics">Analytics</Option>
            </Select>
          </Space>
        </Col>
        <Col>
          <Button type="primary" onClick={onExport}>Export Data</Button>
        </Col>
      </Row>
    </Card>
  );
};

export default DataFilters;