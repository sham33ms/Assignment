import React, { useState, useEffect } from 'react';
import { Row, Col, Alert, Space, Card } from 'antd';
import DataService from '../api/data.service';
import SummaryCards from '../components/dashboard/SummaryCards';
import DataFilters from '../components/dashboard/DataFilters';
import EventsLineChart from '../components/charts/EventsLineChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MetricsBarChart from '../components/charts/MetricsBarChart';
import DataEntryForm from '../components/dashboard/DataEntryForm';

const DashboardPage = () => {
  // State definitions for all data and UI controls
  const [summaryData, setSummaryData] = useState({});
  const [lineChartData, setLineChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [filters, setFilters] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Effect hook to fetch all dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v != null)
        );

        const [summaryRes, lineChartRes, pieChartRes, barChartRes] = await Promise.all([
          DataService.getSummary(cleanFilters),
          DataService.getEventsOverTime(cleanFilters),
          DataService.getEventCategoryDistribution(cleanFilters),
          DataService.getMetricsByUser()
        ]);
        
        setSummaryData(summaryRes.data);
        setLineChartData(lineChartRes.data);
        setPieChartData(pieChartRes.data);
        setBarChartData(barChartRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, refreshTrigger]);

  // Handler for when filters are changed in the UI
  const handleFilterChange = (newFilter) => {
    setFilters(prev => ({ ...prev, ...newFilter }));
  };

  // Handler for when new data is added via the form
  const handleDataAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      {error && <Alert message="Error" description={error} type="error" showIcon />}
      
      <SummaryCards data={summaryData} loading={loading} />
      <DataFilters onFilterChange={handleFilterChange} onExport={() => DataService.exportData(filters)} />

      <Row gutter={[24, 24]}>
        {/* Main Chart Area on the left */}
        <Col xs={24} xl={16}>
          <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <EventsLineChart data={lineChartData} loading={loading} />
            <CategoryPieChart data={pieChartData} loading={loading} />
          </Space>
        </Col>

        {/* Single Data Entry Form on the right */}
        <Col xs={24} xl={8}>
          <Card title="Add New Event">
            <DataEntryForm onDataAdded={handleDataAdded} />
          </Card>
        </Col>
      </Row>

      {/* Bar Chart at the bottom */}
      <Row>
        <Col span={24}>
          <MetricsBarChart data={barChartData} loading={loading} />
        </Col>
      </Row>
    </Space>
  );
};

export default DashboardPage;