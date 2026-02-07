"use client"
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children, initialCart = [] }) {
    const [cart, setCart] = useState(initialCart);

    // Initialize from Cookies (for SSR compatibility)
    useEffect(() => {
        if (initialCart.length > 0) return; // Already hydrated from server

        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const savedCart = getCookie('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(decodeURIComponent(savedCart)));
            } catch (e) {
                console.error("Failed to parse cart cookie", e);
            }
        }
    }, [initialCart]);

    // Persist to Cookies (Only save essential info for display and functionality)
    useEffect(() => {
        const miniCart = cart.map(({ id, slug, quantity, selected_addons, title, price, thumbnail_image, addons }) => ({
            id,
            slug,
            quantity,
            selected_addons: selected_addons || {},
            title,
            price,
            thumbnail_image,
            addons
        }));
        document.cookie = `cart=${encodeURIComponent(JSON.stringify(miniCart))}; path=/; max-age=31536000; SameSite=Lax`;
    }, [cart]);

    const addToCart = (product, selected_addons = {}) => {
        setCart(prev => {
            // Check if product with SAME addons already exists
            const existing = prev.find(item =>
                String(item.id) === String(product.id) &&
                JSON.stringify(item.selected_addons || {}) === JSON.stringify(selected_addons)
            );

            if (existing) {
                return prev.map(item =>
                    (String(item.id) === String(product.id) && JSON.stringify(item.selected_addons || {}) === JSON.stringify(selected_addons))
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            }
            // Keep the full object in memory for now so the UI doesn't break immediately
            return [...prev, { ...product, quantity: 1, selected_addons }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, (item.quantity || 1) + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const updateAddons = (productId, newAddons) => {
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, selected_addons: newAddons } : item
        ));
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateAddons, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
