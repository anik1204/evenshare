import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Image } from 'react-native';
import { Users, ChevronRight, Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { GroupType } from '@/types/Group';

interface GroupSelectorProps {
  selectedGroup: GroupType | null;
  onSelectGroup: (group: GroupType) => void;
  groups: GroupType[];
}

export default function GroupSelector({ selectedGroup, onSelectGroup, groups }: GroupSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const createNewGroup = () => {
    // This would normally open a new group creation flow
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
        <View style={styles.iconContainer}>
          <Users size={20} color={Colors.textSecondary} />
          <Text style={styles.label}>
            {selectedGroup ? selectedGroup.name : 'Select a group'}
          </Text>
        </View>
        <ChevronRight size={18} color={Colors.textTertiary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Group</Text>

            <FlatList
              data={groups}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.groupItem, selectedGroup?.id === item.id && styles.selectedGroupItem]}
                  onPress={() => {
                    onSelectGroup(item);
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.groupImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.groupImage} />
                  </View>
                  <View style={styles.groupDetails}>
                    <Text style={styles.groupName}>{item.name}</Text>
                    <Text style={styles.memberCount}>{item.members.length} members</Text>
                  </View>
                  {selectedGroup?.id === item.id && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              )}
              ListHeaderComponent={() => (
                <TouchableOpacity style={styles.createGroupButton} onPress={createNewGroup}>
                  <View style={styles.createGroupIconContainer}>
                    <Plus size={20} color={Colors.white} />
                  </View>
                  <Text style={styles.createGroupText}>Create a new group</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedGroupItem: {
    backgroundColor: Colors.primaryLight + '20', // 20% opacity
  },
  groupImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  groupImage: {
    width: '100%',
    height: '100%',
  },
  groupDetails: {
    marginLeft: 12,
    flex: 1,
  },
  groupName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  memberCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  selectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    marginBottom: 12,
  },
  createGroupIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createGroupText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 12,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
});