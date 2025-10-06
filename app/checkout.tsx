import {View, Text, TouchableOpacity, Alert} from 'react-native'
import {useState, useEffect} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import WhatsAppSupport from "@/components/WhatsAppSupport";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { useCartStore } from "@/store/cart.store";
import useAuthStore from "@/store/auth.store";
import { createOrder } from "@/lib/appwrite";
import { CartItemType } from "@/type";

const Checkout = () => {
    const { restaurantId } = useLocalSearchParams();
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [orderNotes, setOrderNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();

    const totalAmount = getTotalPrice();

    const submitOrder = async () => {
        if (!user?.$id || !restaurantId || items.length === 0) {
            Alert.alert('Error', 'Please add items to your cart and ensure you are logged in.');
            return;
        }

        if (!deliveryAddress.trim()) {
            Alert.alert('Error', 'Please enter a delivery address.');
            return;
        }

        setIsSubmitting(true);

        try {
            await createOrder({
                customer_id: user.$id,
                restaurant_id: restaurantId as string,
                items: items as CartItemType[],
                total_amount: totalAmount,
                status: 'pending',
                order_notes: orderNotes.trim() || undefined,
                delivery_address: deliveryAddress.trim(),
                payment_method: 'cash_on_delivery'
            });

            Alert.alert(
                'Order Placed!',
                'Your order has been placed successfully. You will receive a notification when the restaurant confirms your order.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            clearCart();
                            router.replace('/');
                        }
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', 'Failed to place order. Please try again.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-lg text-gray-600 mb-4">Your cart is empty</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="bg-primary px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-medium">Go Back to Restaurant</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <GlobalHeader subtitle="Checkout" />

            <View className="flex-1 p-4">
                {/* Order Summary */}
                <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <Text className="text-lg font-bold text-gray-900 mb-3">Order Summary</Text>

                    {items.map((item) => (
                        <View key={`${item.id}-${JSON.stringify(item.customizations || [])}`} className="flex-row justify-between items-center py-2">
                            <View className="flex-1">
                                <Text className="font-medium text-gray-900">{item.name}</Text>
                                <Text className="text-sm text-gray-600">Quantity: {item.quantity}</Text>
                            </View>
                            <Text className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}

                    <View className="border-t border-gray-200 mt-3 pt-3">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-lg font-bold text-gray-900">Total:</Text>
                            <Text className="text-lg font-bold text-primary">${totalAmount.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Delivery Information */}
                <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <Text className="text-lg font-bold text-gray-900 mb-3">Delivery Information</Text>

                    <CustomInput
                        placeholder="Enter your delivery address"
                        value={deliveryAddress}
                        onChangeText={setDeliveryAddress}
                        label="Delivery Address"
                        multiline
                    />

                    <CustomInput
                        placeholder="Any special instructions? (optional)"
                        value={orderNotes}
                        onChangeText={setOrderNotes}
                        label="Order Notes"
                        multiline
                    />
                </View>

                {/* Payment Method */}
                <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <Text className="text-lg font-bold text-gray-900 mb-3">Payment Method</Text>
                    <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <Text className="text-gray-700">Cash on Delivery</Text>
                        <Text className="text-green-600 font-medium">✓ Selected</Text>
                    </View>
                </View>

                {/* Place Order Button */}
                <CustomButton
                    title={`Place Order - $${totalAmount.toFixed(2)}`}
                    isLoading={isSubmitting}
                    onPress={submitOrder}
                />
            </View>

            <GlobalFooter />
            <WhatsAppSupport />
        </SafeAreaView>
    )
}

export default Checkout
