import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, Bell, Clock, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function ReminderSettingsScreen() {
  const router = useRouter();

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
          title: 'Reminder Settings',
          headerTitleStyle: styles.headerTitle,
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.iconContainer}>
              <Bell size={20} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.settingTitle}>Enable Reminders</Text>
              <Text style={styles.settingDescription}>
                Receive notifications for pending payments
              </Text>
            </View>
          </View>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: Colors.disabled, true: Colors.primaryLight }}
            thumbColor={Colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.info }]}>
              <Clock size={20} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.settingTitle}>Reminder Frequency</Text>
              <Text style={styles.settingDescription}>
                How often to send payment reminders
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.frequencyButton}>
            <Text style={styles.frequencyText}>Every 3 days</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.warning }]}>
              <Calendar size={20} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.settingTitle}>Quiet Hours</Text>
              <Text style={styles.settingDescription}>
                Don't send reminders during these hours
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.frequencyButton}>
            <Text style={styles.frequencyText}>10 PM - 8 AM</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Message Style</Text>
        
        <TouchableOpacity style={styles.messageStyleOption}>
          <Text style={styles.messageStyleTitle}>Friendly</Text>
          <Text style={styles.messageStyleExample}>
            "Yo! Time to pay your share 🍿"
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.messageStyleOption, styles.selectedStyle]}>
          <Text style={[styles.messageStyleTitle, styles.selectedText]}>Casual</Text>
          <Text style={[styles.messageStyleExample, styles.selectedText]}>
            "Hey! Don't forget about the payment 💫"
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageStyleOption}>
          <Text style={styles.messageStyleTitle}>Professional</Text>
          <Text style={styles.messageStyleExample}>
            "Your payment is due soon"
          </Text>
        </TouchableOpacity>
      </View>
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  frequencyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.background,
    borderRadius: 16,
  },
  frequencyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  messageStyleOption: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  selectedStyle: {
    backgroundColor: Colors.primary + '10',
  },
  messageStyleTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  messageStyleExample: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectedText: {
    color: Colors.primary,
  },
});