
export default function UnknownCoin() {
  return (
    <div className="flex items-center justify-center h-[300px] w-[300px]">
      <div className="relative h-[200px] w-[200px] rounded-full bg-gradient-to-r from-[#c0c0c0] to-[#e0e0e0] shadow-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-bold text-[#808080]">?</div>
        </div>
      </div>
    </div>
  );
}
