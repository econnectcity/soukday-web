import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoLocationOutline, IoSparklesOutline } from "react-icons/io5";
import { FiTruck, FiShield, FiGlobe, FiArrowRight } from "react-icons/fi";
import dynamic from "next/dynamic";

const Location = dynamic(() => import("../locationmodal/Location"), {
  ssr: false,
});

const SoukdayHeroBanner = () => {
  const setting = useSelector((state) => state.Setting?.setting);
  const city = useSelector((state) => state.City?.city);
  const [showLocation, setShowLocation] = useState(false);
  const [postalInput, setPostalInput] = useState("");

  const webSettings = setting?.web_settings || {};

  useEffect(() => {
    if (city?.formatted_address) {
      setPostalInput(city.formatted_address);
    }
  }, [city]);

  const handleOpenLocationModal = (e) => {
    if (e) e.preventDefault();
    setShowLocation(true);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FCEFEA]/60 via-white to-stone-50/40 py-10 sm:py-14 lg:py-16 border-b border-stone-200/60">
        
        {/* Soft background glow accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F68B62]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#ff9e7a]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCEFEA] border border-[#F68B62]/30 text-[#e07750] text-xs sm:text-sm font-bold shadow-xs">
              <IoSparklesOutline className="text-[#F68B62] animate-pulse" size={16} />
              <span>
                {webSettings.hero_tagline || "Votre marché oriental & local à portée de clic"}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.15]">
              {webSettings.hero_title || (
                <>
                  Vos épiceries fines & boucheries locales{" "}
                  <span className="text-[#F68B62]">livrées à votre porte.</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-stone-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {webSettings.hero_subtitle ||
                "Entrez votre adresse ou code postal pour découvrir les boucheries halal et magasins qui livrent chez vous. Les produits d'épicerie directe Soukday sont expédiés partout au Canada et aux États-Unis !"}
            </p>

            {/* Address / Location Search Bar */}
            <div className="max-w-xl mx-auto pt-2">
              <form
                onSubmit={handleOpenLocationModal}
                className="flex flex-col sm:flex-row items-center gap-2.5 p-1.5 sm:p-2 bg-white rounded-2xl shadow-xl shadow-[#F68B62]/10 border border-[#F68B62]/20"
              >
                <div className="flex items-center gap-3 w-full px-3 py-2 text-stone-500">
                  <div className="w-8 h-8 rounded-lg bg-[#FCEFEA] flex items-center justify-center text-[#F68B62] shrink-0">
                    <IoLocationOutline size={18} />
                  </div>
                  <input
                    type="text"
                    value={postalInput}
                    onChange={(e) => setPostalInput(e.target.value)}
                    onClick={handleOpenLocationModal}
                    placeholder="Entrez votre code postal ou adresse (ex: H3N 1X1, Montréal)..."
                    className="w-full text-xs sm:text-sm text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none cursor-pointer"
                    readOnly
                  />
                </div>
                <button
                  type="button"
                  onClick={handleOpenLocationModal}
                  className="w-full sm:w-auto bg-[#F68B62] hover:bg-[#e07750] text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#F68B62]/25 hover:shadow-lg hover:shadow-[#F68B62]/35 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <span>Découvrir</span>
                  <FiArrowRight size={16} />
                </button>
              </form>

              {/* Current address indicator */}
              <div className="mt-2.5 flex items-center justify-center gap-2 text-xs text-stone-500">
                <span>Adresse sélectionnée :</span>
                <button
                  type="button"
                  onClick={handleOpenLocationModal}
                  className="font-bold text-[#F68B62] hover:underline cursor-pointer truncate max-w-[280px]"
                >
                  {city?.formatted_address || city?.name || "Montréal (cliquez pour choisir)"}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto text-left">
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-stone-200/70 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#FCEFEA] text-[#F68B62] flex items-center justify-center shrink-0">
                  <FiTruck size={18} />
                </div>
                <div>
                  <div className="font-bold text-stone-800 text-xs sm:text-sm">
                    {webSettings.hero_badge_1 || "Livraison le jour même"}
                  </div>
                  <div className="text-[11px] text-stone-500">Pour viandes & produits frais</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-stone-200/70 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#FCEFEA] text-[#F68B62] flex items-center justify-center shrink-0">
                  <FiShield size={18} />
                </div>
                <div>
                  <div className="font-bold text-stone-800 text-xs sm:text-sm">
                    {webSettings.hero_badge_2 || "Boucheries 100% Halal"}
                  </div>
                  <div className="text-[11px] text-stone-500">Découpe certifiée sur mesure</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-stone-200/70 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#FCEFEA] text-[#F68B62] flex items-center justify-center shrink-0">
                  <FiGlobe size={18} />
                </div>
                <div>
                  <div className="font-bold text-stone-800 text-xs sm:text-sm">
                    {webSettings.hero_badge_3 || "Épicerie Canada & USA"}
                  </div>
                  <div className="text-[11px] text-stone-500">10 provinces expédiées</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {showLocation && (
        <Location
          showLocation={showLocation}
          setShowLocation={setShowLocation}
        />
      )}
    </>
  );
};

export default SoukdayHeroBanner;
