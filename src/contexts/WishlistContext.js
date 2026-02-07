'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../lib/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export function WishlistProvider({ children, initialWishlist = [] }) {
    const { user, loading: authLoading } = useAuth();
    const [wishlist, setWishlist] = useState(initialWishlist);
    const [loading, setLoading] = useState(false);
    const initializedRef = React.useRef(!!initialWishlist?.length);

    const fetchWishlist = useCallback(async () => {
        if (authLoading) return;

        if (!user) {
            setWishlist([]);
            return;
        }
        // Skip first fetch if we have initial data
        if (initializedRef.current) {
            initializedRef.current = false;
            return;
        }

        setLoading(true);
        try {
            const data = await apiFetch('/wishlist/me');
            const items = data && typeof data === 'object' ? data.items : null;
            setWishlist(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
            // Don't clear wishlist on error if we have initial data, might be transient
            if (!initialWishlist.length) setWishlist([]);
        } finally {
            setLoading(false);
        }
    }, [user, authLoading, initialWishlist]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (productId) => {
        if (!user) return toast.error('Please login to add to wishlist');
        try {
            await apiFetch('/wishlist', {
                method: 'POST',
                body: { product_id: productId }
            });
            await fetchWishlist();
            return true;
        } catch (error) {
            console.error('Failed to add to wishlist:', error);
            return false;
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!user) return false;
        try {
            await apiFetch(`/wishlist/${productId}`, {
                method: 'DELETE'
            });
            await fetchWishlist();
            return true;
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            return false;
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => String(item.id) === String(productId));
    };

    const toggleWishlist = async (product) => {
        if (isInWishlist(product.id)) {
            return await removeFromWishlist(product.id);
        } else {
            return await addToWishlist(product.id);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist,
            refreshWishlist: fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
