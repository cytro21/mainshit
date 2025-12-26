import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useGlobalContext } from '../../context/global-provider';
import { supabase } from '../../lib/supabase';

const ProfileScreen = () => {
    const { user, profile, capabilities, logout } = useGlobalContext();
    const [applicationStatus, setApplicationStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | null>(null);

    useEffect(() => {
        if (user) {
            checkApplicationStatus();
        }
    }, [user]);

    const checkApplicationStatus = async () => {
        const { data } = await supabase
            .from('provider_applications')
            .select('status')
            .eq('user_id', user?.id)
            .maybeSingle(); // Use maybeSingle to avoid error if no row

        if (data) {
            setApplicationStatus(data.status as any);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.tipster.background }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Header Profile Info */}
                <View style={{ alignItems: 'center', marginBottom: 30, marginTop: 20 }}>
                    <View style={{
                        width: 100, height: 100, borderRadius: 50, overflow: 'hidden',
                        borderWidth: 2, borderColor: Colors.tipster.primary, marginBottom: 15
                    }}>
                        <Image
                            source={{ uri: profile?.avatar_url || 'https://ui-avatars.com/api/?name=User' }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>
                    <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                        {profile?.display_name || user?.email}
                    </Text>
                    <Text style={{ color: Colors.tipster.textMuted }}>
                        {user?.email}
                    </Text>
                    {capabilities?.can_publish && (
                        <View style={{
                            marginTop: 10, paddingHorizontal: 12, paddingVertical: 4,
                            backgroundColor: 'rgba(0, 255, 135, 0.2)', borderRadius: 12,
                            borderWidth: 1, borderColor: Colors.tipster.primary
                        }}>
                            <Text style={{ color: Colors.tipster.primary, fontWeight: 'bold', fontSize: 12 }}>VERIFIED TIPSTER</Text>
                        </View>
                    )}
                </View>

                {/* Stats / Info Grid (Placeholder) */}
                <View style={{ flexDirection: 'row', gap: 15, marginBottom: 30 }}>
                    <View style={{ flex: 1, backgroundColor: Colors.tipster.surface, padding: 15, borderRadius: 12, alignItems: 'center' }}>
                        <Text style={{ color: Colors.tipster.primary, fontSize: 20, fontWeight: 'bold' }}>0</Text>
                        <Text style={{ color: Colors.tipster.textMuted, fontSize: 12 }}>Purchases</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: Colors.tipster.surface, padding: 15, borderRadius: 12, alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>$0.00</Text>
                        <Text style={{ color: Colors.tipster.textMuted, fontSize: 12 }}>Wallet</Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={{ gap: 15 }}>
                    {/* Deposit */}
                    <TouchableOpacity
                        onPress={() => router.push('/wallet/deposit')}
                        style={{
                            backgroundColor: Colors.tipster.surface, padding: 16, borderRadius: 12,
                            flexDirection: 'row', alignItems: 'center'
                        }}
                    >
                        <Ionicons name="wallet-outline" size={24} color={Colors.tipster.primary} />
                        <Text style={{ color: 'white', fontSize: 16, marginLeft: 15, fontWeight: '500' }}>Deposit Funds</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.tipster.textMuted} style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>

                    {/* Provider Application Logic */}
                    {!capabilities?.can_publish && (
                        <>
                            {applicationStatus === 'PENDING' ? (
                                <View style={{
                                    backgroundColor: 'rgba(255, 156, 1, 0.15)', padding: 16, borderRadius: 12,
                                    flexDirection: 'row', alignItems: 'center', borderColor: '#FF9C01', borderWidth: 1
                                }}>
                                    <Ionicons name="time-outline" size={24} color="#FF9C01" />
                                    <View style={{ marginLeft: 15 }}>
                                        <Text style={{ color: '#FF9C01', fontSize: 16, fontWeight: 'bold' }}>Application Pending</Text>
                                        <Text style={{ color: '#FF9C01', fontSize: 12 }}>Awaiting verification...</Text>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => router.push('/profile/apply')}
                                    style={{
                                        backgroundColor: Colors.tipster.surface, padding: 16, borderRadius: 12,
                                        flexDirection: 'row', alignItems: 'center', borderColor: Colors.tipster.border, borderWidth: 1
                                    }}
                                >
                                    <Ionicons name="trophy-outline" size={24} color="#FFD700" />
                                    <Text style={{ color: 'white', fontSize: 16, marginLeft: 15, fontWeight: '500' }}>Become a Tipster</Text>
                                    <Ionicons name="chevron-forward" size={20} color={Colors.tipster.textMuted} style={{ marginLeft: 'auto' }} />
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    {/* Logout */}
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={{
                            backgroundColor: 'rgba(255, 59, 48, 0.1)', padding: 16, borderRadius: 12,
                            flexDirection: 'row', alignItems: 'center', marginTop: 20
                        }}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                        <Text style={{ color: '#FF3B30', fontSize: 16, marginLeft: 15, fontWeight: '500' }}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
