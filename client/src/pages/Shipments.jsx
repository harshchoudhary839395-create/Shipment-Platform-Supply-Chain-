import { useEffect, useState } from 'react';
import ShipmentForm from '../components/shipments/ShipmentForm';
import ShipmentTimeline from '../components/shipments/ShipmentTimeline';
import { createShipment, getShipments, getVendors, updateShipment, updateStatus } from '../services/api';

const statusOptions = ['pending', 'confirmed', 'in_transit', 'out_for_delivery', 'delivered', 'delayed', 'cancelled'];

export default function Shipments() {
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '', vendor: '' });
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadData = async (activeFilters = filters) => {
    try {
      const [shipmentsResponse, vendorsResponse] = await Promise.all([
        getShipments(activeFilters),
        getVendors(),
      ]);
      setItems(shipmentsResponse?.data?.data || []);
      setVendors(vendorsResponse?.data?.data || []);
    } catch (error) {
      console.error(error);
      setError('Unable to load shipment data.');
    }
  };

  useEffect(() => {
    loadData(filters);
  }, [filters.search, filters.status, filters.vendor]);

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
      await loadData(filters);
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

  const handleStatusUpdate = async () => {
    if (!selectedItem?._id) return;
    try {
      setIsUpdatingStatus(true);
      const response = await updateStatus(selectedItem._id, selectedItem.currentStatus, statusNote);
      setSelectedItem(response?.data?.data || selectedItem);
      setStatusNote('');
      setError('');
      await loadData(filters);
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to update shipment status.');
    } finally {
      setIsUpdatingStatus(false);
    }
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

          <div className="toolbar">
            <input
              type="text"
              placeholder="Search by tracking number"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <select value={filters.vendor} onChange={(event) => setFilters((current) => ({ ...current, vendor: event.target.value }))}>
              <option value="">All vendors</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>{vendor.name}</option>
              ))}
            </select>
            <button type="button" className="secondary-btn" onClick={() => setFilters({ search: '', status: '', vendor: '' })}>Reset</button>
          </div>

          {items.length === 0 ? <p className="muted">No shipments matched your filters.</p> : items.map((item) => (
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
              <div className="status-actions">
                <select value={selectedItem.currentStatus} onChange={(event) => setSelectedItem((current) => current ? { ...current, currentStatus: event.target.value } : current)}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Optional note"
                  value={statusNote}
                  onChange={(event) => setStatusNote(event.target.value)}
                />
                <button type="button" onClick={handleStatusUpdate} disabled={isUpdatingStatus}>
                  {isUpdatingStatus ? 'Updating...' : 'Update status'}
                </button>
              </div>
            </div>
            <ShipmentTimeline shipment={selectedItem} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
