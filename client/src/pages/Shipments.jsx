import { useEffect, useState } from 'react';
import { getShipments } from '../services/api';

export default function Shipments() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getShipments();
        setItems(response?.data?.data || []);
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
          <p className="eyebrow">Tracking</p>
          <h1>Shipments</h1>
        </div>
      </div>

      <div className="list-card">
        {items.length === 0 ? <p>No shipments yet.</p> : items.map((item) => (
          <div key={item._id} className="list-item">
            <div>
              <strong>{item.trackingNumber}</strong>
              <p className="muted">{item.vendor?.name || 'Unassigned vendor'}</p>
            </div>
            <span className="pill">{item.currentStatus}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
