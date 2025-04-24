import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Moon, Sun, Monitor } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      {options.map(({ value, icon: Icon, label }) => (
        <TouchableOpacity
          key={value}
          style={[
            styles.option,
            theme === value && styles.selectedOption
          ]}
          onPress={() => setTheme(value)}
        >
          <Icon 
            size={20} 
            color={theme === value ? Colors.primary : Colors.textSecondary} 
          />
          <Text style={[
            styles.optionText,
            theme === value && styles.selectedOptionText
          ]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 4,
    margin: 16,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  selectedOption: {
    backgroundColor: Colors.white,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectedOptionText: {
    color: Colors.primary,
  },
});