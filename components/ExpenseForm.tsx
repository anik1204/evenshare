import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Calculator, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { ExpenseType } from '@/types/Expense';
import { GroupType } from '@/types/Group';

interface ExpenseFormProps {
  onSubmit: (expense: Partial<ExpenseType>) => void;
  selectedGroup?: GroupType;
}

export default function ExpenseForm({ onSubmit, selectedGroup }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount || isNaN(parseFloat(amount))) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      amount: parseFloat(amount),
      description,
      category,
      date,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
          placeholderTextColor={Colors.textTertiary}
        />
        {errors.amount && (
          <Text style={styles.errorText}>{errors.amount}</Text>
        )}
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="What's this for?"
            placeholderTextColor={Colors.textTertiary}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.optionButton}>
          <Calculator size={20} color={Colors.textSecondary} />
          <Text style={styles.optionText}>Split equally</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Calendar size={20} color={Colors.textSecondary} />
          <Text style={styles.optionText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!amount || !description) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!amount || !description}
      >
        <Text style={styles.submitButtonText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  amountContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  formContainer: {
    backgroundColor: Colors.white,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: 16,
  },
  descriptionInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
});