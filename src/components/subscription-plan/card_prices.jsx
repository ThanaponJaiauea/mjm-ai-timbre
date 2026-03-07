"use client";

export default function Card_price({ text1, text2, price, text3, save, onClick }) {
  return (
    <div onClick={onClick} className="relative group cursor-pointer h-full">
      <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-[20px] opacity-0 blur-[2px] group-hover:opacity-60 transition duration-300"></div>

      <div className="relative bg-[#111] p-6 rounded-[20px] h-full flex flex-col justify-between border border-[#5C5C5C] group-hover:border-transparent transition duration-300">
        {save && (
          <div className="absolute -top-3 right-0 z-10 text-[10px] text-[#8F8F8F] bg-[#111] px-3 py-1.5 rounded-full border border-white/10 group-hover:text-white/80 transition-colors shadow-lg">
            Save -488 THB
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-white/90">{text1} Plan —</p>

          <p className="text-[22px] font-bold text-white mt-1">
            {price} THB / {text2}
          </p>

          <p className="text-[11px] text-[#8F8F8F] mt-10 leading-relaxed font-light">{text3}</p>
        </div>
      </div>
    </div>
  );
}
