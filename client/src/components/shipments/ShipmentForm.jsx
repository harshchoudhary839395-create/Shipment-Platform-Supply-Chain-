import { useEffect, useState } from 'react';

const emptyForm = {
  trackingNumber: '',
  vendor: '',
  currentStatus: 'pending',
  origin: '',
  destination: '',
  expectedDeliveryDate: '',
  carrier: '',
  shippingCost: '',
};

export default function ShipmentForm({ initialData, vendors, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        trackingNumber: initialData.trackingNumber || '',
        vendor: initialData.vendor?._id || initialData.vendor || '',
        currentStatus: initialData.currentStatus || 'pending',
        origin: initialData.origin || '',
        destination: initialData.destination || '',
        expectedDeliveryDate: initialData.expectedDeliveryDate ? initialData.expectedDeliveryDate.slice(0, 10) : '',
        carrier: initialData.carrier || '',
        shippingCost: initialData.shippingCost || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      shippingCost: Number(form.shippingCost || 0),
    });
  };

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <div className="page-header">
        <div>
          <p className="eyebrow">Shipment entry</p>
          <h2>{initialData ? 'Edit shipment' : 'Create shipment'}</h2>
        </div>
      </div>

      <div className="card-grid">
        <label>
          Tracking number
          <input name="trackingNumber" value={form.trackingNumber} onChange={handleChange} required />
        </label>
        <label>
          Vendor
          <select name="vendor" value={form.vendor} onChange={handleChange} required>
            <option value="">Select vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor._id} value={vendor._id}>{vendor.name}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="currentStatus" value={form.currentStatus} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_transit">In transit</option>
            <option value="out_for_delivery">Out for delivery</option>
            <option value="delivered">Delivered</option>
            <option value="delayed">Delayed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label>
          Carrier
          <input name="carrier" value={form.carrier} onChange={handleChange} />
        </label>
        <label>
          Origin
          <input name="origin" value={form.origin} onChange={handleChange} />
        </label>
        <label>
          Destination
          <input name="destination" value={form.destination} onChange={handleChange} />
        </label>
        <label>
          Expected delivery date
          <input name="expectedDeliveryDate" type="date" value={form.expectedDeliveryDate} onChange={handleChange} />
        </label>
        <label>
          Shipping cost
          <input name="shippingCost" type="number" value={form.shippingCost} onChange={handleChange} />
        </label>
      </div>

      <div className="page-header">
        <button type="submit">{initialData ? 'Save changes' : 'Create shipment'}</button>
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
