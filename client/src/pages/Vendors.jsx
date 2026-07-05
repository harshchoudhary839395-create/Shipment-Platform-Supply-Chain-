import { useEffect, useState } from 'react';
import VendorForm from '../components/vendors/VendorForm';
import { createVendor, getVendors, updateVendor } from '../services/api';

export default function Vendors() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const response = await getVendors();
      setItems(response?.data?.data || []);
    } catch (error) {
      console.error(error);
      setError('Unable to load vendors.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      if (selectedItem?._id) {
        await updateVendor(selectedItem._id, payload);
      } else {
        await createVendor(payload);
      }
      setError('');
      setShowForm(false);
      setSelectedItem(null);
      await loadData();
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to save vendor.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Supplier management</p>
          <h1>Vendors</h1>
        </div>
        <button type="button" onClick={() => { setSelectedItem(null); setShowForm(true); }}>New vendor</button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {showForm ? (
        <VendorForm initialData={selectedItem} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      ) : null}

      <div className="list-card">
        {items.length === 0 ? <p>No vendors yet.</p> : items.map((item) => (
          <div key={item._id} className="list-item">
            <div>
              <strong>{item.name}</strong>
              <p className="muted">{item.category}</p>
            </div>
            <div className="stack" style={{ alignItems: 'flex-end', gap: '6px', margin: 0 }}>
              <span className="pill">{item.status}</span>
              <button type="button" className="secondary-btn" onClick={() => { setSelectedItem(item); setShowForm(true); }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
