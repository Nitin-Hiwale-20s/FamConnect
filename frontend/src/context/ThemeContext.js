import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const LANGUAGES = {
  mr: { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  en: { code: 'en', label: 'English', flag: '🇬🇧' },
  hi: { code: 'hi', label: 'हिंदी', flag: '🇮🇳' }
};

const TRANSLATIONS = {
  mr: {
    home: {
      badge: '🌱 दलाल नाही • थेट शेतकऱ्याकडून',
      title1: 'ताजा भाजीपाला',
      title2: 'थेट शेतातून',
      title3: 'तुमच्या दारापर्यंत',
      sub: 'शेतकरी आणि ग्राहक यांच्यात दलाल नको. FarmConnect वर शेतकरी स्वतः भाव ठरवतो.',
      btn1: 'भाजीपाला खरेदी करा',
      btn2: 'शेतकरी म्हणून जोडा',
      stats: ['शेतकरी', 'भाजीपाल्याचे प्रकार', 'ग्राहक'],
      howTitle: 'हे कसे काम करते?',
      howSub: 'Simple आणि transparent process',
      steps: [
        { title: 'शेतकरी Register करतो', desc: 'Farmer ID मिळतो, भाजीपाला list करतो' },
        { title: 'ग्राहक Order करतो', desc: 'थेट शेतकऱ्याकडून खरेदी' },
        { title: 'शेतकरी Pack करतो', desc: 'Order confirm करून pack करतो' },
        { title: 'Delivery पोहोचवतो', desc: 'घरापर्यंत delivery' }
      ],
      rolesTitle: 'आपण कोण आहात?',
      roles: [
        { title: 'शेतकरी', desc: 'भाजीपाला list करा, थेट विका', btn: 'Farmer म्हणून Join करा' },
        { title: 'ग्राहक', desc: 'ताजा भाजीपाला खरेदी करा', btn: 'खरेदी सुरू करा' },
        { title: 'Delivery Boy', desc: 'Part-time काम, extra कमाई', btn: 'Delivery Partner बना' }
      ]
    },
    nav: { shop: 'भाजीपाला', login: 'लॉगिन', register: 'नोंदणी', dashboard: 'डॅशबोर्ड', logout: 'बाहेर पडा', cart: 'कार्ट', settings: 'सेटिंग्ज' },
    shop: { title: 'भाजीपाला', search: 'भाजीपाला शोधा...', all: 'सर्व', addCart: 'Cart +', noProducts: 'Products नाहीत', sort: 'Sort करा', latest: 'Latest', priceLow: 'कमी किंमत', priceHigh: 'जास्त किंमत' },
    auth: { loginTitle: 'Login करा', registerTitle: 'Join करा', email: 'Email', password: 'Password', name: 'पूर्ण नाव', phone: 'Phone', loginBtn: 'Login करा', registerBtn: 'Register करा', noAccount: 'Account नाही?', hasAccount: 'Account आहे?', selectRole: 'तुम्ही कोण आहात?', farmName: 'शेताचे नाव', village: 'गाव', district: 'जिल्हा' },
    common: { loading: 'Loading...', back: '← मागे', organic: 'Organic', total: 'एकूण', delivery: 'Delivery', free: 'मोफत', save: 'जतन करा', cancel: 'रद्द करा' }
  },
  en: {
    home: {
      badge: '🌱 No Middleman • Direct from Farmer',
      title1: 'Fresh Vegetables',
      title2: 'Direct from Farm',
      title3: 'To Your Doorstep',
      sub: 'No middlemen between farmers and consumers. On FarmConnect, farmers set their own prices.',
      btn1: 'Shop Vegetables',
      btn2: 'Join as Farmer',
      stats: ['Farmers', 'Vegetable Types', 'Customers'],
      howTitle: 'How It Works?',
      howSub: 'Simple and transparent process',
      steps: [
        { title: 'Farmer Registers', desc: 'Gets Farmer ID, lists vegetables' },
        { title: 'Buyer Orders', desc: 'Buy directly from farmer' },
        { title: 'Farmer Packs', desc: 'Confirms and packs the order' },
        { title: 'Delivery Delivers', desc: 'Home delivery with tracking' }
      ],
      rolesTitle: 'Who Are You?',
      roles: [
        { title: 'Farmer', desc: 'List vegetables, sell directly', btn: 'Join as Farmer' },
        { title: 'Buyer', desc: 'Buy fresh vegetables', btn: 'Start Shopping' },
        { title: 'Delivery Boy', desc: 'Part-time work, earn extra', btn: 'Become Delivery Partner' }
      ]
    },
    nav: { shop: 'Shop', login: 'Login', register: 'Register', dashboard: 'Dashboard', logout: 'Logout', cart: 'Cart', settings: 'Settings' },
    shop: { title: 'Vegetables', search: 'Search vegetables...', all: 'All', addCart: 'Add to Cart', noProducts: 'No products found', sort: 'Sort By', latest: 'Latest', priceLow: 'Price: Low', priceHigh: 'Price: High' },
    auth: { loginTitle: 'Login', registerTitle: 'Join FarmConnect', email: 'Email', password: 'Password', name: 'Full Name', phone: 'Phone', loginBtn: 'Login', registerBtn: 'Register', noAccount: "Don't have account?", hasAccount: 'Already have account?', selectRole: 'Select who you are', farmName: 'Farm Name', village: 'Village', district: 'District' },
    common: { loading: 'Loading...', back: '← Back', organic: 'Organic', total: 'Total', delivery: 'Delivery', free: 'FREE', save: 'Save', cancel: 'Cancel' }
  },
  hi: {
    home: {
      badge: '🌱 कोई बिचौलिया नहीं • सीधे किसान से',
      title1: 'ताज़ी सब्जियां',
      title2: 'सीधे खेत से',
      title3: 'आपके दरवाजे तक',
      sub: 'किसान और ग्राहक के बीच कोई बिचौलिया नहीं। FarmConnect पर किसान खुद कीमत तय करता है।',
      btn1: 'सब्जियां खरीदें',
      btn2: 'किसान के रूप में जुड़ें',
      stats: ['किसान', 'सब्जियों के प्रकार', 'ग्राहक'],
      howTitle: 'यह कैसे काम करता है?',
      howSub: 'सरल और पारदर्शी प्रक्रिया',
      steps: [
        { title: 'किसान रजिस्टर करता है', desc: 'Farmer ID मिलती है, सब्जियां list करता है' },
        { title: 'ग्राहक Order करता है', desc: 'सीधे किसान से खरीदारी' },
        { title: 'किसान Pack करता है', desc: 'Order confirm करके pack करता है' },
        { title: 'Delivery पहुंचाता है', desc: 'घर तक delivery' }
      ],
      rolesTitle: 'आप कौन हैं?',
      roles: [
        { title: 'किसान', desc: 'सब्जियां list करें, सीधे बेचें', btn: 'किसान के रूप में जुड़ें' },
        { title: 'ग्राहक', desc: 'ताज़ी सब्जियां खरीदें', btn: 'खरीदारी शुरू करें' },
        { title: 'Delivery Boy', desc: 'Part-time काम, extra कमाई', btn: 'Delivery Partner बनें' }
      ]
    },
    nav: { shop: 'सब्जियां', login: 'लॉगिन', register: 'रजिस्टर', dashboard: 'डैशबोर्ड', logout: 'लॉगआउट', cart: 'कार्ट', settings: 'सेटिंग्स' },
    shop: { title: 'सब्जियां', search: 'सब्जियां खोजें...', all: 'सभी', addCart: 'Cart में डालें', noProducts: 'कोई product नहीं', sort: 'Sort करें', latest: 'Latest', priceLow: 'कम कीमत', priceHigh: 'ज़्यादा कीमत' },
    auth: { loginTitle: 'लॉगिन करें', registerTitle: 'Join करें', email: 'Email', password: 'Password', name: 'पूरा नाम', phone: 'Phone', loginBtn: 'Login करें', registerBtn: 'Register करें', noAccount: 'Account नहीं है?', hasAccount: 'पहले से account है?', selectRole: 'आप कौन हैं?', farmName: 'खेत का नाम', village: 'गांव', district: 'जिला' },
    common: { loading: 'Loading...', back: '← वापस', organic: 'Organic', total: 'कुल', delivery: 'Delivery', free: 'मुफ़्त', save: 'सहेजें', cancel: 'रद्द करें' }
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('fc_theme') === 'dark');
  const [language, setLanguage] = useState(() => localStorage.getItem('fc_lang') || 'mr');

  const toggleTheme = () => {
    setIsDark(prev => { localStorage.setItem('fc_theme', !prev ? 'dark' : 'light'); return !prev; });
  };
  const changeLanguage = (lang) => { setLanguage(lang); localStorage.setItem('fc_lang', lang); };

  const t = TRANSLATIONS[language] || TRANSLATIONS.mr;

  const theme = {
    isDark,
    colors: isDark ? {
      bg: '#0f172a', cardBg: '#1e293b', navBg: '#1e293b', border: '#334155',
      text: '#f1f5f9', subText: '#94a3b8', input: '#334155', inputText: '#f1f5f9',
      green: '#4ade80', greenDark: '#16a34a', hover: '#334155', sectionBg: '#1e293b',
      sidebar: '#0f172a', tableRow: '#1e293b', tag: '#334155'
    } : {
      bg: '#f8fafc', cardBg: '#ffffff', navBg: '#ffffff', border: '#e2e8f0',
      text: '#0f172a', subText: '#64748b', input: '#ffffff', inputText: '#0f172a',
      green: '#16a34a', greenDark: '#15803d', hover: '#f1f5f9', sectionBg: '#f0fdf4',
      sidebar: '#0f172a', tableRow: '#f8fafc', tag: '#f1f5f9'
    }
  };

  useEffect(() => {
    document.body.style.background = theme.colors.bg;
    document.body.style.color = theme.colors.text;
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, language, changeLanguage, t, theme, LANGUAGES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);