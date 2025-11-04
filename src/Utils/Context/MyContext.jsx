import React, { useState } from 'react'
import { GlobalContext } from './context'

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