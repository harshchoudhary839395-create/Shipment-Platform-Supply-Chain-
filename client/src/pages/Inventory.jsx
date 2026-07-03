import { useEffect, useState } from 'react';
import { getInventory } from '../services/api';

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getInventory();
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
          <p className="eyebrow">Stock control</p>
          <h1>Inventory</h1>
        </div>
      </div>

      <div className="list-card">
        {items.length === 0 ? <p>No inventory items yet.</p> : items.map((item) => (
          <div key={item._id} className="list-item">
            <div>
              <strong>{item.name}</strong>
              <p className="muted">SKU: {item.sku}</p>
            </div>
            <span className="pill">{item.stockStatus}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
