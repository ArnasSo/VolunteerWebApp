export default function Statistic({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-[3px] py-2">
        <span className="font-[Inter] text-[26px] font-semibold text-[#21272A]  lg:text-[48px]">
          {value}
        </span>
      </div>
      <p className="font-[Inter] text-[10px] font-normal text-[#21272A] ">
        {label}
      </p>
    </div>
  );
}
