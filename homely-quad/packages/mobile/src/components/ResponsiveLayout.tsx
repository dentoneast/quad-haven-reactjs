import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { usePlatform } from '../hooks/usePlatform';
import { getResponsivePadding, isDesktop } from '../utils/responsive';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  style?: any;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, style }) => {
  const { isWeb } = usePlatform();
  const { width } = Dimensions.get('window');

  const containerStyle = [
    styles.container,
    isWeb && isDesktop(width) && styles.desktopContainer,
    style,
  ];

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  desktopContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
});

export default ResponsiveLayout;
