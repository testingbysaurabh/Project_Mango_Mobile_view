import React, { createContext, useContext, useState } from 'react'


export const GlobalContext = createContext()
export const MyContext = ({ children }) => {
    const [ui, setUi] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState("");

    return (
        <GlobalContext.Provider value={
            {
                ui, setUi,
                isLoading, setIsLoading,
                phone, setPhone

            }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}