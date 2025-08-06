// app/(modals)/settingsModal.tsx
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onResetInputs: () => void;
  onTriggerAdminLogin: () => void;
};

const SettingsModal: React.FC<Props> = ({
  visible,
  onClose,
  onToggleTheme,
  isDarkMode,
  onResetInputs,
  onTriggerAdminLogin,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const confirmReset = () => {
    Alert.alert(
      'Reset Inputs',
      'Are you sure you want to reset all inputs?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: onResetInputs },
      ],
      { cancelable: true }
    );
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
        }}
      >
        <View
          style={{
            backgroundColor: '#1E1E2E',
            padding: 24,
            borderRadius: 20,
            width: '85%',
            elevation: 10,
          }}
        >
          <Text style={{ fontSize: 22, color: '#CBA6F7', fontWeight: 'bold', marginBottom: 20 }}>
            ⚙️ Settings
          </Text>

          {/* Theme Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={22} color="#FAB387" />
            <Text style={{ color: '#CDD6F4', fontSize: 16, marginLeft: 12, flex: 1 }}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={onToggleTheme}
              thumbColor={isDarkMode ? '#CBA6F7' : '#A6E3A1'}
              trackColor={{ false: '#A6ADC8', true: '#585B70' }}
            />
          </View>

          {/* Admin Login */}
          <Pressable
            onPress={onTriggerAdminLogin}
            style={{
              backgroundColor: '#F5C2E7',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Feather name="shield" size={18} color="#1E1E2E" />
            <Text style={{ color: '#1E1E2E', marginLeft: 8, fontWeight: 'bold' }}>Admin Login</Text>
          </Pressable>

          {/* About Us */}
          <Pressable
            onPress={() => {
              onClose();
              router.push('/(screens)/aboutScreen');
            }
          }
          style={{
              backgroundColor: '#89B4FA',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            >
            <Feather name="info" size={18} color="#1E1E2E" />
            <Text style={{ color: '#1E1E2E', marginLeft: 8, fontWeight: 'bold' }}>
              About Us
            </Text>
          </Pressable>


          {/* Reset Inputs */}
          <Pressable
            onPress={confirmReset}
            style={{
              backgroundColor: '#F38BA8',
              borderRadius: 8,
              padding: 12,
              marginBottom: 24,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Feather name="rotate-ccw" size={18} color="#1E1E2E" />
            <Text style={{ color: '#1E1E2E', marginLeft: 8, fontWeight: 'bold' }}>Reset Inputs</Text>
          </Pressable>

          {/* Close Button */}
          <Pressable
            onPress={onClose}
            style={{
              alignSelf: 'center',
              paddingVertical: 6,
              paddingHorizontal: 20,
              borderRadius: 6,
              backgroundColor: '#A6ADC8',
            }}
          >
            <Text style={{ color: '#1E1E2E', fontWeight: '600' }}>Close</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default SettingsModal;
