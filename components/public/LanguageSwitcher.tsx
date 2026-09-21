'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageOption {
  code: string;
  name: string;
  countryCode: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'id', name: 'Bahasa Indonesia', countryCode: 'ID' },
  { code: 'en', name: 'English', countryCode: 'GB' },
  { code: 'ja', name: '日本語 (Japanese)', countryCode: 'JP' },
  { code: 'zh-CN', name: '中文 (Chinese)', countryCode: 'CN' },
  { code: 'ar', name: 'العربية (Arabic)', countryCode: 'SA' },
  { code: 'es', name: 'Español (Spanish)', countryCode: 'ES' },
  { code: 'fr', name: 'Français (French)', countryCode: 'FR' },
  { code: 'de', name: 'Deutsch (German)', countryCode: 'DE' },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

export const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/id\/([^;]+)/);
    if (match && match[1]) {
      const existing = LANGUAGES.find((l) => l.code === match[1]);
      if (existing) setSelectedLang(existing);
    }

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'id',
            includedLanguages: 'id,en,ja,zh-CN,ar,es,fr,de',
            autoDisplay: false,
          },
          'google_translate_hidden_element'
        );
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => {
        console.warn('Google Translate script loaded with fallbacks.');
      };
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (lang: LanguageOption) => {
    setSelectedLang(lang);
    setIsOpen(false);

    const cookieDomain = window.location.hostname;
    document.cookie = `googtrans=/id/${lang.code}; path=/; domain=${cookieDomain}`;
    document.cookie = `googtrans=/id/${lang.code}; path=/;`;

    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (selectElem) {
      selectElem.value = lang.code;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="relative inline-block text-left notranslate" ref={dropdownRef}>
      <div id="google_translate_hidden_element" className="hidden" />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-black/90 hover:bg-gray-900 border border-amber-400/40 hover:border-amber-400 text-white px-4 py-2.5 min-h-[44px] rounded-full shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer text-xs font-semibold uppercase tracking-wider group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <Globe size={16} className="text-amber-400 shrink-0 group-hover:rotate-45 transition-transform duration-300" />
        <span className="flex items-center space-x-1.5">
          <span className="bg-amber-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded-sm">
            {selectedLang.countryCode}
          </span>
          <span>{selectedLang.code.toUpperCase()}</span>
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2.5 border-b border-gray-800/80 bg-black/40">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1">
              SELECT LANGUAGE / BAHASA
            </p>
          </div>

          <div className="py-1 max-h-64 overflow-y-auto custom-scrollbar">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang)}
                  className={`w-full text-left px-3.5 py-3 text-xs flex items-center justify-between transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 ${
                    isSelected
                      ? 'bg-amber-400/10 text-amber-400 font-bold'
                      : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="bg-gray-800 text-amber-400 text-[10px] font-black px-1.5 py-0.5 rounded-sm">
                      {lang.countryCode}
                    </span>
                    <span>{lang.name}</span>
                  </span>
                  {isSelected && <Check size={14} className="text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
