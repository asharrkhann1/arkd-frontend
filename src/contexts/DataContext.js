"use client";

import { createContext, useContext } from "react";

const DataContext = createContext(null);

export function DataProvider({ children, data }) {
    return (
        <DataContext.Provider value={data}>
            {children}
        </DataContext.Provider>
    );
}


export const useData = () => useContext(DataContext);
