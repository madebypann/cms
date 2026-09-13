export default function ToggleSwitch({ checked, onChange, disabled, showLabel = false }) {
  return (
    <div className="toggle-with-label">
      <button
        type="button"
        className={`toggle-switch ${checked ? 'active' : ''}`}
        onClick={onChange}
        disabled={disabled}
        aria-pressed={checked}
        aria-label={checked ? 'Nonaktifkan' : 'Aktifkan'}
      />
      {showLabel && <span className="toggle-label">{checked ? 'On' : 'Off'}</span>}
    </div>
  );
}