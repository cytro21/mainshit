import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useGlobalContext } from '../../context/global-provider';
import { supabase } from '../../lib/supabase';

const DepositScreen = () => {
    const { user } = useGlobalContext();
    const [amount, setAmount] = useState('50');
    const [balance, setBalance] = useState(0);
    const [isSubmitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBalance();
    }, [user]);

    const fetchBalance = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', user.id)
            .single();

        if (data) setBalance(data.balance);
    };

    const handleDeposit = async () => {
        if (!user) return;
        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount < 10) {
            Alert.alert("Invalid Amount", "Minimum deposit is $10.00");
            return;
        }

        setSubmitting(true);

        try {
            // Secure RPC call to handle deposit server-side
            const { error } = await supabase.rpc('deposit_funds', {
                amount: depositAmount
            });

            if (error) throw error;

            Alert.alert("Success", `$${depositAmount} added to your wallet!`);
            // Optimistic update or refetch
            setBalance(prev => prev + depositAmount);
            setTimeout(() => {
                fetchBalance(); // Verify with server
                router.back();
            }, 100);

        } catch (error: any) {
            Alert.alert("Error", "Deposit failed. Please try again.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const predefinedAmounts = ['20', '50', '100', '200'];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.tipster.background }}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={{ padding: 20 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Deposit</Text>
                    <View>
                        <Text style={{ color: Colors.tipster.textMuted, fontSize: 12, textAlign: 'right' }}>Balance</Text>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>${balance.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Main Content */}
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                    <Text style={{ color: 'white', fontSize: 24, fontWeight: '800', marginBottom: 10 }}>How much to deposit?</Text>
                    <Text style={{ color: Colors.tipster.textMuted, fontSize: 16 }}>Enter amount or select below</Text>

                    <View style={{ flexDirection: 'row', marginTop: 40, alignItems: 'center' }}>
                        <Text style={{ color: Colors.tipster.primary, fontSize: 40, fontWeight: 'bold', marginRight: 5 }}>$</Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            style={{
                                color: 'white',
                                fontSize: 60,
                                fontWeight: 'bold',
                                borderBottomWidth: 2,
                                borderBottomColor: Colors.tipster.primary,
                                minWidth: 100,
                                textAlign: 'center'
                            }}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Grid Selection */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
                    {predefinedAmounts.map((amt) => (
                        <TouchableOpacity
                            key={amt}
                            onPress={() => setAmount(amt)}
                            style={{
                                width: '47%',
                                backgroundColor: amount === amt ? '#00331F' : Colors.tipster.surface,
                                borderColor: amount === amt ? Colors.tipster.primary : Colors.tipster.border,
                                borderWidth: 1,
                                padding: 20,
                                borderRadius: 16,
                                alignItems: 'center',
                                position: 'relative'
                            }}
                        >
                            {amount === amt && (
                                <View style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.tipster.primary }} />
                            )}
                            <Text style={{
                                color: amount === amt ? Colors.tipster.primary : 'white',
                                fontSize: 20,
                                fontWeight: 'bold'
                            }}>
                                ${amt}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ flex: 1 }} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Text style={{ color: Colors.tipster.textMuted }}>Min: $10.00</Text>
                    <Text style={{ color: Colors.tipster.textMuted }}>Max: $5,000.00</Text>
                </View>

                <TouchableOpacity
                    onPress={handleDeposit}
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: Colors.tipster.primary,
                        padding: 18,
                        borderRadius: 16,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: Colors.tipster.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 5
                    }}
                >
                    <Text style={{ color: '#05120E', fontWeight: 'bold', fontSize: 18, marginRight: 8 }}>
                        {isSubmitting ? "Processing..." : "Continue"}
                    </Text>
                    {!isSubmitting && <Ionicons name="arrow-forward" size={24} color="#05120E" />}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default DepositScreen;
