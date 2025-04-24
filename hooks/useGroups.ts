import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';

type Group = Database['public']['Tables']['groups']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type GroupMember = {
  group_id: string;
  profile_id: string;
  role: string;
  joined_at: string;
  profiles: Profile;
};

type GroupWithMembers = Group & {
  members: GroupMember[];
};

export function useGroups() {
  const { user, isLoading: authLoading } = useAuth();
  const [groups, setGroups] = useState<GroupWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    loadGroups();

    const groupsSubscription = supabase
      .channel('groups_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'groups',
      }, () => {
        loadGroups();
      })
      .subscribe();

    return () => {
      groupsSubscription.unsubscribe();
    };
  }, [user, authLoading]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading groups for user:', user?.id);

      // First, get the groups with their members
      const { data: userGroups, error: groupsError } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          description,
          image_url,
          currency,
          created_at,
          created_by,
          updated_at,
          group_members!inner (
            profile_id,
            role,
            joined_at
          )
        `)
        .eq('group_members.profile_id', user?.id);

      if (groupsError) {
        console.error('Error loading groups:', {
          error: groupsError,
          message: groupsError.message,
          details: groupsError.details,
          hint: groupsError.hint,
          code: groupsError.code
        });
        setError(groupsError.message);
        setGroups([]);
        setLoading(false);
        return;
      }

      console.log('Groups loaded:', userGroups);

      // If no groups are found, it's not an error - just set empty array
      if (!userGroups || userGroups.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }

      // Get all unique user IDs from group members
      const memberUserIds = new Set<string>();
      userGroups.forEach(group => {
        if (group.group_members) {
          group.group_members.forEach((member: any) => {
            memberUserIds.add(member.profile_id);
          });
        }
      });

      console.log('Member user IDs:', Array.from(memberUserIds));

      // Fetch all profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, created_at, updated_at')
        .in('id', Array.from(memberUserIds));

      if (profilesError) {
        console.error('Error loading profiles:', {
          error: profilesError,
          message: profilesError.message,
          details: profilesError.details,
          hint: profilesError.hint,
          code: profilesError.code
        });
        setError(profilesError.message);
        setGroups([]);
        setLoading(false);
        return;
      }

      console.log('Profiles loaded:', profiles);

      // Create a map of user_id to profile for quick lookup
      const profilesMap = new Map(profiles?.map(profile => [profile.id, profile]));

      // Merge the data
      const transformedGroups = userGroups.map(group => {
        const members = group.group_members.map((member: any) => ({
          group_id: group.id,
          profile_id: member.profile_id,
          role: member.role || 'member',
          joined_at: member.joined_at || group.created_at,
          profiles: profilesMap.get(member.profile_id) || {
            id: member.profile_id,
            full_name: 'Unknown User',
            avatar_url: null,
            created_at: group.created_at,
            updated_at: group.updated_at
          }
        }));

        const groupWithMembers: GroupWithMembers = {
          ...group,
          members
        };

        delete (groupWithMembers as any).group_members;
        return groupWithMembers;
      });

      console.log('Transformed groups:', transformedGroups);

      setGroups(transformedGroups);
      setLoading(false);
    } catch (err) {
      console.error('Detailed error loading groups:', {
        error: err,
        errorObject: JSON.stringify(err, Object.getOwnPropertyNames(err)),
        user: user?.id,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(err instanceof Error ? err.message : 'An error occurred');
      setGroups([]);
      setLoading(false);
    }
  };

  const createGroup = async (
    name: string,
    description?: string,
    imageUrl?: string,
    currency: string = 'USD'
  ) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Create the group
      const { data: newGroup, error: groupError } = await supabase
        .from('groups')
        .insert({
          name,
          description,
          image_url: imageUrl,
          currency,
          created_by: user.id
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Wait for the trigger to create the group member
      await new Promise(resolve => setTimeout(resolve, 500));

      // Reload groups to get the updated list
      await loadGroups();

      return newGroup;
    } catch (err) {
      console.error('Error creating group:', err);
      throw err;
    }
  };

  const updateGroup = async (
    groupId: string,
    updates: Partial<Database['public']['Tables']['groups']['Update']>
  ) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .update(updates)
        .eq('id', groupId)
        .select()
        .single();

      if (error) throw error;

      // Reload groups to get the updated list
      await loadGroups();
      return data;
    } catch (err) {
      console.error('Error updating group:', err);
      throw err;
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      // Update local state
      setGroups(current => current.filter(group => group.id !== groupId));
    } catch (err) {
      console.error('Error deleting group:', err);
      throw err;
    }
  };

  const addMember = async (groupId: string, profileId: string, role: string = 'member') => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          profile_id: profileId,
          role
        })
        .select(`
          *,
          profiles!group_members_profile_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Reload groups to get the updated member list
      await loadGroups();
      return data;
    } catch (err) {
      console.error('Error adding member:', err);
      throw err;
    }
  };

  const removeMember = async (groupId: string, profileId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('profile_id', profileId);

      if (error) throw error;

      // Reload groups to get the updated member list
      await loadGroups();
    } catch (err) {
      console.error('Error removing member:', err);
      throw err;
    }
  };

  const updateMemberRole = async (groupId: string, profileId: string, role: string) => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .update({ role })
        .eq('group_id', groupId)
        .eq('profile_id', profileId)
        .select()
        .single();

      if (error) throw error;

      // Reload groups to get the updated member list
      await loadGroups();
      return data;
    } catch (err) {
      console.error('Error updating member role:', err);
      throw err;
    }
  };

  return {
    groups,
    loading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    addMember,
    removeMember,
    updateMemberRole,
    refresh: loadGroups,
  };
}