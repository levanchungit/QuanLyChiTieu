import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native';
import MainScreen from './screens/MainScreen';
import { enableScreens } from 'react-native-screens';
import TaiKhoanScreen from './screens/MainScreen/TaiKhoan';
enableScreens();
const Drawer = createDrawerNavigator();

function AppContent() {
  return (
    <Drawer.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Main" component={MainScreen} />
      <Drawer.Screen name="TaiKhoan" component={TaiKhoanScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
