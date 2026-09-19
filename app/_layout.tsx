import DrawerContent from '@/src/components/DrawerContent';
import { runMigrations } from '@/src/db/migrations';
import { seedDatabase } from '@/src/db/seed';
import QueryProvider from '@/src/providers/QueryProvider';
import { SplashScreen } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
  useEffect(() => {
    const init = async () => {
      try {
        await runMigrations();
        await seedDatabase();
      } catch (error) {
        console.error("DB init error:", error);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    init();
  }, []);

  return (
    <QueryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{
            drawerType: "front",
            headerShown: false,
          }}
        >
          <Drawer.Screen name="(tabs)" />
          <Drawer.Screen name="settings" />
        </Drawer>
      </GestureHandlerRootView>
    </QueryProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootLayout;