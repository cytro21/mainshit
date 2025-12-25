export const DUMMY_TIPS = [
    {
        $id: '1',
        sport: 'Football',
        league: 'Premier League',
        event: 'Arsenal vs Liverpool',
        odds: 2.45,
        stake: 50,
        type: 'FREE',
        status: 'PENDING',
        result: null,
        timestamp: new Date().toISOString(),
        provider: {
            $id: 'u1',
            displayName: 'ProTips Daily',
            avatar: null,
            specialization: ['Football', 'Tennis']
        }
    },
    {
        $id: '2',
        sport: 'Basketball',
        league: 'NBA',
        event: 'Lakers vs Warriors',
        odds: 1.90,
        stake: 100,
        type: 'PAID',
        status: 'WIN',
        result: 'Lakers +5.5',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        provider: {
            $id: 'u2',
            displayName: 'Court King',
            avatar: null,
            specialization: ['Basketball']
        }
    },
    {
        $id: '3',
        sport: 'Tennis',
        league: 'Wimbledon',
        event: 'Alcaraz vs Djokovic',
        odds: 1.85,
        stake: 75,
        type: 'PAID',
        status: 'PENDING',
        result: null,
        timestamp: new Date().toISOString(),
        provider: {
            $id: 'u1',
            displayName: 'ProTips Daily',
            avatar: null,
            specialization: ['Football', 'Tennis']
        }
    }
];
