import { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  category: 'Other',
  status: 'active',
  onTimeDeliveryRate: '',
  qualityRating: '',
  totalOrders: '',
  leadTimeDays: '',
  notes: '',
};

export default function VendorForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        contactPerson: initialData.contactPerson || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        category: initialData.category || 'Other',
        status: initialData.status || 'active',
        onTimeDeliveryRate: initialData.onTimeDeliveryRate || '',
        qualityRating: initialData.qualityRating || '',
        totalOrders: initialData.totalOrders || '',
        leadTimeDays: initialData.leadTimeDays || '',
        notes: initialData.notes || '',
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
      onTimeDeliveryRate: Number(form.onTimeDeliveryRate || 0),
      qualityRating: Number(form.qualityRating || 0),
      totalOrders: Number(form.totalOrders || 0),
      leadTimeDays: Number(form.leadTimeDays || 0),
    });
  };

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <div className="page-header">
        <div>
          <p className="eyebrow">Vendor entry</p>
          <h2>{initialData ? 'Edit vendor' : 'Create vendor'}</h2>
        </div>
      </div>

      <div className="card-grid">
        <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
        <label>Contact person<input name="contactPerson" value={form.contactPerson} onChange={handleChange} /></label>
        <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} /></label>
        <label>Phone<input name="phone" value={form.phone} onChange={handleChange} /></label>
        <label>Address<input name="address" value={form.address} onChange={handleChange} /></label>
        <label>Category<select name="category" value={form.category} onChange={handleChange}>
          <option value="Electronics">Electronics</option>
          <option value="Components">Components</option>
          <option value="Packaging">Packaging</option>
          <option value="Raw Materials">Raw Materials</option>
          <option value="Other">Other</option>
        </select></label>
        <label>Status<select name="status" value={form.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blacklisted">Blacklisted</option>
        </select></label>
        <label>On-time delivery rate<input name="onTimeDeliveryRate" type="number" value={form.onTimeDeliveryRate} onChange={handleChange} /></label>
        <label>Quality rating<input name="qualityRating" type="number" value={form.qualityRating} onChange={handleChange} /></label>
        <label>Total orders<input name="totalOrders" type="number" value={form.totalOrders} onChange={handleChange} /></label>
        <label>Lead time days<input name="leadTimeDays" type="number" value={form.leadTimeDays} onChange={handleChange} /></label>
        <label>Notes<textarea name="notes" value={form.notes} onChange={handleChange} /></label>
      </div>

      <div className="page-header">
        <button type="submit">{initialData ? 'Save changes' : 'Create vendor'}</button>
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
