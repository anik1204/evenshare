import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, Camera, Plus, DollarSign, Users, Mail, Search, Phone } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useGroups } from '@/hooks/useGroups';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

type InviteMethod = 'email' | 'phone' | 'search';

interface PendingInvite {
  type: InviteMethod;
  value: string;
  status: 'pending' | 'sent';
}

export default function CreateGroupScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { createGroup, addMember } = useGroups();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState(currencies[0]);
  const [image, setImage] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [inviteMethod, setInviteMethod] = useState<InviteMethod>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    // Add current user to selected members by default
    if (user) {
      setSelectedMembers([{
        id: user.id,
        email: user.email,
        avatar_url: user.user_metadata?.avatar_url,
        name: user.user_metadata?.full_name || user.email
      }]);
    }
  }, [user]);

  // Search users function
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .neq('id', user?.id)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search users');
    }
  };

  // Update search when query changes
  useEffect(() => {
    if (inviteMethod === 'search') {
      const delayDebounceFn = setTimeout(() => {
        searchUsers(searchQuery);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, inviteMethod]);

  const toggleMember = (member: any) => {
    if (member.id === user?.id) return; // Can't remove yourself
    
    const isSelected = selectedMembers.some(m => m.id === member.id);
    
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleInvite = () => {
    if (!searchQuery.trim()) return;

    // Validate email format if using email method
    if (inviteMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(searchQuery)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    // Validate phone format if using phone method
    if (inviteMethod === 'phone') {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(searchQuery)) {
        setError('Please enter a valid phone number');
        return;
      }
    }

    // Add to pending invites
    setPendingInvites([
      ...pendingInvites,
      {
        type: inviteMethod,
        value: searchQuery,
        status: 'pending'
      }
    ]);

    // Clear search
    setSearchQuery('');
    setSearchResults([]);
  };

  const removePendingInvite = (invite: PendingInvite) => {
    setPendingInvites(pendingInvites.filter(i => i.value !== invite.value));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Failed to pick image');
    }
  };

  const uploadImage = async (base64Image: string): Promise<string> => {
    try {
      const fileName = `group-${Date.now()}.jpg`;
      const filePath = `group-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('group-images')
        .upload(filePath, decode(base64Image), {
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('group-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Failed to upload image');
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter a group name');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a group');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let imageUrl = null;
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const base64data = reader.result?.toString().split(',')[1];
            if (base64data) resolve(base64data);
          };
        });
        reader.readAsDataURL(blob);
        const base64 = await base64Promise;
        imageUrl = await uploadImage(base64);
      }

      // Create group with selected members
      const newGroup = await createGroup(
        name.trim(),
        description.trim(),
        imageUrl || undefined,
        currency.code
      );

      // Add members to the group
      if (newGroup) {
        for (const member of selectedMembers) {
          if (member.id !== user.id) { // Skip current user as they're added automatically
            await addMember(newGroup.id, member.id);
          }
        }

        // Handle pending invites here if needed
        // You'll need to implement the invite system separately
      }

      router.back();
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Stack.Screen options={{ 
        title: 'Create Group',
        headerShown: true,
        headerStyle: { backgroundColor: Colors.white },
        headerTitleStyle: { fontFamily: 'Inter-SemiBold', fontSize: 17 },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        ),
      }} />

      <ScrollView style={styles.scrollView}>
        <Animated.View 
          entering={FadeIn}
          style={styles.content}
        >
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.groupImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Camera size={32} color={Colors.textSecondary} />
                <Text style={styles.imagePlaceholderText}>Add Group Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Group Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter group name"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="What's this group for?"
                placeholderTextColor={Colors.textTertiary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Currency</Text>
              <TouchableOpacity 
                style={styles.currencySelector}
                onPress={() => setShowCurrencyPicker(true)}
              >
                <DollarSign size={18} color={Colors.textPrimary} />
                <Text style={styles.currencyText}>
                  {currency.name} ({currency.code})
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.membersContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>Group Members</Text>
                <TouchableOpacity 
                  style={styles.inviteButton}
                  onPress={() => setShowInviteModal(true)}
                >
                  <Plus size={16} color={Colors.white} />
                  <Text style={styles.inviteButtonText}>Invite</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inviteMethodsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.inviteMethodButton,
                    inviteMethod === 'search' && styles.activeInviteMethod
                  ]}
                  onPress={() => setInviteMethod('search')}
                >
                  <Search size={20} color={inviteMethod === 'search' ? Colors.primary : Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.inviteMethodButton,
                    inviteMethod === 'email' && styles.activeInviteMethod
                  ]}
                  onPress={() => setInviteMethod('email')}
                >
                  <Mail size={20} color={inviteMethod === 'email' ? Colors.primary : Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.inviteMethodButton,
                    inviteMethod === 'phone' && styles.activeInviteMethod
                  ]}
                  onPress={() => setInviteMethod('phone')}
                >
                  <Phone size={20} color={inviteMethod === 'phone' ? Colors.primary : Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={
                    inviteMethod === 'search' ? "Search by name or email" :
                    inviteMethod === 'email' ? "Enter email address" :
                    "Enter phone number"
                  }
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType={inviteMethod === 'phone' ? 'phone-pad' : 'default'}
                />
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={handleInvite}
                >
                  <Plus size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>

              {pendingInvites.length > 0 && (
                <View style={styles.pendingInvites}>
                  <Text style={styles.pendingInvitesTitle}>Pending Invites</Text>
                  {pendingInvites.map((invite, index) => (
                    <View key={index} style={styles.pendingInvite}>
                      <View style={styles.pendingInviteContent}>
                        {invite.type === 'email' && <Mail size={16} color={Colors.textSecondary} />}
                        {invite.type === 'phone' && <Phone size={16} color={Colors.textSecondary} />}
                        <Text style={styles.pendingInviteText}>{invite.value}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.removeInviteButton}
                        onPress={() => removePendingInvite(invite)}
                      >
                        <X size={16} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.membersList}>
                {inviteMethod === 'search' && searchQuery ? (
                  // Show search results
                  searchResults.map(user => (
                    <TouchableOpacity 
                      key={user.id}
                      style={[
                        styles.memberItem,
                        selectedMembers.some(member => member.id === user.id) && styles.selectedMemberItem
                      ]}
                      onPress={() => toggleMember(user)}
                    >
                      <Image 
                        source={{ uri: user.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} 
                        style={styles.memberAvatar} 
                      />
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>
                          {user.full_name || user.email}
                        </Text>
                        <Text style={styles.memberEmail}>{user.email}</Text>
                      </View>
                      {selectedMembers.some(member => member.id === user.id) && (
                        <View style={styles.checkmark} />
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  // Show selected members
                  selectedMembers.map(member => (
                    <TouchableOpacity 
                      key={member.id}
                      style={[styles.memberItem]}
                      disabled={member.id === user?.id}
                    >
                      <Image 
                        source={{ uri: member.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} 
                        style={styles.memberAvatar} 
                      />
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>
                          {member.name || member.email}
                          {member.id === user?.id && ' (You)'}
                        </Text>
                        <Text style={styles.memberEmail}>{member.email}</Text>
                      </View>
                      {member.id !== user?.id && (
                        <TouchableOpacity 
                          style={styles.removeInviteButton}
                          onPress={() => toggleMember(member)}
                        >
                          <X size={16} color={Colors.error} />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.createButton,
            (!name.trim() || loading) && styles.createButtonDisabled
          ]}
          disabled={!name.trim() || loading}
          onPress={handleCreate}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.createButtonText}>Create Group</Text>
          )}
        </TouchableOpacity>
      </View>

      {showCurrencyPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.currencyPicker}>
            <Text style={styles.currencyPickerTitle}>Select Currency</Text>
            {currencies.map(curr => (
              <TouchableOpacity
                key={curr.code}
                style={[
                  styles.currencyOption,
                  currency.code === curr.code && styles.selectedCurrencyOption
                ]}
                onPress={() => {
                  setCurrency(curr);
                  setShowCurrencyPicker(false);
                }}
              >
                <Text style={[
                  styles.currencyOptionText,
                  currency.code === curr.code && styles.selectedCurrencyOptionText
                ]}>
                  {curr.symbol} {curr.name} ({curr.code})
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCurrencyPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  groupImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  currencyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  membersContainer: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  inviteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  inviteMethodsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  inviteMethodButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  activeInviteMethod: {
    backgroundColor: Colors.primary + '15',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingInvites: {
    marginBottom: 16,
  },
  pendingInvitesTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  pendingInvite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  pendingInviteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingInviteText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  removeInviteButton: {
    padding: 4,
  },
  membersList: {
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedMemberItem: {
    backgroundColor: Colors.primary + '10',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  memberEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  createButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  currencyPicker: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  currencyPickerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  currencyOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCurrencyOption: {
    backgroundColor: Colors.primary + '10',
  },
  currencyOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  selectedCurrencyOptionText: {
    color: Colors.primary,
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
});