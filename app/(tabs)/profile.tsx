import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, Bell, Moon, Settings, Shield, LogOut, ChevronRight, CircleHelp as HelpCircle, PiggyBank } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Alert } from 'react-native';
import * as React from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, signOut, isLoading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      // Router navigation not needed as AuthContext will handle redirect
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/(auth)/settings' as any)}
        >
          <Settings size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: profile?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{profile?.full_name || 'No name set'}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => router.push('/(auth)/edit-profile' as any)}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Money Management</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(auth)/payment-methods' as any)}>
          <View style={styles.menuIconContainer}>
            <CreditCard size={20} color={Colors.white} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Payment Methods</Text>
          </View>
          <ChevronRight size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(auth)/savings' as any)}>
          <View style={[styles.menuIconContainer, { backgroundColor: Colors.complementary }]}>
            <PiggyBank size={20} color={Colors.white} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Savings Jar</Text>
            <Text style={styles.menuItemDescription}>Track your savings goals</Text>
          </View>
          <ChevronRight size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.menuItem}>
          <View style={[styles.menuIconContainer, { backgroundColor: Colors.info }]}>
            <Bell size={20} color={Colors.white} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Notifications</Text>
          </View>
          <Switch 
            trackColor={{ false: Colors.disabled, true: Colors.primaryLight }}
            thumbColor={Platform.OS === 'ios' ? undefined : Colors.white}
            ios_backgroundColor={Colors.disabled}
            value={true}
            onValueChange={() => {}}
          />
        </View>
        
        <View style={styles.menuItem}>
          <View style={[styles.menuIconContainer, { backgroundColor: Colors.complementary }]}>
            <Moon size={20} color={Colors.white} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Dark Mode</Text>
          </View>
          <Switch 
            trackColor={{ false: Colors.disabled, true: Colors.primaryLight }}
            thumbColor={Platform.OS === 'ios' ? undefined : Colors.white}
            ios_backgroundColor={Colors.disabled}
            value={false}
            onValueChange={() => {}}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(auth)/help-center' as any)}>
          <View style={[styles.menuIconContainer, { backgroundColor: Colors.info }]}>
            <HelpCircle size={20} color={Colors.white} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Help Center</Text>
          </View>
          <ChevronRight size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(auth)/privacy' as any)}>
          <View style={[styles.menuIconContainer, { backgroundColor: Colors.warning }]}>
            <Shield size={20} color={Colors.white} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Privacy & Security</Text>
          </View>
          <ChevronRight size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.signOutButton} 
        onPress={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <ActivityIndicator size="small" color={Colors.error} />
        ) : (
          <>
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </>
        )}
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  profileSection: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  editProfileText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  menuItemDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginTop: 32,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  signOutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.error,
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});