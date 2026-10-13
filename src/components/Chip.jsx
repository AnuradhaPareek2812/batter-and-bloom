export default function Chip({ active, disabled, onClick, title, small, children }) {
  return (
    <button
      type="button"
      className={'chip' + (active ? ' on' : '') + (small ? ' sm' : '')}
      aria-pressed={!!active}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}
