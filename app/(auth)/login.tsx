import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TextInput, TouchableOpacity } from "react-native";
import { useGlobalContext } from "../../context/global-provider";

const Login = () => {
    const { login } = useGlobalContext();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const submit = async () => {
        if (form.email === "" || form.password === "") {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setSubmitting(true);
        try {
            await login(form.email, form.password);
            Alert.alert("Success", "User signed in successfully");
            router.replace("/(tabs)"); // Navigate to Home
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#161622', height: '100%' }}>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View style={{
                    width: '100%',
                    justifyContent: 'center',
                    height: '100%',
                    paddingHorizontal: 16,
                    marginVertical: 24,
                }}>
                    <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>To Login to</Text>
                    <Text style={{ fontSize: 30, color: '#FF9C01', fontWeight: 'bold' }}>Tipster</Text>

                    <View style={{ marginTop: 28 }}>
                        <Text style={{ color: '#e5e5e5', fontSize: 16, marginBottom: 8 }}>Email</Text>
                        <TextInput
                            value={form.email}
                            onChangeText={(e) => setForm({ ...form, email: e })}
                            style={{
                                backgroundColor: '#1E1E2D',
                                color: 'white',
                                padding: 16,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: '#232533'
                            }}
                            placeholder="Email Address"
                            placeholderTextColor="#7b7b8b"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={{ marginTop: 28 }}>
                        <Text style={{ color: '#e5e5e5', fontSize: 16, marginBottom: 8 }}>Password</Text>
                        <TextInput
                            value={form.password}
                            onChangeText={(e) => setForm({ ...form, password: e })}
                            style={{
                                backgroundColor: '#1E1E2D',
                                color: 'white',
                                padding: 16,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: '#232533'
                            }}
                            placeholder="Password"
                            placeholderTextColor="#7b7b8b"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        onPress={submit}
                        disabled={isSubmitting}
                        style={{
                            backgroundColor: '#FF9C01',
                            marginTop: 28,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: 'center',
                            opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        <Text style={{ color: '#161622', fontWeight: 'bold', fontSize: 18 }}>
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ justifyContent: 'center', paddingTop: 20, flexDirection: 'row', gap: 8 }}>
                        <Text style={{ fontSize: 16, color: '#e5e5e5' }}>
                            Don't have an account?
                        </Text>
                        <Link href="/(auth)/register" style={{ fontSize: 16, color: '#FF9C01', fontWeight: 'bold' }}>
                            Sign Up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Login;
