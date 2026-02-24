export default function SelectChord({ value, onChange, data }) {
  return (
    <select
      className="bg-[#262730] text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500 border border-gray-700 cursor-pointer appearance-none"
      value={value}
      onChange={onChange}
    >
      {data.map(el => (
        <option key={el} value={el}>
          {el}
        </option>
      ))}
    </select>
  );
}
