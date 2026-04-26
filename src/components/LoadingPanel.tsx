export function LoadingPanel() {
  return (
    <section className="device error-device" aria-label="Episode loading">
      <div className="panel info-panel">
        <p className="eyebrow">loading episode</p>
        <h2>Preparing the station</h2>
        <p className="status-copy">Fetching the current episode from the local API.</p>
      </div>
    </section>
  );
}

