import { useEffect, useState } from 'react';
import { getVendors } from '../services/api';

export default function Vendors() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getVendors();
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
          <p className="eyebrow">Supplier management</p>
          <h1>Vendors</h1>
        </div>
      </div>

      <div className="list-card">
        {items.length === 0 ? <p>No vendors yet.</p> : items.map((item) => (
          <div key={item._id} className="list-item">
            <div>
              <strong>{item.name}</strong>
              <p className="muted">{item.category}</p>
            </div>
            <span className="pill">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
