import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePlatform } from '../hooks/usePlatform';
import { getResponsivePadding, getContainerMaxWidth } from '../utils/responsive';
import WebNavigation from './web/WebNavigation';
import WebSidebar from './web/WebSidebar';
import SideMenu from './SideMenu';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  showSidebar = false 
}) => {
  const { isWeb } = usePlatform();
  const navigation = useNavigation();
  const [isWebSidebarOpen, setIsWebSidebarOpen] = useState(false);

  const handleWebMenuToggle = () => {
    setIsWebSidebarOpen(!isWebSidebarOpen);
  };

  const handleWebSidebarClose = () => {
    setIsWebSidebarOpen(false);
  };

  if (isWeb) {
    return (
      <View style={styles.webContainer}>
        <WebNavigation 
          onMenuToggle={handleWebMenuToggle}
          isMenuOpen={isWebSidebarOpen}
        />
        <WebSidebar 
          isOpen={isWebSidebarOpen}
          onClose={handleWebSidebarClose}
          navigation={navigation}
        />
        <View style={[
          styles.webContent, 
          { 
            marginLeft: isWebSidebarOpen ? 280 : 0,
            maxWidth: getContainerMaxWidth(),
            marginHorizontal: 'auto'
          }
        ]}>
          {children}
        </View>
      </View>
    );
  }

  // Mobile layout - render children as-is (mobile navigation is handled by AppNavigator)
  return (
    <View style={styles.mobileContainer}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webContent: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(),
    paddingTop: 16,
    paddingBottom: 16,
    transition: 'margin-left 0.3s ease',
  },
  mobileContainer: {
    flex: 1,
  },
});

export default ResponsiveLayout;
