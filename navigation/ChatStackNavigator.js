import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChatListScreen from "../screens/ChatListScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen";

const Stack = createNativeStackNavigator();

export default function ChatStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ title: "My Teacher" }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }) => ({ title: route.params?.title || "Chat" })}
      />
    </Stack.Navigator>
  );
}
