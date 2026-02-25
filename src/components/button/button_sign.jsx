export function ButtonSign({ title, onClick }) {
  return (
    <button
      onClick={() => onClick()}
      className="border-2 p-2 font-medium rounded-full w-[109px] h-[40px] cursor-pointer hover:bg-[#3D3D3D]"
    >
      {title}
    </button>
  );
}
