import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const ACCENT  = '#7C3AED';
const BG      = '#0A0A0F';
const CARD    = '#14141C';
const BORDER  = '#22222E';
const TEXT2   = '#8888A0';

interface Props {
  onSession: () => void;
}

export default function AuthScreen({ onSession }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        Alert.alert('Check your email', 'We sent a verification link to confirm your account.');
      }
      onSession();
    } catch (err: any) {
      Alert.alert('Auth Error', err.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[BG, '#110B1E', BG]} style={styles.bg}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Branding ── */}
          <View style={styles.brandWrap}>
            <View style={styles.logoCircle}>
              <Ionicons name="flash" size={38} color="#fff" />
            </View>
            <Text style={styles.brandName}>Agency</Text>
            <Text style={styles.tagline}>Your digital partner for{'\n'}apps, web & design</Text>
          </View>

          {/* ── Card ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isLogin ? 'Welcome back' : 'Create account'}</Text>
            <Text style={styles.cardSub}>
              {isLogin ? 'Sign in to continue' : 'Fill in your details to get started'}
            </Text>

            {/* Name (sign-up only) */}
            {!isLogin && (
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={18} color={TEXT2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor={TEXT2}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            {/* Email */}
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={TEXT2} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={TEXT2}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={TEXT2} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor={TEXT2}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
              />
              <TouchableOpacity onPress={() => setShowPw((v) => !v)}>
                <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={TEXT2} />
              </TouchableOpacity>
            </View>

            {/* Submit */}
            <TouchableOpacity onPress={handleAuth} disabled={loading} activeOpacity={0.85}>
              <LinearGradient
                colors={[ACCENT, '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Toggle */}
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => {
                setIsLogin((v) => !v);
                setEmail('');
                setPassword('');
                setName('');
              }}
            >
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account?  " : 'Already have an account?  '}
              </Text>
              <Text style={styles.toggleLink}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* ── Styles ──────────────────────────────────────── */

const styles = StyleSheet.create({
  bg: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 60 },

  /* Branding */
  brandWrap: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  brandName: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: TEXT2, textAlign: 'center', marginTop: 6, lineHeight: 20 },

  /* Card */
  card: {
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 20,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  cardSub: { fontSize: 13, color: TEXT2, marginBottom: 24 },

  /* Inputs */
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    marginBottom: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 15, paddingVertical: 0 },

  /* Button */
  btn: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  /* Toggle */
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  toggleText: { color: TEXT2, fontSize: 13 },
  toggleLink: { color: ACCENT, fontSize: 13, fontWeight: '600' },
});
