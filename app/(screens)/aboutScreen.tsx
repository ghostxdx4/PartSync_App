import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export default function AboutScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const openGitHub = () => {
    Linking.openURL('https://github.com/ghostxdx4/PartSync');
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: '#1E1E2E',
        opacity: fadeAnim,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: '#CBA6F7',
            marginTop: 50,
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          About PartSync
        </Text>

        <View
          style={{
            backgroundColor: '#313244',
            padding: 20,
            borderRadius: 16,
            marginBottom: 24,
            width: '100%',
            elevation: 6,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: '#CDD6F4',
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            PartSync helps you find the best GPU recommendations based on your
            existing PC components. It analyzes your CPU, PSU, Motherboard, and
            Budget to suggest the most compatible and optimal GPUs.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#1E1E2E',
            borderWidth: 1,
            borderColor: '#CBA6F7',
            padding: 20,
            borderRadius: 16,
            marginBottom: 24,
            width: '100%',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#F5C2E7',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            🔧 Tech Stack
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#BAC2DE',
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            React Native (Expo) • Axios • lottie-react-native • Node.js • Express.js • bcrypt • MySQL  
          </Text>
        </View>

        <Pressable
          onPress={openGitHub}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#DDB6F2' : '#CBA6F7',
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 12,
            marginBottom: 32,
            elevation: 4,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          })}
        >
          <Text
            style={{
              color: '#1E1E2E',
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            🌐 View on GitHub
          </Text>
        </Pressable>

        <Image
          source={require('../../assets/gpu-icon.png')}
          style={{
            width: 60,
            height: 60,
            marginBottom: 16,
            tintColor: '#CBA6F7',
          }}
          resizeMode="contain"
        />

        <Pressable
          onPress={() => router.replace('..')}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#BAC2DE' : '#A6ADC8',
            paddingVertical: 12,
            paddingHorizontal: 28,
            borderRadius: 12,
            marginBottom: 36,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          })}
        >
          <Text
            style={{
              color: '#1E1E2E',
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            ⬅️ Return to Dashboard
          </Text>
        </Pressable>

        <Text
          style={{
            color: '#A6ADC8',
            fontSize: 14,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          🛠️ Painfully assembled by Dylen after too much coffee and zero sleep
        </Text>
        <Text
          style={{
            color: '#6C7086',
            fontSize: 12,
            textAlign: 'center',
          }}
        >
          © 2025 PartSync
        </Text>
      </ScrollView>
    </Animated.View>
  );
}
