"use client";

import { useState, useEffect } from "react";
import { Phone, MapPin, Truck, FileText, UserCheck, ChevronRight, Star, ShieldCheck, Clock, HeartHandshake, Search, AlertCircle, Zap, Calculator } from "lucide-react";
import MapPlaceholder from "@/components/MapPlaceholder";
import { motion } from "framer-motion";
import ContactModal from "@/components/ContactModal";
import { searchNearby, searchByKeyword, type POI, MOCK_POIS } from "@/lib/amap";

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [nearbyPois, setNearbyPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualSearchQuery, setManualSearchQuery] = useState("");
  const [modalInitialData, setModalInitialData] = useState<{ services?: string[], price?: number }>({});

  // Cost Estimator State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const estimateOptions = [
    { id: "car", label: "灵车接送", price: 800 },
    { id: "shroud", label: "寿衣准备", price: 1200 },
    { id: "ceremony", label: "告别仪式", price: 2000 },
    { id: "urn", label: "精美骨灰盒", price: 1500 },
  ];

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const estimatedTotal = selectedServices.reduce((sum, id) => {
    const item = estimateOptions.find(opt => opt.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const handleEstimateBook = () => {
    const serviceLabels = selectedServices.map(id => estimateOptions.find(opt => opt.id === id)?.label || "");
    setModalInitialData({
      services: serviceLabels,
      price: estimatedTotal
    });
    setModalOpen(true);
  };

  const openDefaultModal = () => {
    setModalInitialData({});
    setModalOpen(true);
  };

  // Initial load: Try to get location and search
  useEffect(() => {
    // Helper to load fallback data
    const loadFallbackData = () => {
      console.log("Loading fallback mock data");
      setNearbyPois(MOCK_POIS);
      setLocationError("无法获取定位，已为您展示上海市演示数据");
      setIsLoading(false);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const pois = await searchNearby(latitude, longitude);
            // If search returns empty but we have mock data logic inside searchNearby, 
            // it usually returns mock data if AMap fails. 
            // But if it returns empty array for other reasons, we might want to fallback too?
            // For now trust searchNearby's internal fallback for API failures.
            if (pois.length === 0) {
               loadFallbackData();
            } else {
               setNearbyPois(pois);
               setIsLoading(false);
            }
          } catch (error) {
            console.error("Search failed:", error);
            loadFallbackData();
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          loadFallbackData();
        }
      );
    } else {
      loadFallbackData();
    }
  }, []);

  const handleManualSearch = async () => {
    if (!manualSearchQuery.trim()) return;
    setIsLoading(true);
    try {
      // Search nationwide or default city
      const pois = await searchByKeyword(manualSearchQuery + "殡仪馆");
      setNearbyPois(pois);
      setLocationError(null); // Clear error if search succeeds
    } catch (error) {
      console.error("Manual search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const prices = [
    { 
      title: "基础告别套餐", 
      price: "1999", 
      desc: "简约庄重，包含基础接运与告别",
      features: ["遗体接运", "基础冷藏", "告别厅布置", "骨灰盒"]
    },
    { 
      title: "标准体面套餐", 
      price: "4999", 
      desc: "全程无忧，尊享专业管家服务",
      features: ["豪华灵车", "3天冷藏", "鲜花布置", "高档寿衣", "全程引导"],
      recommend: true
    },
  ];

  const steps = [
    { icon: Phone, title: "提交需求", desc: "24小时响应" },
    { icon: UserCheck, title: "管家上门", desc: "30分钟必达" },
    { icon: FileText, title: "方案确认", desc: "透明无隐形" },
    { icon: HeartHandshake, title: "全程代办", desc: "省心更放心" },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-slate-900 text-zinc-400 pb-24">
      <ContactModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} initialData={modalInitialData} />

      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-40 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Dieleme</span>
        </div>
        <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          我的订单
        </button>
      </header>

      {/* Hero & Hotline */}
      <section className="pt-8 pb-6 px-6 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-500/5 blur-[100px] -z-10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">
            生命的最后一程<br/>
            <span className="text-indigo-400">我们将温暖相伴</span>
          </h1>
          <p className="text-slate-500 text-sm">专业殡葬服务平台 · 价格透明 · 24小时服务</p>
        </motion.div>

        {/* Hotline Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-xl shadow-indigo-900/20 text-white relative overflow-hidden group cursor-pointer"
          onClick={openDefaultModal}
        >
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Phone size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-indigo-100 text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              24小时全城上门服务热线
            </div>
            <div className="text-3xl font-bold tracking-wider mt-2 font-mono">400-820-8820</div>
            <div className="mt-4 w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
              <Phone size={18} />
              立即呼叫管家
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section className="px-6 py-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: FileText, label: "寿衣准备", color: "text-amber-400", bg: "bg-amber-400/10" },
            { icon: Truck, label: "车辆调度", color: "text-blue-400", bg: "bg-blue-400/10" },
            { icon: UserCheck, label: "灵位设置", color: "text-emerald-400", bg: "bg-emerald-400/10" },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="bg-slate-800/50 p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/50 group"
            >
              <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon size={20} />
              </div>
              <span className="text-sm font-medium text-slate-300">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-6 py-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock size={18} className="text-indigo-500" />
          服务流程
        </h2>
        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-slate-700" />
            
            <div className="space-y-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  <div className="w-10 h-10 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center z-10 shrink-0 text-indigo-400">
                    <step.icon size={18} />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-white font-medium text-base">{step.title}</h3>
                    <p className="text-slate-500 text-sm mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Funeral Homes */}
      <section className="px-6 py-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-indigo-500" />
          附近殡仪馆
        </h2>

        {/* Trust Bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { icon: ShieldCheck, label: "政府认证" },
            { icon: FileText, label: "价格透明" },
            { icon: UserCheck, label: "全程陪同" },
            { icon: Zap, label: "15分响应" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <item.icon size={14} />
              </div>
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>

        {locationError && (
          <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl space-y-3 mb-4">
            <div className="flex items-center gap-2 text-amber-500 text-sm">
              <AlertCircle size={16} />
              <span>{locationError}</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="请输入城市或区域（如：上海 殡仪馆）"
                value={manualSearchQuery}
                onChange={(e) => setManualSearchQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
              />
              <button 
                onClick={handleManualSearch}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors flex items-center gap-1 shrink-0"
              >
                <Search size={16} />
                搜索
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500 text-sm animate-pulse">正在搜索附近服务机构...</div>
          ) : nearbyPois.length > 0 ? (
            nearbyPois.map((home, idx) => (
              <motion.div
                key={home.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between hover:border-slate-600 transition-colors"
              >
                <div className="flex-1 pr-4 min-w-0">
                  <h3 className="text-white font-medium truncate">{home.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    {home.distance >= 0 && (
                      <span className="bg-slate-700/50 px-1.5 py-0.5 rounded text-slate-400 shrink-0">
                        {home.distance > 1000 ? `${(home.distance / 1000).toFixed(1)}km` : `${home.distance}m`}
                      </span>
                    )}
                    <span className="truncate">{home.address}</span>
                  </div>
                </div>
                {home.tel ? (
                  <a 
                    href={`tel:${home.tel.split(';')[0]}`}
                    className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shrink-0"
                  >
                    <Phone size={18} />
                  </a>
                ) : (
                  <button 
                    onClick={openDefaultModal}
                    className="w-10 h-10 bg-slate-700/30 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-700 hover:text-slate-300 transition-all shrink-0"
                  >
                    <Phone size={18} />
                  </button>
                )}
              </motion.div>
            ))
          ) : !locationError && (
             <div className="text-center py-8 text-slate-500 text-sm">暂无附近数据，请尝试手动搜索</div>
          )}
        </div>
      </section>

      {/* Cost Estimator */}
      <section className="px-6 py-6 bg-slate-800/20">
         <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calculator size={18} className="text-indigo-500" />
            服务费用预估
         </h2>
         <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg">
            <div className="space-y-4">
               {estimateOptions.map((option) => (
                  <div 
                    key={option.id}
                    onClick={() => toggleService(option.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                       selectedServices.includes(option.id)
                          ? "bg-indigo-500/10 border-indigo-500/50"
                          : "bg-slate-900/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                     <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                           selectedServices.includes(option.id)
                              ? "bg-indigo-500 border-indigo-500"
                              : "border-slate-600"
                        }`}>
                           {selectedServices.includes(option.id) && <UserCheck size={12} className="text-white" />}
                        </div>
                        <span className="text-slate-200 text-sm font-medium">{option.label}</span>
                     </div>
                     <span className="text-indigo-400 font-mono">¥{option.price}</span>
                  </div>
               ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-xs text-slate-500">预估总价</span>
                  <span className="text-2xl font-bold text-white font-mono">
                     <span className="text-sm align-top mr-0.5">¥</span>
                     {estimatedTotal}
                  </span>
               </div>
               <button 
                  onClick={handleEstimateBook}
                  className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-transform"
               >
                  按此预算预约
               </button>
            </div>
         </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 py-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-indigo-500" />
          服务价格透明表
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x">
          {prices.map((item, idx) => (
            <div 
              key={idx} 
              className={`min-w-[280px] p-5 rounded-2xl border snap-center relative ${
                item.recommend 
                  ? "bg-slate-800 border-indigo-500/50 shadow-lg shadow-indigo-900/10" 
                  : "bg-slate-800/30 border-slate-700/50"
              }`}
            >
              {item.recommend && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                  店长推荐
                </div>
              )}
              <h3 className="text-white font-bold text-lg">{item.title}</h3>
              <div className="mt-2 flex items-baseline gap-1 text-indigo-400">
                <span className="text-sm">¥</span>
                <span className="text-2xl font-bold font-mono">{item.price}</span>
              </div>
              <p className="text-slate-500 text-xs mt-2">{item.desc}</p>
              
              <div className="my-4 h-px bg-slate-700/50" />
              
              <ul className="space-y-2 mb-6">
                {item.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    {feat}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={openDefaultModal}
                className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  item.recommend 
                    ? "bg-indigo-600 text-white hover:bg-indigo-500" 
                    : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                }`}
              >
                选择此套餐
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Button */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-30"
      >
        <button 
          onClick={openDefaultModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white w-14 h-14 rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        >
          <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20" />
          <Phone size={24} className="fill-current" />
        </button>
      </motion.div>

    </main>
  );
}
