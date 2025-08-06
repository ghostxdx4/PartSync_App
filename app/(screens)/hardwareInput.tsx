import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type CPU = {
  id: number;
  name: string;
  brand: string;
  cores: number;
  tdp: number;
};

export default function HardwareInputScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // CPU data state
  const [cpus, setCpus] = useState<CPU[]>([]);
  const [filteredCpus, setFilteredCpus] = useState<CPU[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCpu, setSelectedCpu] = useState<CPU | null>(null);
  const [loadingCpu, setLoadingCpu] = useState(true);

  // PSU state
  const [psuWattage, setPsuWattage] = useState('');
  const [connectors, setConnectors] = useState<{ '6-pin': boolean; '8-pin': boolean }>({ '6-pin': false, '8-pin': false });

  // Motherboard state
  const [moboChipset, setMoboChipset] = useState('');
  const [pciVersion, setPciVersion] = useState('');

  // Budget state
  const [budget, setBudget] = useState('');
  const [strictBudget, setStrictBudget] = useState(false);

  // Fetch CPU list on mount
  useEffect(() => {
    fetch('http://192.168.110.54:5000/api/hardware/cpu')
      .then(res => res.json())
      .then((data: CPU[]) => {
        setCpus(data);
        setFilteredCpus(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingCpu(false));
  }, []);

  // Filter CPUs on search
  useEffect(() => {
    const txt = searchText.trim().toLowerCase();
    if (!txt) {
      setFilteredCpus(cpus);
    } else {
      setFilteredCpus(cpus.filter(c => c.name.toLowerCase().includes(txt) || c.brand.toLowerCase().includes(txt)));
    }
  }, [searchText, cpus]);

  const handleSelectCpu = (cpu: CPU) => {
    setSelectedCpu(cpu);
  };

  const handleNext = () => {
    if (step === 1 && !selectedCpu) return alert('Please select a CPU');
    if (step === 2 && (!psuWattage || (!connectors['6-pin'] && !connectors['8-pin']))) return alert('Enter PSU details');
    if (step === 3 && (!pciVersion || !moboChipset)) return alert('Enter motherboard details');
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = () => {
    // Navigate to Loading and pass data
    router.push({
      pathname: '/(screens)/LoadingScreen',
      params: {
        cpuId: selectedCpu!.id,
        psuWattage: parseInt(psuWattage),
        psuConnectors: Object.keys(connectors).filter(k => connectors[k as keyof typeof connectors]),
        motherboardPcie: pciVersion,
        budget: parseFloat(budget),
        strictBudget: strictBudget.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Step {step} of 4</Text>

      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Select Your CPU</Text>
          {loadingCpu ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <TextInput
                style={styles.searchInput}
                placeholder="Search CPU by name or brand..."
                value={searchText}
                onChangeText={setSearchText}
              />
              <FlatList
                data={filteredCpus}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={[
                      styles.card,
                      selectedCpu?.id === item.id && styles.cardSelected,
                    ]}
                    onPress={() => handleSelectCpu(item)}
                  >
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardDetail}>{item.brand} • {item.cores} cores • {item.tdp}W TDP</Text>
                  </Pressable>
                )}
                ListEmptyComponent={<Text>No CPUs found.</Text>}
              />
            </>
          )}
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Enter PSU Info</Text>
          <TextInput
            style={styles.input}
            placeholder="Wattage"
            keyboardType="numeric"
            value={psuWattage}
            onChangeText={setPsuWattage}
          />
          <View style={styles.checkboxRow}>
            {(['6-pin', '8-pin'] as const).map(conn => (
              <Pressable
                key={conn}
                style={[styles.checkboxItem, connectors[conn] && styles.checkboxChecked]}
                onPress={() => setConnectors(prev => ({ ...prev, [conn]: !prev[conn] }))}
              >
                <Text>{conn}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Motherboard</Text>
          <TextInput
            style={styles.input}
            placeholder="Chipset (e.g. B550, Z690...)"
            value={moboChipset}
            onChangeText={setMoboChipset}
          />
          <TextInput
            style={styles.input}
            placeholder="PCIe Version (e.g. 3.0, 4.0)"
            keyboardType="numeric"
            value={pciVersion}
            onChangeText={setPciVersion}
          />
        </View>
      )}

      {step === 4 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Set Your Budget</Text>
          <TextInput
            style={styles.input}
            placeholder="Budget in ₹ (e.g. 30000)"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
          <Pressable
            style={styles.checkboxItem}
            onPress={() => setStrictBudget(!strictBudget)}
          >
            <Text>Strict Budget Mode: {strictBudget ? 'On' : 'Off'}</Text>
          </Pressable>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        {step > 1 && (
          <Pressable style={styles.navButton} onPress={handleBack}>
            <Text style={styles.navText}>Back</Text>
          </Pressable>
        )}
        {step < 4 ? (
          <Pressable style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navText}>Next</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.navButton} onPress={handleSubmit}>
            <Text style={styles.navText}>Analyze Compatibility</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F2F2F2' },
  header: { fontSize: 18, marginBottom: 10, color: '#555' },
  stepContainer: { flex: 1 },
  title: { fontSize: 22, marginBottom: 15 },
  searchInput: { borderWidth: 1, borderColor: '#CCC', padding: 10, borderRadius: 8, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#CCC', padding: 10, borderRadius: 8, marginVertical: 8 },
  card: { padding: 15, marginVertical: 5, borderRadius: 8, backgroundColor: '#FFF' },
  cardSelected: { borderColor: '#CBA6F7', borderWidth: 2, backgroundColor: '#EDE0FF' },
  cardTitle: { fontSize: 18 },
  cardDetail: { color: '#777', marginTop: 4 },
  checkboxRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  checkboxItem: { borderWidth: 1, borderColor: '#555', borderRadius: 5, padding: 8, marginRight: 10 },
  checkboxChecked: { backgroundColor: '#CBA6F7' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  navButton: { backgroundColor: '#CBA6F7', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  navText: { color: '#FFF', fontSize: 16 },
});
