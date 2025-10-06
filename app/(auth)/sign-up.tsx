import {View, Text, Button, Alert} from 'react-native'
import {Link, router} from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import {useState} from "react";
import {createUser} from "@/lib/appwrite";
import {UserType} from "@/type";

const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', user_type: 'customer' as UserType });

    const submit = async () => {
        const { name, email, password, user_type } = form;

        if(!name || !email || !password) return Alert.alert('Error', 'Please fill in all fields.');

        setIsSubmitting(true)

        try {
            await createUser({ email, password, name, user_type });

            router.replace('/');
        } catch(error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter your full name"
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                label="Full name"
            />

            <View className="mb-4">
                <Text className="text-base text-gray-100 mb-2">I am registering as:</Text>
                <View className="flex-row gap-4">
                    <Button
                        title="Customer"
                        onPress={() => setForm((prev) => ({ ...prev, user_type: 'customer' }))}
                        color={form.user_type === 'customer' ? '#FF6B35' : '#666'}
                    />
                    <Button
                        title="Restaurant Owner"
                        onPress={() => setForm((prev) => ({ ...prev, user_type: 'restaurant_owner' }))}
                        color={form.user_type === 'restaurant_owner' ? '#FF6B35' : '#666'}
                    />
                </View>
            </View>

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
                title="Sign Up"
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Already have an account?
                </Text>
                <Link href="/sign-in" className="base-bold text-primary">
                    Sign In
                </Link>
            </View>
        </View>
    )
}

export default SignUp
