import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getShipmentTrends, getSummary, getTopVendors } from '../services/api';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [topVendors, setTopVendors] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryResponse, trendsResponse, vendorsResponse] = await Promise.all([
          getSummary(),
          getShipmentTrends(),
          getTopVendors(),
        ]);
        setSummary(summaryResponse?.data?.data || null);
        setTrends((trendsResponse?.data?.data || []).map((entry) => ({
          ...entry,
          month: new Date(entry._id.year, entry._id.month - 1).toLocaleString('default', { month: 'short' }),
        })));
        setTopVendors(vendorsResponse?.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  const statusBreakdown = Object.entries(summary?.shipments?.byStatus || {}).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value,
  }));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Performance insights</p>
          <h1>Analytics</h1>
        </div>
      </div>

      {summary ? (
        <>
          <div className="card-grid">
            <div className="card">
              <p className="muted">Total Vendors</p>
              <h2>{summary?.vendors?.total}</h2>
            </div>
            <div className="card">
              <p className="muted">Inventory Value</p>
              <h2>${summary?.inventory?.totalValue}</h2>
            </div>
            <div className="card">
              <p className="muted">Out of Stock</p>
              <h2>{summary?.inventory?.outOfStock}</h2>
            </div>
            <div className="card">
              <p className="muted">Unread Alerts</p>
              <h2>{summary?.alerts?.unread}</h2>
            </div>
          </div>

          <div className="card-grid analytics-grid">
            <div className="card">
              <div className="page-header">
                <div>
                  <p className="eyebrow">Trend</p>
                  <h2>Shipment volume</h2>
                </div>
              </div>
              <div className="chart-card">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="page-header">
                <div>
                  <p className="eyebrow">Breakdown</p>
                  <h2>Status mix</h2>
                </div>
              </div>
              <div className="chart-card">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={statusBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0f766e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="page-header">
              <div>
                <p className="eyebrow">Performance</p>
                <h2>Top vendors</h2>
              </div>
            </div>
            <div className="stack">
              {topVendors.map((vendor) => (
                <div key={vendor._id} className="list-item">
                  <div>
                    <strong>{vendor.name}</strong>
                    <p className="muted">Overall score: {vendor.overallScore}</p>
                  </div>
                  <span className="pill">On-time {vendor.onTimeDeliveryRate}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : <p>Loading analytics...</p>}
    </div>
  );
}
