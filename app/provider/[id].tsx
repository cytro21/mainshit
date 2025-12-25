import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProviderProfile = () => {
    const { id } = useLocalSearchParams();

    return (
        <SafeAreaView style={{ backgroundColor: '#161622', height: '100%' }}>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View style={{ padding: 16 }}>
                    <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Provider Profile</Text>
                    <Text style={{ color: '#CDCDE0', marginTop: 8 }}>Provider ID: {id}</Text>

                    <View style={{ marginTop: 24, padding: 16, backgroundColor: '#1E1E2D', borderRadius: 12 }}>
                        <Text style={{ color: 'white' }}>Provider stats and history coming soon...</Text>
                    </View>
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    );
};

export default ProviderProfile;
