import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import HomeDashboard from "../screens/HomeDashboard";
import AnnouncementsScreen from "../screens/AnnouncementsScreen";
import HomeworkScreen from "../screens/HomeworkScreen";
import GradesScreen from "../screens/GradesScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import RewardsScreen from "../screens/RewardsScreen";
import ChatStackNavigator from "./ChatStackNavigator";
import TeacherAttendanceScreen from "../screens/TeacherAttendanceScreen";

import CustomDrawer from "./CustomDrawer";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: "#e0e7ff",
        drawerActiveTintColor: "#1a4fc3",
        drawerInactiveTintColor: "#444",
        drawerLabelStyle: { marginLeft: -10, fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeDashboard}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Announcements"
        component={AnnouncementsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Homework"
        component={HomeworkScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="book-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Grades"
        component={GradesScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="school-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
  name="Chat"
  component={ChatStackNavigator}
  options={{
    drawerIcon: ({ color }) => (
      <Ionicons name="chatbubble-ellipses-outline" size={22} color={color} />
    ),
    headerShown: false, // because ChatStack has its own header
  }}
/>


      <Drawer.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="calendar-clear-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
  name="Mark Attendance"
  component={TeacherAttendanceScreen}
  options={{
    drawerIcon: ({ color }) => (
      <Ionicons name="checkbox-outline" size={22} color={color} />
    ),
  }}
/>


      <Drawer.Screen
  name="Rewards"
  component={RewardsScreen}
  options={{
    drawerIcon: ({ color }) => (
      <Ionicons name="ribbon-outline" size={22} color={color} />
    ),
  }}
/>


      <Drawer.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
