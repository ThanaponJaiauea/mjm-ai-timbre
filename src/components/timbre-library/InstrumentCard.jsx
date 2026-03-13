export default function InstrumentCard({
  title,
  desc,
  bgImage,
  onClick,
  disabled,
  gradientClass,
}) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`relative w-[450px] h-[200px] rounded-[24px] p-[1px] overflow-hidden transition-transform active:scale-95
      ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}
      ${gradientClass}`}
    >
      <div
        className="w-full h-full rounded-[23px] p-8 flex flex-col justify-between"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="z-10">
          <h3 className="text-[28px] font-bold text-white">{title}</h3>
          <p className="text-[16px] text-gray-200 mt-1">{desc}</p>
        </div>
        <button className="flex items-center justify-end gap-2 font-medium text-white hover:text-[#E759FF]">
          Explore <span>&gt;</span>
        </button>
      </div>
    </div>
  );
}
