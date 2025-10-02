// MainScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerScreenProps } from '@react-navigation/drawer';

type TaiKhoanScreenProps = DrawerScreenProps<any>;

const TaiKhoanScreen: React.FC<TaiKhoanScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'gray' }}>
      {/* create header */}
      <View
        style={{
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomColor: '#ccc',
          backgroundColor: '#fff',
          borderBottomEndRadius: 32,
          borderBottomStartRadius: 32,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tài Khoản</Text>

        <View style={{ position: 'absolute', top: 4, left: 8, zIndex: 10 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.toggleDrawer();
            }}
          >
            <Text style={{ fontSize: 24, margin: 8 }}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TaiKhoanScreen;

/** ---------- Utils & Styles ---------- */

const styles = StyleSheet.create({});
