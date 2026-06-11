import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { TabKey, Service } from './lib/types';

import HomeScreen          from './screens/HomeScreen';
import ServicesScreen      from './screens/ServicesScreen';
import CoursesScreen       from './screens/CoursesScreen';
import ProfileScreen       from './screens/ProfileScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';
import AnimatedTabBar      from './components/AnimatedTabBar';

const BG = '#F7F9FB';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('Home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const renderScreen = () => {
    if (selectedService) {
      return (
        <ServiceDetailScreen 
          service={selectedService} 
          onBack={() => setSelectedService(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'Home':     return <HomeScreen onNavigate={setActiveTab} />;
      case 'Services': return <ServicesScreen onServiceSelect={setSelectedService} />;
      case 'Courses':  return <CoursesScreen />;
      case 'Profile':  return <ProfileScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>

      {!selectedService && (
        <AnimatedTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </SafeAreaView>
  );
}

/* ── Styles ──────────────────────────────────────── */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 0 : 0,
  },
  screenContainer: { flex: 1 },
});
