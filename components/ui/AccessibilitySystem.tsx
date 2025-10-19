import React, { useState } from 'react';
import AccessibilityMenu from './AccessibilityMenu';
import GlobalAccessibilityButton from './GlobalAccessibilityButton';

export default function AccessibilitySystem() {
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  const handleOpenMenu = () => {
    try {
      setShowAccessibilityMenu(true);
    } catch (error) {
      console.warn('Error opening accessibility menu:', error);
    }
  };

  const handleCloseMenu = () => {
    try {
      setShowAccessibilityMenu(false);
    } catch (error) {
      console.warn('Error closing accessibility menu:', error);
    }
  };

  return (
    <>
      <GlobalAccessibilityButton 
        onPress={handleOpenMenu} 
      />
      <AccessibilityMenu 
        visible={showAccessibilityMenu}
        onClose={handleCloseMenu}
      />
    </>
  );
}