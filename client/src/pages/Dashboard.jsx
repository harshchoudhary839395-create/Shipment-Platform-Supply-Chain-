import { useEffect, useState } from 'react';
import { getSummary } from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getSummary();
        setSummary(response?.data?.data || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const cards = [
    { label: 'Active Vendors', value: summary?.vendors?.active ?? '—' },
    { label: 'Total Shipments', value: summary?.shipments?.total ?? '—' },
    { label: 'Low Stock Items', value: summary?.inventory?.lowStock ?? '—' },
    { label: 'Unread Alerts', value: summary?.alerts?.unread ?? '—' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1>Supply chain dashboard</h1>
        </div>
      </div>

      {loading ? <p>Loading dashboard...</p> : null}

      <div className="card-grid">
        {cards.map((card) => (
          <div key={card.label} className="card">
            <p className="muted">{card.label}</p>
            <h2>{card.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}