import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Analytics() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/analytics/summary', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(response?.data?.data || null);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Performance insights</p>
          <h1>Analytics</h1>
        </div>
      </div>

      {summary ? (
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
      ) : <p>Loading analytics...</p>}
    </div>
  );
}
