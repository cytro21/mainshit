import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TipCard, { Tip } from '../../components/TipCard';
import { useGlobalContext } from '../../context/global-provider';
import { supabase } from '../../lib/supabase';

const HomeScreen = () => {
  const { user, profile, isLogged } = useGlobalContext();
  const [tips, setTips] = useState<Tip[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTips = async () => {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select(`
                *,
                provider:profiles (
                    id,
                    display_name,
                    avatar_url,
                    specialization
                )
            `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tips:', error);
        return;
      }

      if (data) {
        // Map Supabase response to Tip type
        const mappedTips: Tip[] = data.map((item: any) => ({
          $id: item.id,
          sport: item.sport,
          league: item.league,
          event: item.event,
          odds: item.odds,
          stake: item.stake,
          type: item.type,
          status: item.status,
          result: item.result,
          timestamp: item.created_at,
          provider: {
            $id: item.provider?.id || item.provider_id,
            displayName: item.provider?.display_name || 'Unknown',
            avatar: item.provider?.avatar_url,
            specialization: item.provider?.specialization
          }
        }));
        setTips(mappedTips);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTips();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTips();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: '#161622', height: '100%' }}>
      <FlatList
        data={tips}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TipCard tip={item} />
        )}
        ListHeaderComponent={() => (
          <View style={{ marginVertical: 24, paddingHorizontal: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <View>
                <Text style={{ fontSize: 14, color: '#e5e5e5' }}>
                  Welcome back,
                </Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
                  {isLogged ? (profile?.display_name || user?.email) : 'Guest'}
                </Text>
              </View>
              <View style={{ marginTop: 6 }}>
                <Image
                  source={{ uri: profile?.avatar_url || 'https://ui-avatars.com/api/?name=Guest' }}
                  style={{ width: 36, height: 36, borderRadius: 18 }}
                  resizeMode='contain'
                />
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: '#CDCDE0', fontSize: 14, marginBottom: 8 }}>
                Latest Tips
              </Text>
              <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>
                Marketplace Feed
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: 'white' }}>No tips found</Text>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default HomeScreen;
