import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ShoppingBag, Coffee, Chrome as Home, Car, CreditCard, Plane, Gift, Film, Music } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const categories: Category[] = [
  {
    id: 'general',
    name: 'General',
    icon: <ShoppingBag size={24} color={Colors.white} />,
    color: Colors.primary,
  },
  {
    id: 'food',
    name: 'Food & Drinks',
    icon: <Coffee size={24} color={Colors.white} />,
    color: '#FF9800',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: <Home size={24} color={Colors.white} />,
    color: '#2196F3',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: <Car size={24} color={Colors.white} />,
    color: '#4CAF50',
  },
  {
    id: 'bills',
    name: 'Bills',
    icon: <CreditCard size={24} color={Colors.white} />,
    color: '#F44336',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: <Plane size={24} color={Colors.white} />,
    color: '#9C27B0',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: <Film size={24} color={Colors.white} />,
    color: '#E91E63',
  },
  {
    id: 'gifts',
    name: 'Gifts',
    icon: <Gift size={24} color={Colors.white} />,
    color: '#795548',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: <Music size={24} color={Colors.white} />,
    color: '#607D8B',
  },
];

interface CategoryPickerProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryPicker({ selectedCategory, onSelectCategory }: CategoryPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const selected = categories.find(cat => cat.id === selectedCategory) || categories[0];

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <View style={[styles.iconContainer, { backgroundColor: selected.color }]}>
          {selected.icon}
        </View>
        <Text style={styles.categoryName}>{selected.name}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>

            <FlatList
              data={categories}
              numColumns={3}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategory === item.id && styles.selectedCategory
                  ]}
                  onPress={() => {
                    onSelectCategory(item.id);
                    setModalVisible(false);
                  }}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                    {item.icon}
                  </View>
                  <Text style={styles.categoryItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    margin: 4,
  },
  selectedCategory: {
    backgroundColor: Colors.background,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
});