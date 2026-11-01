import { HapticTab } from '@/components/haptic-tab';
import { Palette } from '@/constants/palette';
import { Type } from '@/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Palette.primary,
        tabBarInactiveTintColor: Palette.gold,
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 11,
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: Palette.ivory,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 66,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: Palette.ink,
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.06,
              shadowRadius: 16,
            },
            android: { elevation: 8 },
            web: { boxShadow: '0 -8px 24px rgba(41,37,33,0.05)' },
          }),
        },
        headerStyle: { backgroundColor: Palette.ivory },
        headerShadowVisible: false,
        headerTitleStyle: {
          color: Palette.primary,
          fontFamily: Type.display,
          fontWeight: '600',
          fontSize: 18,
          letterSpacing: 0.4,
        },
        sceneStyle: { backgroundColor: Palette.ivory },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerTitle: 'Doc & Care',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analyze"
        options={{
          title: 'Analyze',
          headerTitle: 'Skin Analysis',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'aperture' : 'aperture-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerTitle: 'Explore Care',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'sparkles' : 'sparkles-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          headerTitle: 'Ingredient Scan',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'barcode' : 'barcode-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Your Skin Map',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
