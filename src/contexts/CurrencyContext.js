"use client"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export const CurrencyContext = createContext();

export const CURRENCY_DATA = [
    { name: 'USD', code: 'USD', symbol: '$', flag: '🇺🇸', label: 'US Dollar' },
    { name: 'EUR', code: 'EUR', symbol: '€', flag: '🇪🇺', label: 'Euro' },
    { name: 'GBP', code: 'GBP', symbol: '£', flag: '🇬🇧', label: 'British Pound' },
    { name: 'CAD', code: 'CAD', symbol: 'CA$', flag: '🇨🇦', label: 'Canadian Dollar' },
    { name: 'PKR', code: 'PKR', symbol: 'Rs', flag: '🇵🇰', label: 'Pakistanti Rupee' },
    { name: 'INR', code: 'INR', symbol: '₹', flag: '🇮🇳', label: 'Indian Rupee' },
];

export function CurrencyProvider({ children, initialRates }) {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [rates, setRates] = useState(initialRates?.usd || {});
    const [timestamp, setTimestamp] = useState(initialRates?.date || null);

    // Initialize from LocalStorage
    useEffect(() => {
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency && CURRENCY_DATA.find(c => c.code === savedCurrency)) {
            setSelectedCurrency(savedCurrency);
        }
    }, []);

    // Persist to LocalStorage
    useEffect(() => {
        localStorage.setItem('selectedCurrency', selectedCurrency);
    }, [selectedCurrency]);

    const formatPrice = useCallback((amountUsd) => {
        if (amountUsd === undefined || amountUsd === null) return '0.00';

        const currency = CURRENCY_DATA.find(c => c.code === selectedCurrency) || CURRENCY_DATA[0];
        const rate = selectedCurrency === 'USD' ? 1 : rates[selectedCurrency.toLowerCase()];

        if (!rate) return `${currency.symbol}${Number(amountUsd).toFixed(2)}`;

        const converted = Number(amountUsd) * rate;

        if (selectedCurrency === 'PKR' || selectedCurrency === 'INR') {
            return `${currency.symbol} ${Math.round(converted).toLocaleString()}`;
        }

        return `${currency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }, [selectedCurrency, rates]);

    const value = useMemo(() => ({
        selectedCurrency,
        setSelectedCurrency,
        formatPrice,
        rates,
        timestamp,
        availableCurrencies: CURRENCY_DATA
    }), [selectedCurrency, formatPrice, rates, timestamp]);

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};