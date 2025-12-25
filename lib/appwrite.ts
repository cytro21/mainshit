import { Client } from 'react-native-appwrite';

const appwriteClient = new Client()
    .setProject("694d1f9d000656650bbe")
    .setEndpoint("https://fra.cloud.appwrite.io/v1");

export const client = Object.assign(appwriteClient, {
    ping: async () => {
        const response = await fetch('https://fra.cloud.appwrite.io/v1/health/name');
        return await response.json();
    }
});
