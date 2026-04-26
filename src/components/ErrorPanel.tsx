type ErrorPanelProps = {
  error: string;
};

export function ErrorPanel({ error }: ErrorPanelProps) {
  return (
    <section className="device error-device" aria-label="Episode loading error">
      <div className="panel info-panel">
        <p className="eyebrow">episode error</p>
        <h2>Episode data needs attention</h2>
        <p className="error-copy">{error}</p>
      </div>
    </section>
  );
}

