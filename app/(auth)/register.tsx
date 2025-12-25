import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../../constants/theme";
import { useGlobalContext } from "../../context/global-provider";

const Register = () => {
    const { register } = useGlobalContext();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = async () => {
        if (form.email === "" || form.password === "") {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (form.password !== form.confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setSubmitting(true);
        try {
            await register(form.email, form.password, form.email.split('@')[0]); // Use email prefix as default username
            Alert.alert("Success", "User signed up successfully");
            router.replace("/(tabs)");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: Colors.tipster.background, height: '100%' }}>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View style={{
                    width: '100%',
                    justifyContent: 'center',
                    height: '100%',
                    paddingHorizontal: 20,
                }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }}>
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <Text style={{ fontSize: 32, color: 'white', fontWeight: '900', fontStyle: 'italic' }}>TIPSTER</Text>
                        <Text style={{ fontSize: 18, color: Colors.tipster.textMuted, fontWeight: '600', marginTop: 5 }}>Create Account</Text>
                    </View>

                    <View style={{ gap: 20 }}>
                        <View>
                            <Text style={{ color: Colors.tipster.textMuted, marginBottom: 8, fontSize: 14 }}>Email Address</Text>
                            <TextInput
                                value={form.email}
                                onChangeText={(e) => setForm({ ...form, email: e })}
                                style={{
                                    backgroundColor: Colors.tipster.surface,
                                    color: 'white',
                                    padding: 16,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: Colors.tipster.border,
                                    fontSize: 16
                                }}
                                placeholder="you@example.com"
                                placeholderTextColor="#5A6A65"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text style={{ color: Colors.tipster.textMuted, marginBottom: 8, fontSize: 14 }}>Password</Text>
                            <View style={{ position: 'relative', justifyContent: 'center' }}>
                                <TextInput
                                    value={form.password}
                                    onChangeText={(e) => setForm({ ...form, password: e })}
                                    style={{
                                        backgroundColor: Colors.tipster.surface,
                                        color: 'white',
                                        padding: 16,
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor: Colors.tipster.border,
                                        fontSize: 16,
                                        paddingRight: 50
                                    }}
                                    placeholder="••••••••"
                                    placeholderTextColor="#5A6A65"
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 16 }}
                                >
                                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#B0C5C0" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View>
                            <Text style={{ color: Colors.tipster.textMuted, marginBottom: 8, fontSize: 14 }}>Confirm Password</Text>
                            <TextInput
                                value={form.confirmPassword}
                                onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                                style={{
                                    backgroundColor: Colors.tipster.surface,
                                    color: 'white',
                                    padding: 16,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: Colors.tipster.border,
                                    fontSize: 16
                                }}
                                placeholder="••••••••"
                                placeholderTextColor="#5A6A65"
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={submit}
                        disabled={isSubmitting}
                        style={{
                            backgroundColor: Colors.tipster.primary,
                            marginTop: 32,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: 'center',
                            shadowColor: Colors.tipster.primary,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 10,
                            elevation: 5
                        }}
                    >
                        <Text style={{ color: '#05120E', fontWeight: 'bold', fontSize: 16 }}>
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: Colors.tipster.border }} />
                        <Text style={{ color: '#5A6A65', marginHorizontal: 10, fontSize: 14 }}>Or continue with</Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: Colors.tipster.border }} />
                    </View>

                    <View style={{ flexDirection: 'row', gap: 16 }}>
                        <TouchableOpacity style={{
                            flex: 1,
                            backgroundColor: Colors.tipster.surface,
                            padding: 14,
                            borderRadius: 12,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: Colors.tipster.border
                        }}>
                            <Ionicons name="logo-apple" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1,
                            backgroundColor: Colors.tipster.surface,
                            padding: 14,
                            borderRadius: 12,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: Colors.tipster.border
                        }}>
                            <Ionicons name="logo-google" size={24} color="white" />
                            {/* Note: Vector Icons usually don't have multi-color Google logo. Using white for now matching design roughly */}
                        </TouchableOpacity>
                    </View>

                    <View style={{ justifyContent: 'center', paddingTop: 30, flexDirection: 'row', gap: 5 }}>
                        <Text style={{ fontSize: 14, color: '#5A6A65' }}>
                            Already a member?
                        </Text>
                        <Link href="/(auth)/login" style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}>
                            Log In
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Register;
