import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AttendanceProvider } from "./context/AttendanceContext";
import CalendarScreen from "./components/CalendarScreen";
import { Colors } from "./constants/theme";

export default function App() {
  return (
    <SafeAreaProvider>
      <AttendanceProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
          <StatusBar 
            barStyle="dark-content" 
            backgroundColor={Colors.background} 
            translucent={false} 
          />
          <CalendarScreen />
        </SafeAreaView>
      </AttendanceProvider>
    </SafeAreaProvider>
  );
}
