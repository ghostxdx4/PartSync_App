// app/(modals)/AdminLoginModal.tsx
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
};

export default function AdminLoginModal({ visible, onClose, onSuccess }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
      setStep('login');
      setEmail('');
      setPassword('');
      setOtp('');
      setError('');
    }
  }, [visible]);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('adminToken');
      if (token) router.replace('/(screens)/AdministrationScreen');
    };
    checkToken();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://192.168.110.54:5000/api/admin/login', {
        email,
        password,
      });

      if (res?.data?.success) {
        setStep('otp');
      } else {
        setError(res?.data?.message || 'Invalid login credentials.');
      }
    } catch {
      setError('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://192.168.110.54:5000/api/admin/verify-otp', {
        email,
        otp,
      });

      if (res?.data?.success && res.data.token) {
        await SecureStore.setItemAsync('adminToken', res.data.token);
        await SecureStore.setItemAsync('adminEmail', email);
        onSuccess(res.data.token);
        router.replace('/(screens)/AdministrationScreen');
      } else {
        setError(res?.data?.message || 'OTP verification failed');
      }
    } catch {
      setError('Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            backgroundColor: '#1E1E2E',
            borderRadius: 20,
            padding: 24,
            width: '100%',
            maxWidth: 400,
            elevation: 10,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Text
            style={{
              fontSize: 22,
              color: '#CBA6F7',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            {step === 'login' ? 'Admin Login' : 'Enter OTP'}
          </Text>

          {step === 'login' ? (
            <>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#A6ADC8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: '#313244',
                  color: 'white',
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 12,
                }}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#A6ADC8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                  backgroundColor: '#313244',
                  color: 'white',
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 12,
                }}
              />
              {error ? (
                <Text style={{ color: '#F38BA8', fontSize: 14, textAlign: 'center' }}>{error}</Text>
              ) : null}
              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={{
                  backgroundColor: '#CBA6F7',
                  padding: 14,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 8,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#1E1E2E" />
                ) : (
                  <Text style={{ color: '#1E1E2E', fontWeight: 'bold' }}>Send OTP</Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor="#A6ADC8"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                style={{
                  backgroundColor: '#313244',
                  color: 'white',
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 12,
                }}
              />
              {error ? (
                <Text style={{ color: '#F38BA8', fontSize: 14, textAlign: 'center' }}>{error}</Text>
              ) : null}
              <Pressable
                onPress={handleOTPVerify}
                disabled={loading}
                style={{
                  backgroundColor: '#A6E3A1',
                  padding: 14,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 8,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#1E1E2E" />
                ) : (
                  <Text style={{ color: '#1E1E2E', fontWeight: 'bold' }}>Verify OTP</Text>
                )}
              </Pressable>
            </>
          )}

          <Pressable onPress={onClose} style={{ alignItems: 'center', marginTop: 16 }}>
            <Text style={{ color: '#BAC2DE', fontSize: 14 }}>Cancel</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}
