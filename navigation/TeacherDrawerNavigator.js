import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import TeacherAttendanceScreen from "../screens/TeacherAttendanceScreen";
import CustomDrawer from "./CustomDrawer";

const Drawer = createDrawerNavigator();

export default function TeacherDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: "#e0e7ff",
        drawerActiveTintColor: "#1a4fc3",
        drawerInactiveTintColor: "#444",
      }}
    >
      <Drawer.Screen
        name="Mark Attendance"
        component={TeacherAttendanceScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="checkmark-done-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
