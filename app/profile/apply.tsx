import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useGlobalContext } from '../../context/global-provider';
import { supabase } from '../../lib/supabase';

const ApplyScreen = () => {
    const { user } = useGlobalContext();
    const [bio, setBio] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    const handleApply = async () => {
        if (bio.length < 20) {
            Alert.alert("Too short", "Please tell us more about yourself (min 20 chars).");
            return;
        }

        setSubmitting(true);
        const { error } = await supabase
            .from('provider_applications')
            .insert([{
                user_id: user?.id,
                status: 'PENDING',
                bio: bio
            }]);

        setSubmitting(false);

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("Success", "Application submitted! We will review it shortly.");
            router.back();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.tipster.background }}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={{ padding: 20 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Apply to Verified</Text>
                </View>

                <Text style={{ color: Colors.tipster.textMuted, marginBottom: 30, lineHeight: 22 }}>
                    Join our community of verified tipsters. Provide a track record or explain your strategy to get approved and start selling metrics-backed tips.
                </Text>

                <Text style={{ color: 'white', marginBottom: 10, fontWeight: 'bold' }}>Your Bio / Strategy</Text>
                <TextInput
                    multiline
                    numberOfLines={6}
                    placeholder="I specialize in Premier League underdogs..."
                    placeholderTextColor={Colors.tipster.textMuted}
                    value={bio}
                    onChangeText={setBio}
                    style={{
                        backgroundColor: Colors.tipster.surface,
                        color: 'white',
                        padding: 15,
                        borderRadius: 12,
                        height: 150,
                        textAlignVertical: 'top',
                        borderWidth: 1,
                        borderColor: Colors.tipster.border
                    }}
                />

                <TouchableOpacity
                    onPress={handleApply}
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: Colors.tipster.primary,
                        padding: 18,
                        borderRadius: 12,
                        alignItems: 'center',
                        marginTop: 40,
                        opacity: isSubmitting ? 0.7 : 1
                    }}
                >
                    <Text style={{ color: '#05120E', fontWeight: 'bold', fontSize: 16 }}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

export default ApplyScreen;
