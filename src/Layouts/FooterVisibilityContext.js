import React, { createContext, useContext, useState } from 'react'

const FooterVisibilityContext = createContext();
const FooterVisibilityUpdateContext = createContext();

// Hook to use the footer visibility state
export function useFooterVisibility() {
    return useContext(FooterVisibilityContext);
  }

  // Hook to use the update function for footer visibility
export function useFooterVisibilityUpdate() {
    return useContext(FooterVisibilityUpdateContext);
  }

export function FooterVisibilityProvider({children}) {
    const [isVisible, setIsVisible] = useState(true);

  function toggleFooterVisibility() {
    setIsVisible(prev => !prev);
  }
  return (
    <>
    <FooterVisibilityContext.Provider value={isVisible}>
      <FooterVisibilityUpdateContext.Provider value={toggleFooterVisibility}>
        {children}
      </FooterVisibilityUpdateContext.Provider>
    </FooterVisibilityContext.Provider>
    </>
  )
}
