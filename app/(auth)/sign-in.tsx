import {View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, TouchableOpacity} from 'react-native'
import {Link, router} from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import {useState} from "react";
import {signIn} from "@/lib/appwrite";
import * as Sentry from '@sentry/react-native'
import useAuthStore from "@/store/auth.store";
import {images} from "@/constants";

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const { fetchAuthenticatedUser } = useAuthStore();

    const submit = async () => {
        const { email, password } = form;

        if(!email || !password) return Alert.alert('Error', 'Please enter valid email address & password.');

        setIsSubmitting(true)

        try {
            await signIn({ email, password });
            await fetchAuthenticatedUser(); // Fetch user data after successful sign-in
            router.replace('/');
        } catch(error: any) {
            Alert.alert('Error', error.message);
            Sentry.captureEvent(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
            <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                <View className="w-full relative" style={{ height: Dimensions.get('screen').height / 2.5}}>
                    <ImageBackground source={images.loginGraphic} className="size-full rounded-b-2xl" resizeMode="stretch" />
                </View>

                <View className="px-6 pt-8 pb-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome Back!</Text>
                    <Text className="text-gray-600 text-center mb-8">Sign in to your account</Text>

                    <View className="bg-white rounded-2xl p-6 shadow-lg mb-6" style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 8,
                    }}>
                        <CustomInput
                            placeholder="Enter your email"
                            value={form.email}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                            label="Email"
                            keyboardType="email-address"
                        />
                        <CustomInput
                            placeholder="Enter your password"
                            value={form.password}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                            label="Password"
                            secureTextEntry={true}
                        />

                        <CustomButton
                            title="Sign In"
                            isLoading={isSubmitting}
                            onPress={submit}
                        />

                        <TouchableOpacity className="mt-4 items-center">
                            <Text className="text-primary font-medium">Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex justify-center mt-6 flex-row gap-2">
                        <Text className="text-gray-600">
                            Don't have an account?
                        </Text>
                        <Link href="/sign-up" className="font-bold text-primary">
                            Sign Up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignIn
