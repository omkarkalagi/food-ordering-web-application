import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native'
import {useState, useEffect} from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import WhatsAppSupport from "@/components/WhatsAppSupport";
import useAuthStore from "@/store/auth.store";
import {Order, Restaurant} from "@/type";
import {getOrdersByRestaurant, updateOrderStatus, getRestaurantsByOwner} from "@/lib/appwrite";

const OrderStatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'preparing': return 'bg-orange-100 text-orange-800';
            case 'ready': return 'bg-green-100 text-green-800';
            case 'delivered': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Text className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
    );
};

const RestaurantOrders = () => {
    const { user } = useAuthStore();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.user_type === 'restaurant_owner') {
            loadRestaurants();
        }
    }, [user]);

    const loadRestaurants = async () => {
        if (!user?.$id) return;

        try {
            setLoading(true);
            const userRestaurants = await getRestaurantsByOwner(user.$id);
            setRestaurants(userRestaurants as Restaurant[]);
            if (userRestaurants.length > 0) {
                setSelectedRestaurant(userRestaurants[0] as Restaurant);
                loadOrders(userRestaurants[0].$id);
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to load restaurants');
        } finally {
            setLoading(false);
        }
    };

    const loadOrders = async (restaurantId: string) => {
        try {
            const restaurantOrders = await getOrdersByRestaurant(restaurantId);
            setOrders(restaurantOrders as Order[]);
        } catch (error: any) {
            Alert.alert('Error', 'Failed to load orders');
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            Alert.alert('Success', `Order status updated to ${newStatus}`);
            if (selectedRestaurant?.$id) {
                loadOrders(selectedRestaurant.$id);
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to update order status');
        }
    };

    const getNextStatus = (currentStatus: string) => {
        switch (currentStatus) {
            case 'pending': return 'confirmed';
            case 'confirmed': return 'preparing';
            case 'preparing': return 'ready';
            case 'ready': return 'delivered';
            default: return currentStatus;
        }
    };

    const renderOrder = ({ item }: { item: Order }) => (
        <View className="bg-white rounded-lg shadow-sm mb-3 mx-4 p-4">
            <View className="flex-row justify-between items-start mb-3">
                <View>
                    <Text className="font-bold text-gray-900">Order #{item.$id.slice(-8)}</Text>
                    <Text className="text-gray-600 text-sm">
                        {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}
                    </Text>
                </View>
                <OrderStatusBadge status={item.status} />
            </View>

            <Text className="font-medium text-gray-900 mb-2">Items:</Text>
            {item.items.map((cartItem, index) => (
                <Text key={index} className="text-gray-600 text-sm ml-4">
                    • {cartItem.name} x{cartItem.quantity} - ${(cartItem.price * cartItem.quantity).toFixed(2)}
                </Text>
            ))}

            <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <Text className="font-bold text-lg text-primary">Total: ${item.total_amount.toFixed(2)}</Text>
                {item.status !== 'delivered' && item.status !== 'cancelled' && (
                    <TouchableOpacity
                        className="bg-primary px-4 py-2 rounded-lg"
                        onPress={() => updateStatus(item.$id, getNextStatus(item.status))}
                    >
                        <Text className="text-white font-medium">
                            Mark as {getNextStatus(item.status).charAt(0).toUpperCase() + getNextStatus(item.status).slice(1)}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {item.delivery_address && (
                <View className="mt-3 pt-3 border-t border-gray-200">
                    <Text className="font-medium text-gray-900 mb-1">Delivery Address:</Text>
                    <Text className="text-gray-600 text-sm">{item.delivery_address}</Text>
                </View>
            )}

            {item.order_notes && (
                <View className="mt-3 pt-3 border-t border-gray-200">
                    <Text className="font-medium text-gray-900 mb-1">Notes:</Text>
                    <Text className="text-gray-600 text-sm">{item.order_notes}</Text>
                </View>
            )}
        </View>
    );

    if (user?.user_type !== 'restaurant_owner') {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-lg text-gray-600">Access denied. This page is for restaurant owners only.</Text>
            </SafeAreaView>
        );
    }

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-lg text-gray-600">Loading orders...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <GlobalHeader subtitle="Restaurant Orders" />

            {/* Restaurant Selection */}
            {restaurants.length > 1 && (
                <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm p-4">
                    <Text className="font-medium text-gray-900 mb-2">Select Restaurant:</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {restaurants.map((restaurant) => (
                            <TouchableOpacity
                                key={restaurant.$id}
                                onPress={() => {
                                    setSelectedRestaurant(restaurant as Restaurant);
                                    loadOrders(restaurant.$id);
                                }}
                                className={`px-3 py-2 rounded-lg ${selectedRestaurant?.$id === restaurant.$id ? 'bg-primary' : 'bg-gray-200'}`}
                            >
                                <Text className={`${selectedRestaurant?.$id === restaurant.$id ? 'text-white' : 'text-gray-700'}`}>
                                    {restaurant.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Orders List */}
            <View className="flex-1 mt-4">
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.$id}
                    contentContainerClassName="pb-20"
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center py-10">
                            <Text className="text-gray-500 text-lg">No orders yet</Text>
                            <Text className="text-gray-400 text-sm mt-2">Orders will appear here when customers place them.</Text>
                        </View>
                    )}
                />
            </View>

            <GlobalFooter />
            <WhatsAppSupport />
        </SafeAreaView>
    )
}

export default RestaurantOrders
