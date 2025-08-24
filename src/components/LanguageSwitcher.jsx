// src/components/LanguageSwitcher.jsx
import React, { useState, useEffect, createContext, useContext } from "react";

// Create language context
const LanguageContext = createContext();

// Simple translation function
const translations = {
  en: {
    heroTitle: "Find Skilled Workers",
    heroSubtitle: "Connect with trusted local professionals for all your home service needs",
    searchPlaceholder: "Search for plumbers, electricians, carpenters...",
    findWorkers: "Find Workers",
    hireWorkers: "Hire Workers",
    startWorking: "Start Working",
    popularServices: "Popular Services",
    findSkilled: "Find skilled professionals for every job",
    viewAllCategories: "View All Categories",
    whyChoose: "Why Choose KaamWala?",
    whyChooseDesc: "We make finding and hiring skilled workers simple and reliable",
    directConnection: "Direct Connection",
    directDesc: "Connect directly with workers, no middleman fees",
    verifiedWorkers: "Verified Workers",
    verifiedDesc: "All workers are verified and background checked",
    fairPricing: "Fair Pricing",
    fairPricingDesc: "Transparent pricing with no hidden costs",
    qualityGuarantee: "Quality Guarantee",
    qualityDesc: "Satisfaction guaranteed or we'll make it right",
    ctaHeading: "Ready to Get Started?",
    ctaSubheading: "Join thousands of satisfied customers and skilled workers",
    ctaWorkerBtn: "Start Working",
    ctaCustomerBtn: "Find Workers"
  },
  hi: {
    heroTitle: "कुशल कारीगर खोजें",
    heroSubtitle: "अपनी सभी घरेलू सेवा आवश्यकताओं के लिए विश्वसनीय स्थानीय पेशेवरों से जुड़ें",
    searchPlaceholder: "प्लंबर, इलेक्ट्रीशियन, बढ़ई खोजें...",
    findWorkers: "कारीगर खोजें",
    hireWorkers: "कारीगर किराए पर लें",
    startWorking: "काम शुरू करें",
    popularServices: "लोकप्रिय सेवाएं",
    findSkilled: "हर काम के लिए कुशल पेशेवर खोजें",
    viewAllCategories: "सभी श्रेणियां देखें",
    whyChoose: "क्यों चुनें कामवाला?",
    whyChooseDesc: "हम कुशल कारीगरों को खोजना और किराए पर लेना सरल और विश्वसनीय बनाते हैं",
    directConnection: "सीधा संपर्क",
    directDesc: "कारीगरों से सीधे जुड़ें, कोई बिचौलिया शुल्क नहीं",
    verifiedWorkers: "सत्यापित कारीगर",
    verifiedDesc: "सभी कारीगर सत्यापित और पृष्ठभूमि जांच के साथ",
    fairPricing: "उचित मूल्य",
    fairPricingDesc: "पारदर्शी मूल्य निर्धारण, कोई छिपा हुआ खर्च नहीं",
    qualityGuarantee: "गुणवत्ता की गारंटी",
    qualityDesc: "संतुष्टि की गारंटी या हम इसे ठीक करेंगे",
    ctaHeading: "शुरू करने के लिए तैयार हैं?",
    ctaSubheading: "हजारों संतुष्ट ग्राहकों और कुशल कारीगरों में शामिल हों",
    ctaWorkerBtn: "काम शुरू करें",
    ctaCustomerBtn: "कारीगर खोजें"
  }
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
    // Force page refresh to apply language changes
    window.location.reload();
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language switcher component
export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();

  const getLanguageDisplay = () => {
    return currentLanguage === "en" ? "English" : "हिन्दी";
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm btn-outline-light dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        🌐 {getLanguageDisplay()}
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <button 
            className="dropdown-item" 
            onClick={() => changeLanguage("en")}
          >
            English
          </button>
        </li>
        <li>
          <button 
            className="dropdown-item" 
            onClick={() => changeLanguage("hi")}
          >
            हिन्दी
          </button>
        </li>
      </ul>
    </div>
  );
}
