import { useEffect, useState } from 'react';

const emptyForm = {
  sku: '',
  name: '',
  category: '',
  vendor: '',
  quantityOnHand: '',
  reorderLevel: '',
  unitPrice: '',
  warehouseLocation: '',
};

export default function InventoryForm({ initialData, vendors, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        sku: initialData.sku || '',
        name: initialData.name || '',
        category: initialData.category || '',
        vendor: initialData.vendor?._id || initialData.vendor || '',
        quantityOnHand: initialData.quantityOnHand || '',
        reorderLevel: initialData.reorderLevel || '',
        unitPrice: initialData.unitPrice || '',
        warehouseLocation: initialData.warehouseLocation || '',
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
      quantityOnHand: Number(form.quantityOnHand || 0),
      reorderLevel: Number(form.reorderLevel || 0),
      unitPrice: Number(form.unitPrice || 0),
    });
  };

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <div className="page-header">
        <div>
          <p className="eyebrow">Inventory entry</p>
          <h2>{initialData ? 'Edit inventory item' : 'Create inventory item'}</h2>
        </div>
      </div>

      <div className="card-grid">
        <label>SKU<input name="sku" value={form.sku} onChange={handleChange} required /></label>
        <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
        <label>Category<input name="category" value={form.category} onChange={handleChange} /></label>
        <label>Vendor<select name="vendor" value={form.vendor} onChange={handleChange}>
          <option value="">Select vendor</option>
          {vendors.map((vendor) => <option key={vendor._id} value={vendor._id}>{vendor.name}</option>)}
        </select></label>
        <label>Quantity on hand<input name="quantityOnHand" type="number" value={form.quantityOnHand} onChange={handleChange} /></label>
        <label>Reorder level<input name="reorderLevel" type="number" value={form.reorderLevel} onChange={handleChange} /></label>
        <label>Unit price<input name="unitPrice" type="number" value={form.unitPrice} onChange={handleChange} /></label>
        <label>Warehouse location<input name="warehouseLocation" value={form.warehouseLocation} onChange={handleChange} /></label>
      </div>

      <div className="page-header">
        <button type="submit">{initialData ? 'Save changes' : 'Create item'}</button>
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
