import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SquareDivide as DivideSquare, SquarePercent as PercentSquare, ArrowRightLeft, ChevronRight, Calculator } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

export type SplitMethod = 'equal' | 'percentage' | 'shares' | 'unequal';

interface SplitMethodSelectorProps {
  selectedMethod: SplitMethod;
  onSelectMethod: (method: SplitMethod) => void;
}

const methods = [
  {
    id: 'equal' as SplitMethod,
    name: 'Split Equally',
    description: 'Everyone pays the same amount',
    icon: (color: string) => <DivideSquare size={24} color={color} />,
    color: Colors.primary,
  },
  {
    id: 'percentage' as SplitMethod,
    name: 'By Percentages',
    description: 'Split based on percentages',
    icon: (color: string) => <PercentSquare size={24} color={color} />,
    color: Colors.complementary,
  },
  {
    id: 'unequal' as SplitMethod,
    name: 'Unequal Amounts',
    description: 'Enter specific amounts for each person',
    icon: (color: string) => <Calculator size={24} color={color} />,
    color: Colors.accent,
  },
  {
    id: 'shares' as SplitMethod,
    name: 'By Shares',
    description: 'Split based on share ratios',
    icon: (color: string) => <ArrowRightLeft size={24} color={color} />,
    color: Colors.info,
  },
];

export default function SplitMethodSelector({ selectedMethod, onSelectMethod }: SplitMethodSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedMethodData = methods.find(m => m.id === selectedMethod) || methods[0];

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <View style={[styles.iconContainer, { backgroundColor: selectedMethodData.color }]}>
          {selectedMethodData.icon(Colors.white)}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.methodName}>{selectedMethodData.name}</Text>
          <Text style={styles.methodDescription}>{selectedMethodData.description}</Text>
        </View>
        <ChevronRight size={20} color={Colors.textTertiary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View 
            style={styles.modalContent}
            entering={FadeIn}
          >
            <Text style={styles.modalTitle}>Split Method</Text>

            {methods.map(method => (
              <Animated.View
                key={method.id}
                layout={Layout.springify()}
              >
                <TouchableOpacity
                  style={[
                    styles.methodOption,
                    selectedMethod === method.id && styles.selectedOption
                  ]}
                  onPress={() => {
                    onSelectMethod(method.id);
                    setModalVisible(false);
                  }}
                >
                  <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                    {method.icon(Colors.white)}
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={[
                      styles.methodTitle,
                      selectedMethod === method.id && { color: method.color }
                    ]}>
                      {method.name}
                    </Text>
                    <Text style={styles.methodSubtitle}>
                      {method.description}
                    </Text>
                  </View>
                  {selectedMethod === method.id && (
                    <View style={[styles.selectedIndicator, { backgroundColor: method.color }]} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  methodName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  methodDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: Colors.background,
  },
  selectedOption: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  methodSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
  closeButton: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  closeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
});