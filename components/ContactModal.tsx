"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MapPin, Clock } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  initialData?: {
    services?: string[];
    price?: number;
  };
}

type Step = "comfort" | "form" | "success";

export default function ContactModal({ isOpen, onClose, title = "立即联系管家", initialData }: ContactModalProps) {
  const [step, setStep] = useState<Step>("comfort");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("正在获取位置...");
  const [countdown, setCountdown] = useState(60);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("comfort");
      setPhone("");
      setCountdown(60);
      
      // Get location if available
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // In a real app, reverse geocode here. For now, use coordinates or mock city.
            setLocation(`上海市 (已定位)`);
          },
          () => {
            setLocation("未能获取位置");
          }
        );
      } else {
        setLocation("浏览器不支持定位");
      }
    }
  }, [isOpen]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "success" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleNextStep = () => {
    setStep("form");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 11) return;
    
    // Simulate API call
    setTimeout(() => {
      setStep("success");
    }, 1000);
  };

  const circumference = 2 * Math.PI * 40; // For SVG circle
  const strokeDashoffset = circumference - (countdown / 60) * circumference;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center"
          />
          
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[101] bottom-0 left-0 right-0 sm:relative sm:w-full sm:max-w-sm sm:rounded-2xl sm:mx-auto bg-slate-800 border-t sm:border border-slate-700 rounded-t-3xl p-6 shadow-2xl pb-10 sm:pb-6"
          >
            {/* Handle bar for mobile feel */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6 sm:hidden" />

            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {step === "comfort" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-6 text-center pt-2"
              >
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                   <Phone size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">We are here for you</h3>
                  <p className="text-slate-400 text-sm leading-relaxed px-4">
                    Leave your number, our concierge will call you within <span className="text-indigo-400 font-bold">60s</span>.<br/>
                    {initialData?.price && (
                       <span className="text-xs text-slate-500 mt-2 block">
                         Estimated Budget: ${initialData.price}
                       </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleNextStep}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                >
                  Contact Now
                </button>
              </motion.div>
            )}

            {step === "form" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-6"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-semibold text-white">Call Concierge</h3>
                  <p className="text-sm text-slate-400">We will contact you immediately</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 ml-1">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 ml-1">Location (Auto-detected)</label>
                     <div className="w-full bg-slate-900/30 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-300 flex items-center gap-2">
                        <MapPin size={16} className="text-indigo-500" />
                        <span className="text-sm">{location}</span>
                     </div>
                  </div>

                  {initialData?.services && initialData.services.length > 0 && (
                     <div className="bg-slate-700/20 rounded-lg p-3 text-xs text-slate-400">
                        <span className="font-medium text-slate-300">Selected Services: </span>
                        {initialData.services.join(", ")}
                     </div>
                  )}

                  <button
                    type="submit"
                    disabled={phone.length < 5}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                  >
                    Call Now
                  </button>
                </form>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 flex flex-col items-center text-center space-y-6"
              >
                {/* Countdown Circle */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-slate-700"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="text-indigo-500 transition-all duration-1000 ease-linear"
                      />
                   </svg>
                   <span className="absolute text-2xl font-mono font-bold text-white">{countdown}s</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                     <Clock className="text-indigo-400" />
                     Connecting...
                  </h3>
                  <p className="text-slate-400 text-sm">Please keep your phone on.</p>
                </div>

                <button 
                  onClick={onClose}
                  className="text-slate-500 text-sm hover:text-white transition-colors mt-4"
                >
                  Close
                </button>
              </motion.div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
