import { Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Define a type that handles both Appwrite Models and our Dummy Data structure
export type Tip = {
    $id: string;
    sport: string;
    league: string;
    event: string;
    odds: number;
    stake: number;
    type: string;
    status: string;
    result?: string | null;
    timestamp: string;
    provider: {
        $id: string;
        displayName: string;
        avatar?: string | null;
        specialization?: string[];
    };
};

interface TipCardProps {
    tip: Tip;
}

const TipCard: React.FC<TipCardProps> = ({ tip }) => {
    const isPaid = tip.type === 'PAID';
    const isPending = tip.status === 'PENDING';
    const isWin = tip.status === 'WIN';
    const isLoss = tip.status === 'LOSS';

    const getStatusColor = () => {
        if (isWin) return '#10B981'; // Green
        if (isLoss) return '#EF4444'; // Red
        return '#FF9C01'; // Orange (Pending)
    };

    return (
        <View style={{
            backgroundColor: '#1E1E2D',
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#232533',
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View>
                    <Text style={{ color: '#CDCDE0', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>
                        {tip.sport} • {tip.league}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 4 }}>
                        {tip.event}
                    </Text>
                </View>
                <Link href={`/provider/${tip.provider.$id}` as any} asChild>
                    <TouchableOpacity>
                        <Text style={{ color: '#FF9C01', fontWeight: '600' }}>@{tip.provider.displayName}</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <View style={{ backgroundColor: '#232533', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}>
                    <Text style={{ color: '#CDCDE0', fontSize: 12 }}>Odds</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{tip.odds.toFixed(2)}</Text>
                </View>
                <View style={{ backgroundColor: '#232533', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}>
                    <Text style={{ color: '#CDCDE0', fontSize: 12 }}>Stake</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>${tip.stake}</Text>
                </View>
                <View style={{
                    backgroundColor: isPaid ? 'rgba(255, 156, 1, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8,
                    flex: 1, alignItems: 'center', justifyContent: 'center'
                }}>
                    <Text style={{
                        color: isPaid ? '#FF9C01' : '#10B981',
                        fontWeight: 'bold',
                        fontSize: 14
                    }}>
                        {tip.type}
                    </Text>
                </View>
            </View>

            {/* Status / Result Section */}
            <View style={{
                borderTopWidth: 1,
                borderTopColor: '#232533',
                paddingTop: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: getStatusColor() }} />
                    <Text style={{ color: '#CDCDE0', fontWeight: '500' }}>{tip.status}</Text>
                </View>

                {tip.result && (
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Result: {tip.result}</Text>
                )}
            </View>
        </View>
    );
};

export default TipCard;
