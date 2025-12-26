import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useGlobalContext } from '../../context/global-provider';
import { supabase } from '../../lib/supabase';

const CreateTipScreen = () => {
    const { user, profile, capabilities } = useGlobalContext();
    const [isSubmitting, setSubmitting] = useState(false);

    // Step 1 mock data (implied passed from previous screen)
    const event = "Man City vs Arsenal";
    const league = "Premier League";
    const sport = "Football";

    // Step 2 Form
    const [market, setMarket] = useState("Match Winner (1x2)");
    const [selection, setSelection] = useState<string | null>(null);
    const [odds, setOdds] = useState("1.85");
    const [stake, setStake] = useState("10");
    const [confidence, setConfidence] = useState(8);
    const [type, setType] = useState<'FREE' | 'PAID'>('PAID');

    const handleCreateTip = async () => {
        if (!user || !profile) {
            Alert.alert("Error", "You must be logged in.");
            return;
        }

        if (!capabilities?.can_publish) {
            Alert.alert("Restricted", "You must be a verified tipster to publish tips. Please apply in your profile.");
            return;
        }

        if (!selection) {
            Alert.alert("Error", "Please select an outcome.");
            return;
        }

        setSubmitting(true);
        const { error } = await supabase
            .from('tips')
            .insert([{
                provider_id: user.id,
                sport,
                league,
                event,
                market,
                selection,
                odds: parseFloat(odds),
                stake: parseInt(stake),
                confidence,
                type,
                status: 'PENDING'
            }]);

        setSubmitting(false);

        if (error) {
            Alert.alert("Error", "Failed to create tip: " + error.message);
        } else {
            Alert.alert("Success", "Tip published!");
            router.replace("/(tabs)");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.tipster.background }}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={{ padding: 20, flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Bet Details</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Progress */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ color: Colors.tipster.primary, fontWeight: 'bold' }}>Step 2 of 3</Text>
                    <Text style={{ color: Colors.tipster.textMuted }}>Next: Analysis</Text>
                </View>
                <View style={{ height: 4, backgroundColor: '#1E3A32', borderRadius: 2, marginBottom: 30 }}>
                    <View style={{ width: '66%', height: '100%', backgroundColor: Colors.tipster.primary, borderRadius: 2 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Market */}
                    <Text style={{ color: Colors.tipster.textMuted, marginBottom: 10, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }}>MARKET</Text>
                    <TouchableOpacity style={{
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                        backgroundColor: Colors.tipster.surface, padding: 16, borderRadius: 12, marginBottom: 24,
                        borderWidth: 1, borderColor: Colors.tipster.border
                    }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>{market}</Text>
                        <Ionicons name="chevron-down" size={20} color={Colors.tipster.textMuted} />
                    </TouchableOpacity>

                    {/* Selection */}
                    <Text style={{ color: Colors.tipster.textMuted, marginBottom: 10, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }}>SELECTION</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
                        {['Man City', 'Draw', 'Arsenal'].map((item) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => setSelection(item)}
                                style={{
                                    flex: 1,
                                    padding: 16,
                                    backgroundColor: selection === item ? Colors.tipster.primary : Colors.tipster.surface,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: selection === item ? Colors.tipster.primary : Colors.tipster.border
                                }}
                            >
                                <Text style={{ color: selection === item ? '#05120E' : Colors.tipster.textMuted, fontWeight: 'bold' }}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Odds & Stake */}
                    <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: Colors.tipster.textMuted, marginBottom: 10, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }}>ODDS</Text>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center',
                                backgroundColor: Colors.tipster.surface, borderRadius: 12,
                                borderWidth: 1, borderColor: Colors.tipster.border,
                                paddingHorizontal: 16
                            }}>
                                <Text style={{ color: Colors.tipster.textMuted, fontSize: 20 }}>@</Text>
                                <TextInput
                                    value={odds}
                                    onChangeText={setOdds}
                                    style={{ flex: 1, color: 'white', fontSize: 24, fontWeight: 'bold', padding: 16, }}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: Colors.tipster.textMuted, marginBottom: 10, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }}>STAKE (1-10U)</Text>
                            <View style={{
                                backgroundColor: Colors.tipster.surface, borderRadius: 12,
                                borderWidth: 1, borderColor: Colors.tipster.border,
                                paddingHorizontal: 16
                            }}>
                                <TextInput
                                    value={stake}
                                    onChangeText={setStake}
                                    style={{ color: Colors.tipster.primary, fontSize: 24, fontWeight: 'bold', padding: 16, textAlign: 'center' }}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Confidence */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                        <Text style={{ color: Colors.tipster.textMuted, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }}>CONFIDENCE</Text>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                            <Text style={{ color: Colors.tipster.primary, fontSize: 24 }}>{confidence}</Text>/10
                        </Text>
                    </View>
                    <View style={{
                        height: 40, backgroundColor: Colors.tipster.surface, borderRadius: 20,
                        marginBottom: 10, justifyContent: 'center', paddingHorizontal: 10,
                        borderWidth: 1, borderColor: Colors.tipster.border
                    }}>
                        {/* Custom Slider Visualization since accessing packages is hard */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <TouchableOpacity
                                    key={n}
                                    onPress={() => setConfidence(n)}
                                    style={{
                                        width: 24, height: 24, borderRadius: 12,
                                        backgroundColor: n === confidence ? Colors.tipster.primary : (n < confidence ? Colors.tipster.secondary : 'transparent'),
                                        alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    {n === confidence && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#05120E' }} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <Text style={{ color: Colors.tipster.textMuted, textAlign: 'center', fontSize: 12, marginBottom: 30 }}>
                        High confidence based on team form
                    </Text>

                </ScrollView>

                {/* Footer Button */}
                <TouchableOpacity
                    onPress={handleCreateTip}
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
                        {isSubmitting ? "Publishing..." : "Review Tip"}
                    </Text>
                    {!isSubmitting && <Ionicons name="arrow-forward" size={24} color="#05120E" />}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CreateTipScreen;
