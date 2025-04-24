import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface ReminderBadgeProps {
  count: number;
  onPress: () => void;
}

export default function ReminderBadge({ count, onPress }: ReminderBadgeProps) {
  if (count === 0) return null;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <Bell size={20} color={Colors.white} />
      <View style={styles.badge}>
        <Text style={styles.count}>{count}</Text>
      </View>
      <Text style={styles.text}>
        {count} pending {count === 1 ? 'reminder' : 'reminders'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badge: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  count: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: Colors.white,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
});