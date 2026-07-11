import { useEffect, useState } from 'react';
import { getAlerts, getSummary, markAlertRead } from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertError, setAlertError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryResponse, alertsResponse] = await Promise.all([getSummary(), getAlerts({ isRead: false })]);
        setSummary(summaryResponse?.data?.data || null);
        setAlerts(alertsResponse?.data?.data || []);
      } catch (error) {
        console.error(error);
        setAlertError('Unable to load alerts right now.');
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

  const handleMarkRead = async (id) => {
    try {
      await markAlertRead(id);
      setAlerts((current) => current.filter((alert) => alert._id !== id));
    } catch (error) {
      console.error(error);
      setAlertError('Unable to mark that alert as read.');
    }
  };

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

      <div className="card">
        <div className="page-header">
          <div>
            <p className="eyebrow">Live events</p>
            <h2>Open alerts</h2>
          </div>
        </div>
        {alertError ? <p className="error">{alertError}</p> : null}
        {alerts.length === 0 ? <p className="muted">No urgent alerts right now.</p> : (
          <div className="stack">
            {alerts.map((alert) => (
              <div key={alert._id} className="list-item">
                <div>
                  <strong>{alert.message}</strong>
                  <p className="muted">{alert.severity} • {new Date(alert.createdAt).toLocaleString()}</p>
                </div>
                <button type="button" className="secondary-btn" onClick={() => handleMarkRead(alert._id)}>Mark read</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}