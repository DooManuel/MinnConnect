import 'react-native-gesture-handler';
import React from "react";
import AppNavigator from "./navigation/AppNavigator";
import { MyKidsProvider } from "./context/MyKidsContext";

export default function App() {
  return (
    <MyKidsProvider>
      <AppNavigator />
    </MyKidsProvider>
  );
}

