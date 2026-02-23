import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from '@/contexts/SocketContext';
import { DataProvider } from '@/contexts/DataContext';
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Toaster } from 'react-hot-toast';
import PresenceTracker from "@/components/PresenceTracker";
import ChatFab from "@/components/ChatFab";

import { cookies } from "next/headers";

export const metadata = {
  title: "ARKD - Premium Game Market",
  description: "The best place to buy game accounts, items, and currencies.",
};

async function getInitialData(cookieHeader) {
  const headers = cookieHeader ? { cookie: cookieHeader } : undefined;

  const servicesResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services`, {
    cache: "no-store",
    headers,
    credentials: "include"
  });
  const servicesData = await servicesResponse.json();

  const availableServices = servicesData?.services || [];
  // console.log('Available services:', availableServices);

  const categoryToServicesMap = {};
  const serviceTypeData = {};

  for (const serviceType of availableServices) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services/${serviceType}`, {
        cache: "no-store",
        headers,
        credentials: "include"
      });

      if (response && response.ok) {
        const data = await response.json();
        const categories = data?.categories || [];

        // console.log(`${serviceType} categories:`, categories);

        serviceTypeData[serviceType] = data;

        categories.forEach(category => {
          if (!categoryToServicesMap[category]) {
            categoryToServicesMap[category] = [];
          }
          categoryToServicesMap[category].push(serviceType);
        });
      }
    } catch (error) {
      console.error(`Failed to fetch ${serviceType}:`, error);
    }
  }

  // Create comprehensive services data object
  const comprehensiveServicesData = {
    services: availableServices,
    categoryToServicesMap: categoryToServicesMap,
    serviceTypeData: serviceTypeData
  };

  // console.log('Category to Services Map:', categoryToServicesMap);

  const giftcardsData = serviceTypeData.giftcards?.services || serviceTypeData.giftcards?.items || serviceTypeData.giftcards?.data || [];
  const accountsData = serviceTypeData.accounts?.services || serviceTypeData.accounts?.items || serviceTypeData.accounts?.data || [];

  const currencyRateResponse = await fetch(
    process.env.CURRENCY_RATE_API_URL,
    { next: { revalidate: 86400 } }
  );
  const currencyRateData = await currencyRateResponse.json();

  let wishlistItems = [];
  let pendingOrders = [];
  let orders = [];

  if (headers) {
    // Fetch initial wishlist
    try {
      const wlRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/me`, {
        cache: "no-store",
        headers
      });
      if (wlRes.ok) {
        const wlData = await wlRes.json();
        const items = wlData && typeof wlData === 'object' ? wlData.items : null;
        wishlistItems = Array.isArray(items) ? items : [];
      }
    } catch (error) {
      console.error("Failed to fetch initial wishlist:", error);
    }

    // Fetch all user orders (not just pending)
    try {
      const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/orders/me`, {
        cache: "no-store",
        headers
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        orders = ordersData && ordersData.orders ? ordersData.orders : (Array.isArray(ordersData) ? ordersData : []);
        pendingOrders = orders.filter(order => order.status !== 'delivered' && order.status !== 'completed');
      }
    } catch (error) {
      console.error("Failed to fetch initial orders:", error);
    }
  }

  return {
    serviceData: servicesData,
    currencyRateData,
    wishlistItems,
    pendingOrders,
    orders,
    giftcardsData,
    accountsData,
    categoryToServicesMap,
    serviceTypeData
  };
}


export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join('; ');

  const { serviceData, currencyRateData, wishlistItems, pendingOrders, orders, giftcardsData, accountsData, categoryToServicesMap, serviceTypeData } = await getInitialData(cookieHeader);


  let services = serviceData.services ? serviceData.services : [];
  let currencyRates = currencyRateData ? currencyRateData : {};

  // Fetch categories for each active service (for FeaturedCategories on homepage)
  let serviceCategories = {};
  if (services.length > 0) {
    const categoryPromises = services.map(async (svc) => {
      const type = typeof svc === 'string' ? svc : svc.type;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services/${type}`, {
          cache: "no-store",
          headers: cookieHeader ? { cookie: cookieHeader } : undefined,
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          return { type, categories: data.categories || [] };
        }
      } catch (e) {
        // ignore
      }
      return { type, categories: [] };
    });
    const categoryResults = await Promise.all(categoryPromises);
    categoryResults.forEach(({ type, categories }) => {
      serviceCategories[type] = categories;
    });
  }

  let data = {
    services,
    currencyRates,
    orders,
    giftcards: giftcardsData,
    accounts: accountsData,
    serviceCategories,
    categoryToServicesMap,
    serviceTypeData
  }

  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <DataProvider data={data} >
          <AuthProvider>
            <SocketProvider>
              <CurrencyProvider initialRates={currencyRates}>
                <WishlistProvider initialWishlist={wishlistItems}>
                  <Navbar initialPendingOrders={pendingOrders} />
                  <Toaster position="top-right" toastOptions={{
                    style: {
                      // background: '#333',
                      // color: '#fff',
                      // border: '1px solid #ffffff10',
                    },
                  }} />
                  {children}
                  <PresenceTracker />
                  <ChatFab />
                  <Footer />
                </WishlistProvider>
              </CurrencyProvider>
            </SocketProvider>
          </AuthProvider>
        </DataProvider>
      </body>
    </html>
  );
}
