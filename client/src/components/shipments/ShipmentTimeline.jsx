export default function ShipmentTimeline({ shipment }) {
  if (!shipment?.statusHistory?.length) {
    return <p className="muted">No status history yet.</p>;
  }

  return (
    <div className="card stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Lifecycle</p>
          <h2>Status timeline</h2>
        </div>
      </div>

      {shipment.statusHistory.map((entry, index) => (
        <div key={`${entry.status}-${index}`} className="list-item">
          <div>
            <strong>{entry.status.replace(/_/g, ' ')}</strong>
            {entry.note ? <p className="muted">{entry.note}</p> : null}
          </div>
          <span className="pill">{new Date(entry.timestamp || Date.now()).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
