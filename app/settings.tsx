import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, Bell, DollarSign, Lock, Shield, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';

export default function SettingsScreen() {
  const router = useRouter();
  const [autoSplit, setAutoSplit] = useState(true);
  const [defaultReminders, setDefaultReminders] = useState(true);
  const [receiptScanning, setReceiptScanning] = useState(true);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: Colors.white },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          ),
          title: 'Settings',
          headerTitleStyle: styles.headerTitle,
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <ThemeToggle />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expense Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <DollarSign size={20} color={Colors.primary} />
              <View>
                <Text style={styles.settingTitle}>Default Split Method</Text>
                <Text style={styles.settingDescription}>
                  How expenses are split by default
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.settingValue}>Equal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Lock size={20} color={Colors.primary} />
              <View>
                <Text style={styles.settingTitle}>Auto Split</Text>
                <Text style={styles.settingDescription}>
                  Automatically split expenses equally
                </Text>
              </View>
            </View>
            <Switch
              value={autoSplit}
              onValueChange={setAutoSplit}
              trackColor={{ false: Colors.disabled, true: Colors.primaryLight }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Bell size={20} color={Colors.info} />
              <View>
                <Text style={styles.settingTitle}>Default Reminders</Text>
                <Text style={styles.settingDescription}>
                  Send automatic payment reminders
                </Text>
              </View>
            </View>
            <Switch
              value={defaultReminders}
              onValueChange={setDefaultReminders}
              trackColor={{ false: Colors.disabled, true: Colors.primaryLight }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Shield size={20} color={Colors.complementary} />
              <View>
                <Text style={styles.settingTitle}>Receipt Scanning</Text>
                <Text style={styles.settingDescription}>
                  Automatically scan and parse receipts
                </Text>
              </View>
            </View>
            <Switch
              value={receiptScanning}
              onValueChange={setReceiptScanning}
              trackColor={{ false: Colors.disabled, true: Colors.primaryLight }}
              thumbColor={Colors.white}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
  },
  settingValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
  },
});