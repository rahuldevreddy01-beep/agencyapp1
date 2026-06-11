import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FadeInUp, FadeIn, ScaleIn } from '../components/Animations';

/* ── Theme ──────────────────────────────────────── */
const PRIMARY    = '#004CD2';
const BG         = '#F7F9FB';
const SURFACE    = '#FFFFFF';
const ON_SURFACE = '#191C1E';
const TEXT2      = '#424656';
const OUTLINE    = '#C3C5D8';
const SURF_LOW   = '#F2F4F6';
const SEC_CONT   = '#DAE2FD';
const TER_FIXED  = '#D3E4FE';
const ERR_CONT   = '#FFDAD6';
const ERR_COLOR  = '#BA1A1A';

const MENU_ITEMS = [
  { id: '1', icon: 'calendar-outline',       title: 'My Bookings',     sub: 'Manage consultations',        accent: PRIMARY,  accentBg: PRIMARY + '18' },
  { id: '2', icon: 'stats-chart-outline',    title: 'Course Progress', sub: '78% Completed',               accent: '#4A5A6F', accentBg: TER_FIXED },
  { id: '3', icon: 'settings-outline',        title: 'Settings',        sub: 'Security & Privacy',          accent: TEXT2,    accentBg: '#E6E8EA' },
  { id: '4', icon: 'help-circle-outline',     title: 'Support',         sub: '24/7 Priority Concierge',     accent: ERR_COLOR, accentBg: ERR_CONT },
];

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <FadeIn delay={0} duration={300}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.brand}>Visionary</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={22} color={PRIMARY} />
          </TouchableOpacity>
        </View>
      </FadeIn>
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

      {/* ── Profile Hero ── */}
      <View style={styles.heroSection}>
        <ScaleIn delay={50}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={44} color={PRIMARY} />
            </View>
            <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
              <Ionicons name="create" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        </ScaleIn>
        <FadeInUp delay={110}>
          <Text style={styles.userName}>Julian Rivera</Text>
        </FadeInUp>
        <FadeInUp delay={160}>
          <Text style={styles.userRole}>Senior Product Designer • Visionary Member</Text>
        </FadeInUp>
        <FadeInUp delay={210}>
          <View style={styles.badgesRow}>
            <ScaleIn delay={230}>
              <View style={[styles.badge, { backgroundColor: PRIMARY }]}>
                <Text style={[styles.badgeText, { color: '#fff' }]}>Active Learner</Text>
              </View>
            </ScaleIn>
            <ScaleIn delay={260}>
              <View style={[styles.badge, { backgroundColor: SEC_CONT }]}>
                <Text style={[styles.badgeText, { color: '#5C647A' }]}>Tech Lead</Text>
              </View>
            </ScaleIn>
          </View>
        </FadeInUp>
      </View>

      {/* ── Menu Grid ── */}
      <View style={styles.menuGrid}>
        {MENU_ITEMS.map((item, i) => (
          <FadeInUp key={item.id} delay={300 + i * 50}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconWrap, { backgroundColor: item.accentBg }]}>
                <Ionicons name={item.icon as any} size={20} color={item.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={OUTLINE} />
            </TouchableOpacity>
          </FadeInUp>
        ))}
      </View>

      {/* ── Logout ── */}
      <FadeInUp delay={510}>
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?')}
        >
          <Ionicons name="log-out-outline" size={18} color={ERR_COLOR} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </FadeInUp>

      <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
}

/* ── Styles ──────────────────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  content: { paddingBottom: 20 },

  /* Header */
  header: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: 44, height: 44,
    borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  brand: { fontSize: 20, fontWeight: '800', color: PRIMARY, letterSpacing: -0.5 },

  /* Hero */
  heroSection: { alignItems: 'center', paddingTop: 70, paddingBottom: 24 },
  avatarWrap: { position: 'relative', width: 96, height: 96 },
  avatarGlow: {
    position: 'absolute', inset: -8, borderRadius: 56,
    backgroundColor: PRIMARY + '15',
  },
  avatarCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: SURFACE, borderWidth: 2, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  editBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  userName: { fontSize: 24, fontWeight: '700', color: ON_SURFACE, marginTop: 16 },
  userRole: { fontSize: 13, color: TEXT2, marginTop: 4 },
  badgesRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },

  /* Menu */
  menuGrid: { paddingHorizontal: 20, gap: 8 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, backgroundColor: SURFACE, borderRadius: 14,
    shadowColor: '#0F172A', shadowOpacity: 0.03, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  menuIconWrap: {
    width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  menuTitle: { fontSize: 15, fontWeight: '700', color: ON_SURFACE },
  menuSub: { fontSize: 11, color: TEXT2, marginTop: 2 },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 16, paddingVertical: 16,
    borderRadius: 14, backgroundColor: SURF_LOW + '80',
    borderWidth: 1, borderColor: OUTLINE + '50',
  },
  logoutText: { fontSize: 15, color: ERR_COLOR, fontWeight: '700' },
});
