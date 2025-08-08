import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, StyleSheet, Text, View } from 'react-native';

let LottieComponent: any;

if (Platform.OS === 'web') {
  LottieComponent = require('lottie-react').default;
} else {
  LottieComponent = require('lottie-react-native').default;
}

const { width } = Dimensions.get('window');

const tips = [
  "💡 Tip: A balanced PSU ensures long GPU life.",
  "🔧 Did you know? PCIe 4.0 GPUs can run on PCIe 3.0 slots.",
  "⚡ TDP ≠ power draw, but it’s close enough for compatibility.",
  "🧠 Bottlenecks happen when CPU can't keep up with GPU.",
];

export default function LoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 2500);

    const fetchRecommendations = async () => {
      try {
        const res = await axios.post('http://192.168.110.54:5000/api/recommend', {
          cpuId: params.cpuId,
          psuWattage: params.psuWattage,
          connectors: typeof params.connectors === 'string' ? params.connectors.split(',') : params.connectors,
          moboPcieVersion: params.moboPcieVersion,
          budget: params.budget,
          strict: params.strict === 'true',
        });

        const { data } = res;

        router.replace({
          pathname: '/(screens)/RecommendationScreen',
          params: { recommendations: JSON.stringify(data) },
        });
      } catch (err) {
        console.error('Recommendation fetch error:', err);
        router.replace('/(screens)/RecommendationScreen');
      }
    };

    fetchRecommendations();
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <LottieComponent
        source={
          Platform.OS === 'web'
            ? require('../../assets/animations/processing-chip.json')
            : require('../../assets/animations/processing-chip.json')
        }
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />

      <Text style={styles.text}>Analyzing your build...</Text>
      <Text style={styles.tip}>{tips[tipIndex]}</Text>

      <ActivityIndicator size="large" color="#8A2BE2" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    color: '#fff',
    marginTop: 16,
  },
  tip: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 12,
    textAlign: 'center',
    width: width * 0.8,
  },
});
