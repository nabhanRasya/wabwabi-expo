import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";

function TabIcon({
  color,
  name,
}: {
  color: string;
  name: {
    ios: "house.fill" | "magnifyingglass" | "calendar" | "person.crop.circle";
    android: "home" | "search" | "calendar_month" | "person";
    web: "home" | "search" | "calendar_month" | "person";
  };
}) {
  return <SymbolView name={name} size={23} tintColor={color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#e94560",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
        tabBarStyle: {
          backgroundColor: "#1a1a2e",
          borderTopColor: "#2d2d3d",
          minHeight: 64,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabIcon color={color} name={{ android: "home", ios: "house.fill", web: "home" }} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Cari",
          tabBarIcon: ({ color }) => (
            <TabIcon
              color={color}
              name={{ android: "search", ios: "magnifyingglass", web: "search" }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Jadwal",
          tabBarIcon: ({ color }) => (
            <TabIcon
              color={color}
              name={{ android: "calendar_month", ios: "calendar", web: "calendar_month" }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <TabIcon
              color={color}
              name={{ android: "person", ios: "person.crop.circle", web: "person" }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
