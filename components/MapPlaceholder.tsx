export default function MapPlaceholder() {
  return (
    <div className="w-full h-64 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
      <div className="text-center">
        <p className="text-zinc-500 mb-2">地理位置服务加载中...</p>
        <p className="text-xs text-zinc-600">正在获取附近的殡仪服务机构</p>
      </div>
    </div>
  );
}
