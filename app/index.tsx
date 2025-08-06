// app/index.tsx
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  Text
} from 'react-native';

import AdminLoginModal from './(modals)/AdminLoginModal';
import SettingsModal from './(modals)/settingsModal';


export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const [adminVisible, setAdminVisible] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Fade-in animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E2E',
        opacity: fadeAnim,
        paddingHorizontal: 24,
      }}
    >
      {/* Logo / GPU icon */}
      <Image
        source={require('../assets/gpu-icon.png')}
        style={{
          width: 80,
          height: 80,
          marginBottom: 30,
          tintColor: '#CBA6F7',
        }}
        resizeMode="contain"
      />

      <Text style={{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#CBA6F7',
        marginBottom: 16,
        textAlign: 'center',
      }}>
        Welcome to PartSync
      </Text>

      <Text style={{
        fontSize: 16,
        color: '#A6ADC8',
        textAlign: 'center',
        marginBottom: 40,
      }}>
        Get GPU recommendations based on your PC’s configuration.
      </Text>

      <Pressable
        onPress={() => router.push('/(screens)/hardwareInput')}
        android_ripple={{ color: '#A6ADC8' }}
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#D9BFFF' : '#CBA6F7',
          paddingVertical: 14,
          paddingHorizontal: 36,
          borderRadius: 12,
          elevation: pressed ? 2 : 6,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        })}
      >
        <Text style={{
          color: '#1E1E2E',
          fontWeight: 'bold',
          fontSize: 16,
        }}>
          Get Started
        </Text>
      </Pressable>

      {/* Floating gear/settings button (optional) */}
      <Pressable
        onPress={() => setSettingsVisible(true)}
        style={{
          position: 'absolute',
          top: 50,
          right: 24,
          padding: 10,
        }}
      >
        <Image
          source={require('../assets/gear.png')} // make sure this exists
          style={{ width: 24, height: 24, tintColor: '#CBA6F7' }}
        />
      </Pressable>

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onToggleTheme={() => setIsDark(prev => !prev)}
        isDarkMode={isDark}
        onResetInputs={() => {
          // Reset logic (if global state, use context)
        }}
        onTriggerAdminLogin={() => {
          setSettingsVisible(false);
          setAdminVisible(true);
        }}
      />

        {/* Admin Login Modal */}
        <AdminLoginModal
  visible={adminVisible}
  onClose={() => setAdminVisible(false)}
  onSuccess={(token: string) => {
    setAdminToken(token);
  }}
/>

    </Animated.View>
  );
}
