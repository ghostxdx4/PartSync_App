import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE = 'http://192.168.110.54:5000/admin'; // Replace with your backend IP or domain

const types = ['cpu', 'psu', 'motherboard', 'gpu'] as const;
type HardwareType = typeof types[number];

const fieldMap: Record<HardwareType, string[]> = {
  cpu: ['name', 'brand', 'model', 'cores', 'threads', 'tdp', 'performance_score'],
  psu: ['wattage', 'connector_6_pin', 'connector_8_pin', 'connector_12_pin'],
  motherboard: ['name', 'chipset', 'pcie_version'],
  gpu: ['name', 'brand', 'vram', 'tdp', 'pcie_version', 'performance_score', 'price'],
};

const AdministrationScreen = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<HardwareType>('cpu');
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/get/${selectedType}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      Alert.alert('Error', 'Failed to load data.');
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/add/${selectedType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Item added.');
        fetchData();
        setForm({});
      } else {
        Alert.alert('Failed', result.message || 'Something went wrong.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network or server error.');
    }
  };

  useEffect(() => {
    setForm({});
    fetchData();
  }, [selectedType]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🛠 Admin Panel</Text>

      <View style={styles.selector}>
        {types.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.selectButton,
              selectedType === type && styles.activeSelectButton,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.selectButtonText,
                selectedType === type && styles.activeSelectButtonText,
              ]}
            >
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll}>
        {data.map((item, idx) => (
          <View key={idx} style={styles.card}>
            {Object.entries(item).map(([key, val]) => (
              <Text key={key} style={styles.cardText}>
                <Text style={{ fontWeight: 'bold' }}>{key}:</Text> {String(val)}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>

      <Text style={styles.subheading}>Add New {selectedType.toUpperCase()}</Text>
      {fieldMap[selectedType].map((field) => (
        <TextInput
          key={field}
          placeholder={field}
          placeholderTextColor="#888"
          style={styles.input}
          value={form[field] || ''}
          onChangeText={(text) => handleInputChange(field, text)}
        />
      ))}

      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>➕ Add {selectedType}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/hardwareInput')}>
        <Text style={styles.restart}>🏠 Back to Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AdministrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#BB86FC',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  selectButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
  },
  activeSelectButton: {
    backgroundColor: '#3700B3',
  },
  selectButtonText: {
    color: '#ccc',
    fontSize: 14,
  },
  activeSelectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scroll: {
    maxHeight: 220,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  cardText: {
    color: '#eee',
    fontSize: 12,
  },
  subheading: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
    borderColor: '#333',
    borderWidth: 1,
  },
  submit: {
    backgroundColor: '#03DAC5',
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  submitText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  restart: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: '#BB86FC',
  },
});
