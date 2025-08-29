import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AttendanceProvider } from "./context/AttendanceContext";
import CalendarScreen from "./components/CalendarScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AttendanceProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Calendar" component={CalendarScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AttendanceProvider>
  );
}
