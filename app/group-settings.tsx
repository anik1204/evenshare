import { View, Text, StyleSheet, Switch, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, DollarSign, Bell, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function GroupSettingsScreen() {
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
          title: 'Group Settings',
          headerTitleStyle: styles.headerTitle,
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Settings</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter group name"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add a description"
            placeholderTextColor={Colors.textTertiary}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.iconContainer}>
              <DollarSign size={20} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.settingTitle}>Default Split Method</Text>
              <Text style={styles.settingDescription}>
                How expenses are split by default
              </Text>
            </View>
          </View>
          <Text style={styles.valueText}>Equal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reminders</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.info }]}>
              <Bell size={20} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.settingTitle}>Auto Reminders</Text>
              <Text style={styles.settingDescription}>
                Send automatic payment reminders
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

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.warning }]}>
              <Bell size={20} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.settingTitle}>Reminder Frequency</Text>
              <Text style={styles.settingDescription}>
                How often to send reminders
              </Text>
            </View>
          </View>
          <Text style={styles.valueText}>Weekly</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.deleteButton}>
        <Trash2 size={20} color={Colors.error} />
        <Text style={styles.deleteButtonText}>Delete Group</Text>
      </TouchableOpacity>
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
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  valueText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginTop: 24,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  deleteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.error,
    marginLeft: 8,
  },
});