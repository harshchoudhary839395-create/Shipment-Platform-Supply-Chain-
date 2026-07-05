import { useEffect, useState } from 'react';
import ShipmentForm from '../components/shipments/ShipmentForm';
import ShipmentTimeline from '../components/shipments/ShipmentTimeline';
import { createShipment, getShipments, getVendors, updateShipment } from '../services/api';

export default function Shipments() {
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [shipmentsResponse, vendorsResponse] = await Promise.all([getShipments(), getVendors()]);
      setItems(shipmentsResponse?.data?.data || []);
      setVendors(vendorsResponse?.data?.data || []);
    } catch (error) {
      console.error(error);
      setError('Unable to load shipment data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      if (selectedItem?._id) {
        await updateShipment(selectedItem._id, payload);
      } else {
        await createShipment(payload);
      }
      setError('');
      setShowForm(false);
      setSelectedItem(null);
      await loadData();
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to save shipment.');
    }
  };

  const startCreate = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const startEdit = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Tracking</p>
          <h1>Shipments</h1>
        </div>
        <button type="button" onClick={startCreate}>New shipment</button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {showForm ? (
        <ShipmentForm initialData={selectedItem} vendors={vendors} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      ) : null}

      <div className="card-grid">
        <div className="list-card">
          <div className="page-header">
            <div>
              <p className="eyebrow">Live</p>
              <h2>Shipment list</h2>
            </div>
          </div>
          {items.length === 0 ? <p>No shipments yet.</p> : items.map((item) => (
            <div key={item._id} className="list-item" onClick={() => setSelectedItem(item)} style={{ cursor: 'pointer' }}>
              <div>
                <strong>{item.trackingNumber}</strong>
                <p className="muted">{item.vendor?.name || 'Unassigned vendor'}</p>
              </div>
              <div className="stack" style={{ gap: '6px', margin: 0 }}>
                <span className="pill">{item.currentStatus}</span>
                <button type="button" className="secondary-btn" onClick={(event) => { event.stopPropagation(); startEdit(item); }}>Edit</button>
              </div>
            </div>
          ))}
        </div>

        {selectedItem ? (
          <div className="stack" style={{ gap: '16px' }}>
            <div className="card">
              <p className="eyebrow">Selected shipment</p>
              <h2>{selectedItem.trackingNumber}</h2>
              <p className="muted">{selectedItem.origin} → {selectedItem.destination}</p>
              <p className="muted">Carrier: {selectedItem.carrier || 'Not listed'}</p>
              <p className="muted">Expected delivery: {selectedItem.expectedDeliveryDate ? new Date(selectedItem.expectedDeliveryDate).toLocaleDateString() : 'Pending'}</p>
            </div>
            <ShipmentTimeline shipment={selectedItem} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
