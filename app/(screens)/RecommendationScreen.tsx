import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const RecommendationScreen = () => {
  const router = useRouter();
  const { recommendations } = useLocalSearchParams();

  const data = recommendations ? JSON.parse(recommendations as string) : [];

  // Animations: staggered fade-in + slide-up
  const anims = data.map(() => ({
    opacity: useRef(new Animated.Value(0)).current,
    translateY: useRef(new Animated.Value(30)).current,
  }));

  useEffect(() => {
    const animations = anims.map(
      ({ opacity, translateY }: { opacity: Animated.Value; translateY: Animated.Value }, index: number) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          delay: index * 200,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(100, animations).start();
  }, []);

  const getBadgeColor = (label: string) => {
    if (label.includes("No Bottleneck")) return "#4CAF50";
    if (label.includes("PSU OK")) return "#2196F3";
    if (label.includes("PCIe Compatible")) return "#FFC107";
    return "#9E9E9E";
  };

  const labelMap = ["🥇 Best Value", "💎 High-End", "💰 Budget-Friendly"];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Top GPU Recommendations</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {data.map((gpu: any, index: number) => (
          <Animated.View
            key={index}
            style={[
              styles.card,
              {
                opacity: anims[index].opacity,
                transform: [{ translateY: anims[index].translateY }],
              },
            ]}
          >
            <Text style={styles.label}>{labelMap[index] || "💡 Option"}</Text>
            <Image source={{ uri: gpu.image }} style={styles.image} />

            <View style={styles.infoBox}>
              <Text style={styles.gpuName}>{gpu.name}</Text>
              <Text style={styles.detail}>💾 VRAM: {gpu.vram} GB</Text>
              <Text style={styles.detail}>🔥 TDP: {gpu.tdp} W</Text>
              <Text style={styles.detail}>⚡ Performance: {gpu.score}</Text>
              <Text style={styles.detail}>💰 Price: ₹{gpu.price}</Text>
            </View>

            <View style={styles.tags}>
              {gpu.tags?.map((tag: string, i: number) => (
                <View key={i} style={[styles.tag, { backgroundColor: getBadgeColor(tag) }]}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Add More Info Modal here if needed */}
          </Animated.View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={() => router.replace('/(screens)/hardwareInput')}>
        <Text style={styles.restart}>🔄 Start Over</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RecommendationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  scroll: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 18,
    color: '#B388FF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: width - 64,
    height: 180,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: '#000',
    alignSelf: 'center',
  },
  infoBox: {
    marginTop: 10,
  },
  gpuName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
  },
  restart: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    color: '#BB86FC',
  },
});
