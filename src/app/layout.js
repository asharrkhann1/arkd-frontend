import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
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

  const serviceResponse = await fetch(`${process.env.BACKEND_URL}/services`, {
    cache: "no-store",
    headers,
    credentials: "include"
  });
  const serviceData = await serviceResponse.json();

  const currencyRateResponse = await fetch(
    process.env.CURRENCY_RATE_API_URL,
    { next: { revalidate: 86400 } }
  );
  const currencyRateData = await currencyRateResponse.json();

  let wishlistItems = [];
  try {
    if (headers) {
      const wlRes = await fetch(`${process.env.BACKEND_URL}/wishlist/me`, {
        cache: "no-store",
        headers
      });

      if (wlRes.ok) {
        const wlData = await wlRes.json();
        const items = wlData && typeof wlData === 'object' ? wlData.items : null;
        wishlistItems = Array.isArray(items) ? items : [];
      }
    }
  } catch (error) {
    console.error("Failed to fetch initial wishlist:", error);
    wishlistItems = [];
  }

  return { serviceData, currencyRateData, wishlistItems };
}


export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join('; ');

  const { serviceData, currencyRateData, wishlistItems } = await getInitialData(cookieHeader);


  let services = serviceData.services ? serviceData.services : [];
  let currencyRates = currencyRateData ? currencyRateData : {};

  let data = {
    services,
    currencyRates
  }

  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <DataProvider data={data} >
          <AuthProvider>
            <CurrencyProvider initialRates={currencyRates}>
              <WishlistProvider initialWishlist={wishlistItems}>
                <Navbar />
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
          </AuthProvider>
        </DataProvider>
      </body>
    </html>
  );
}
