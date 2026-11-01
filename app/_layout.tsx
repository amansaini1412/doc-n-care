import { CustomToast } from '@/components/brand/premium';
import { Palette } from '@/constants/palette';
import { Type } from '@/constants/tokens';
import { ShopProvider } from '@/context/ShopContext';
import { SkinProvider } from '@/context/SkinContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SkinProvider>
      <ShopProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            contentStyle: { backgroundColor: Palette.ivory },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="dermatologist"
            options={{
              headerShown: true,
              title: 'AI Skincare Assistant',
              headerTintColor: Palette.primary,
              headerStyle: { backgroundColor: Palette.ivory },
              headerTitleStyle: {
                fontFamily: Type.display,
                fontWeight: '600',
                color: Palette.primary,
              },
              headerShadowVisible: false,
              animation: 'slide_from_right',
              presentation: 'card',
            }}
          />
        </Stack>
        <CustomToast />
      </ShopProvider>
    </SkinProvider>
  );
}
