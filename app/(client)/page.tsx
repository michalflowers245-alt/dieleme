"use client";

import { useState, useEffect } from "react";
import { Phone, MapPin, Truck, FileText, UserCheck, ChevronRight, Star, ShieldCheck, Clock, HeartHandshake, Search, AlertCircle, Zap, Calculator, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContactModal from "@/components/ContactModal";
import { searchGlobalNearby, searchGlobalByKeyword, type POI, GLOBAL_MOCK_POIS } from "@/lib/global-map";

// Detailed Content Data
const DETAILED_SERVICES: Record<string, { title: string; items: { name: string; price: number; img: string; desc: string }[] }> = {
  shrouds: {
    title: "Shrouds & Ceremonial Clothing",
    items: [
      { 
        name: "Classic Silk Shroud", 
        price: 299, 
        img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=60", 
        desc: "Hand-woven silk, dignified and traditional." 
      },
      { 
        name: "Modern Suit Set", 
        price: 499, 
        img: "https://images.unsplash.com/photo-1594938298603-c8148c472997?w=800&auto=format&fit=crop&q=60", 
        desc: "Complete formal suit with accessories." 
      },
      { 
        name: "Premium Embroidered Robe", 
        price: 899, 
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60", 
        desc: "Exquisite craftsmanship with gold thread embroidery." 
      },
    ]
  },
  vehicles: {
    title: "Hearse & Transportation",
    items: [
      { 
        name: "Standard Service Van", 
        price: 300, 
        img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60", 
        desc: "Reliable transport for initial transfer." 
      },
      { 
        name: "Cadillac Hearse", 
        price: 800, 
        img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60", 
        desc: "Classic black Cadillac hearse for the procession." 
      },
      { 
        name: "Mercedes-Benz Ceremonial", 
        price: 1200, 
        img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=60", 
        desc: "Luxury European style for the highest honor." 
      },
    ]
  },
  niches: {
    title: "Memorial Niches & Urns",
    items: [
      { 
        name: "Carved Wooden Urn", 
        price: 150, 
        img: "https://images.unsplash.com/photo-1633934542430-0905ccb5f050?w=800&auto=format&fit=crop&q=60", 
        desc: "Solid wood with hand-carved details." 
      },
      { 
        name: "White Marble Urn", 
        price: 450, 
        img: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop&q=60", 
        desc: "Pure natural marble, eternal and elegant." 
      },
      { 
        name: "Jade Memorial Box", 
        price: 2000, 
        img: "https://images.unsplash.com/photo-1605218427368-35b019b8e390?w=800&auto=format&fit=crop&q=60", 
        desc: "Premium jade, symbolizing peace and eternity." 
      },
    ]
  }
};

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [nearbyPois, setNearbyPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualSearchQuery, setManualSearchQuery] = useState("");
  const [modalInitialData, setModalInitialData] = useState<{ services?: string[], price?: number }>({});
  
  // Detail Modal State
  const [activeDetailCategory, setActiveDetailCategory] = useState<string | null>(null);

  // Cost Estimator State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const estimateOptions = [
    { id: "car", label: "Hearse Service", price: 800 },
    { id: "shroud", label: "Shrouds & Clothing", price: 500 },
    { id: "ceremony", label: "Ceremony Hall", price: 2000 },
    { id: "urn", label: "Premium Urn", price: 450 },
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
      console.log("Loading fallback global mock data");
      setNearbyPois(GLOBAL_MOCK_POIS);
      setLocationError("Unable to locate. Showing global demo data.");
      setIsLoading(false);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const pois = await searchGlobalNearby(latitude, longitude);
            setNearbyPois(pois);
            setIsLoading(false);
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
      const pois = await searchGlobalByKeyword(manualSearchQuery);
      setNearbyPois(pois);
      setLocationError(null); 
    } catch (error) {
      console.error("Manual search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const prices = [
    { 
      title: "Essential Care", 
      price: "1,999", 
      desc: "Simple and dignified. Includes basic transport and farewell.",
      features: ["Body Transport", "Basic Cooling", "Farewell Hall", "Standard Urn"]
    },
    { 
      title: "Premium Dignity", 
      price: "4,999", 
      desc: "Full service with professional concierge guidance.",
      features: ["Luxury Hearse", "3-Day Cooling", "Floral Arrangement", "Premium Shroud", "Full Guidance"],
      recommend: true
    },
  ];

  const steps = [
    { icon: Phone, title: "Request", desc: "24h Response" },
    { icon: UserCheck, title: "Concierge", desc: "Arrive in 30m" },
    { icon: FileText, title: "Confirm", desc: "Transparent" },
    { icon: HeartHandshake, title: "Service", desc: "Peace of Mind" },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-slate-900 text-zinc-400 pb-24 font-sans">
      <ContactModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} initialData={modalInitialData} />

      {/* Detail Modal */}
      <AnimatePresence>
        {activeDetailCategory && DETAILED_SERVICES[activeDetailCategory] && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDetailCategory(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-slate-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-700"
            >
              <div className="sticky top-0 bg-slate-800/95 backdrop-blur z-10 p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{DETAILED_SERVICES[activeDetailCategory].title}</h3>
                <button 
                  onClick={() => setActiveDetailCategory(null)}
                  className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {DETAILED_SERVICES[activeDetailCategory].items.map((item, idx) => (
                  <div key={idx} className="bg-slate-700/30 rounded-xl overflow-hidden border border-slate-700/50">
                    <div className="h-40 w-full bg-slate-800 relative">
                       {/* Placeholder Image using generic Unsplash if possible or just color block with text */}
                       <img 
                          src={item.img} 
                          alt={item.name}
                          className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                       />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold text-lg">{item.name}</h4>
                        <span className="text-indigo-400 font-bold font-mono">${item.price}</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-4">{item.desc}</p>
                      <button 
                        onClick={() => {
                          setActiveDetailCategory(null);
                          openDefaultModal();
                        }}
                        className="w-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Inquire Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-40 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Dieleme</span>
        </div>
        <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          My Orders
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
            The Last Journey<br/>
            <span className="text-indigo-400">With Warmth & Care</span>
          </h1>
          <p className="text-slate-500 text-sm">Professional Funeral Platform · Transparent Pricing · Global Service</p>
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
              24/7 Global Concierge Hotline
            </div>
            <div className="text-3xl font-bold tracking-wider mt-2 font-mono">1-800-DIELEME</div>
            <div className="mt-4 w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
              <Phone size={18} />
              Call Concierge
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Actions / Catalog */}
      <section className="px-6 py-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: FileText, label: "Shrouds", key: "shrouds", color: "text-amber-400", bg: "bg-amber-400/10" },
            { icon: Truck, label: "Vehicles", key: "vehicles", color: "text-blue-400", bg: "bg-blue-400/10" },
            { icon: UserCheck, label: "Niches", key: "niches", color: "text-emerald-400", bg: "bg-emerald-400/10" },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              onClick={() => setActiveDetailCategory(item.key)}
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
          Service Process
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

      {/* Nearby Funeral Homes (Google Maps Style) */}
      <section className="px-6 py-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-indigo-500" />
          Nearby Funeral Homes (Global)
        </h2>

        {/* Map Embed Placeholder */}
        <div className="w-full h-48 bg-slate-800 rounded-xl mb-4 overflow-hidden relative group">
           {/* Simulate a Google Map View */}
           <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
              <span className="text-slate-500 text-sm flex items-center gap-2">
                 <MapPin size={16} /> Google Maps View
              </span>
           </div>
           {/* Interactive overlay */}
           <iframe 
             className="absolute inset-0 w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
             src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3022.0606825994123!2d-73.985428!3d40.748817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
             loading="lazy"
           />
           <div className="absolute bottom-2 right-2 bg-white/90 text-black text-[10px] px-2 py-0.5 rounded shadow">Google</div>
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
                placeholder="Search City (e.g., New York)"
                value={manualSearchQuery}
                onChange={(e) => setManualSearchQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
              />
              <button 
                onClick={handleManualSearch}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors flex items-center gap-1 shrink-0"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500 text-sm animate-pulse">Searching nearby services...</div>
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
             <div className="text-center py-8 text-slate-500 text-sm">No results found. Try manual search.</div>
          )}
        </div>
      </section>

      {/* Cost Estimator */}
      <section className="px-6 py-6 bg-slate-800/20">
         <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calculator size={18} className="text-indigo-500" />
            Cost Estimator
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
                     <span className="text-indigo-400 font-mono">${option.price}</span>
                  </div>
               ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Estimated Total</span>
                  <span className="text-2xl font-bold text-white font-mono">
                     <span className="text-sm align-top mr-0.5">$</span>
                     {estimatedTotal}
                  </span>
               </div>
               <button 
                  onClick={handleEstimateBook}
                  className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-transform"
               >
                  Book Plan
               </button>
            </div>
         </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 py-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-indigo-500" />
          Transparent Pricing
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
                  Recommended
                </div>
              )}
              <h3 className="text-white font-bold text-lg">{item.title}</h3>
              <div className="mt-2 flex items-baseline gap-1 text-indigo-400">
                <span className="text-sm">$</span>
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
                Select Plan
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
