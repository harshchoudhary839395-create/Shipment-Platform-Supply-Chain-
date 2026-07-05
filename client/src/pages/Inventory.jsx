import { useEffect, useState } from 'react';
import InventoryForm from '../components/inventory/InventoryForm';
import { createInventory, getInventory, getVendors, updateInventory } from '../services/api';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [inventoryResponse, vendorsResponse] = await Promise.all([getInventory(), getVendors()]);
      setItems(inventoryResponse?.data?.data || []);
      setVendors(vendorsResponse?.data?.data || []);
    } catch (error) {
      console.error(error);
      setError('Unable to load inventory data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      if (selectedItem?._id) {
        await updateInventory(selectedItem._id, payload);
      } else {
        await createInventory(payload);
      }
      setError('');
      setShowForm(false);
      setSelectedItem(null);
      await loadData();
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to save inventory item.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Stock control</p>
          <h1>Inventory</h1>
        </div>
        <button type="button" onClick={() => { setSelectedItem(null); setShowForm(true); }}>New item</button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {showForm ? (
        <InventoryForm initialData={selectedItem} vendors={vendors} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      ) : null}

      <div className="list-card">
        {items.length === 0 ? <p>No inventory items yet.</p> : items.map((item) => (
          <div key={item._id} className="list-item">
            <div>
              <strong>{item.name}</strong>
              <p className="muted">SKU: {item.sku}</p>
            </div>
            <div className="stack" style={{ alignItems: 'flex-end', gap: '6px', margin: 0 }}>
              <span className="pill">{item.stockStatus}</span>
              <button type="button" className="secondary-btn" onClick={() => { setSelectedItem(item); setShowForm(true); }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
