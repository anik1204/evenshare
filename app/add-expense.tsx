import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, Camera } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import { mockGroups, currentUser } from '@/data/mockData';
import CategoryPicker from '@/components/CategoryPicker';
import GroupSelector from '@/components/GroupSelector';
import ExpenseSplitCard from '@/components/ExpenseSplitCard';
import SplitMethodSelector, { SplitMethod } from '@/components/SplitMethodSelector';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function AddExpenseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(mockGroups[0]);
  const [category, setCategory] = useState('general');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal');
  const [splits, setSplits] = useState<Record<string, number>>({});
  const [receipt, setReceipt] = useState<string | null>(null);

  const calculateSplits = () => {
    const numMembers = selectedGroup.members.length;
    const amountNum = parseFloat(amount) || 0;

    switch (splitMethod) {
      case 'equal':
        const equalShare = amountNum / numMembers;
        return Object.fromEntries(
          selectedGroup.members.map(member => [member.id, equalShare])
        );
      case 'percentage':
      case 'shares':
      case 'unequal':
        return splits;
      default:
        return {};
    }
  };

  const handleSplitUpdate = (userId: string, value: number) => {
    setSplits(prev => ({ ...prev, [userId]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setReceipt(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!amount || !description || !selectedGroup) return;

    const newExpense = {
      amount: parseFloat(amount),
      description,
      category,
      date: date.toISOString(),
      group_id: selectedGroup.id,
      paid_by: currentUser.id,
      split_method: splitMethod,
      receipt_url: receipt,
      shares: Object.entries(calculateSplits()).map(([profile_id, amount]) => ({
        profile_id,
        amount,
        paid: false
      }))
    };

    console.log('New expense:', newExpense);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView}>
          <Animated.View 
            entering={FadeIn}
            style={styles.amountContainer}
          >
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={Colors.textTertiary}
              autoFocus
            />
          </Animated.View>

          <View style={styles.form}>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="What's this for?"
              placeholderTextColor={Colors.textTertiary}
            />

            <GroupSelector
              selectedGroup={selectedGroup}
              onSelectGroup={setSelectedGroup}
              groups={mockGroups}
            />

            <CategoryPicker
              selectedCategory={category}
              onSelectCategory={setCategory}
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}

            <TouchableOpacity 
              style={styles.receiptButton}
              onPress={pickImage}
            >
              <Camera size={24} color={Colors.textSecondary} />
              <Text style={styles.receiptButtonText}>
                {receipt ? 'Change Receipt' : 'Add Receipt'}
              </Text>
            </TouchableOpacity>

            {receipt && (
              <Image 
                source={{ uri: receipt }}
                style={styles.receiptImage}
              />
            )}

            <SplitMethodSelector
              selectedMethod={splitMethod}
              onSelectMethod={setSplitMethod}
            />

            <ExpenseSplitCard
              members={selectedGroup.members}
              amounts={calculateSplits()}
              onUpdateSplit={handleSplitUpdate}
              splitMethod={splitMethod}
              totalAmount={parseFloat(amount) || 0}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!amount || !description) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!amount || !description}
          >
            <Text style={styles.saveButtonText}>Save Expense</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 44,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: Colors.textPrimary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  amountContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.white,
  },
  currencySymbol: {
    fontFamily: 'Inter-Medium',
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  amountInput: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 48,
    color: Colors.textPrimary,
    textAlign: 'center',
    minWidth: 200,
  },
  form: {
    backgroundColor: Colors.white,
    marginTop: 16,
    padding: 16,
  },
  descriptionInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 16,
  },
  dateButton: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  receiptButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
});