export function BadgeButton({ label, onClick }) {
  return (
    <button
      type="button"
      className="px-3 py-1 cursor-pointer rounded-full border border-[#3D3D3D] text-[12px] text-gray-400 hover:bg-[#3D3D3D] transition-colors"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
