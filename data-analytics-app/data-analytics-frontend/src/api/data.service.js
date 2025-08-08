
import api from './axios';
import { saveAs } from 'file-saver';

// --- API Service Functions ---

const getUsers = () => {
  return api.get('/data/users');
};

const getSummary = (filters) => {
  return api.get('/data/summary', { params: filters });
};

const getEventsOverTime = (filters) => {
  return api.get('/data/charts/events-over-time', { params: filters });
};

// const getEventCategoryDistribution = (filters) => {
//   return api.get('/data/charts/event-category-distribution', { params: filters });
// };

const getMetricsByUser = () => {
  return api.get('/data/charts/metrics-by-user');
};

const createEvent = (payload) => {
  return api.post('/data/events', payload);
};

const createMetric = (payload) => {
    return api.post('/data/metrics', payload);
};

const createReport = (payload) => {
    return api.post('/data/reports', payload);
};

// const exportData = async (filters) => {
//   try {
//     const response = await api.get('/data/export', {
//       params: filters,
//       responseType: 'blob',
//     });
    
//     const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
//     const fileName = `analytics_export_${new Date().toISOString().split('T')[0]}.csv`;
//     saveAs(blob, fileName);

//   } catch (error) {
//     console.error("Export failed:", error);
//     alert("Export failed. There might be no data for the selected filters.");
//   }
// };

// ... (other functions like getUsers, getSummary, etc.)

// --- THIS IS THE FINAL, VERIFIED EXPORT FUNCTION ---
const exportData = async (filters) => {
  try {
    const response = await api.get('/data/export', {
      params: filters,
      responseType: 'blob', // Important: tells axios to expect a file/binary response
    });
    
    // Use file-saver to trigger the download
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const fileName = `analytics_export_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);

  } catch (error) {
    console.error("Export failed:", error);
    if (error.response && error.response.status === 404) {
        alert("Cannot export: No event data was found for the current filters.");
    } else {
        alert("An unexpected error occurred during the export.");
    }
  }
};

// ... (rest of the service file)


// --- Export the DataService object with all functions ---
const DataService = {
  getUsers,
  getSummary,
  getEventsOverTime,
  // getEventCategoryDistribution,
  getMetricsByUser,
  createEvent,
  createMetric,
  createReport,
  exportData
};

export default DataService;