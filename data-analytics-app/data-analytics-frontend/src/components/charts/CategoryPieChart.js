// // src/components/charts/CategoryPieChart.js
// import React from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Card, Spin, Typography } from 'antd';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

// const CategoryPieChart = ({ data, loading }) => {
//   return (
//     <Card title="Event Category Distribution">
//       <Spin spinning={loading}>
//         <div style={{ height: 300 }}>
//           {data.length > 0 ? (
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={data} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
//                   {data.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <Typography.Text type="secondary">No data available for the selected period.</Typography.Text>
//           )}
//         </div>
//       </Spin>
//     </Card>
//   );
// };

// export default CategoryPieChart;

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Spin, Typography } from 'antd';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const CategoryPieChart = ({ data, loading }) => {
  return (
    <Card title="Event Category Distribution">
      <Spin spinning={loading}>
        <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography.Text type="secondary">No data available for the selected period.</Typography.Text>
          )}
        </div>
      </Spin>
    </Card>
  );
};

export default CategoryPieChart;