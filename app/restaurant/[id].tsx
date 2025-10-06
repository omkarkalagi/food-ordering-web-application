import {View, Text, FlatList, Image, TouchableOpacity, Alert} from 'react-native'
import {useState, useEffect} from "react";
import {useLocalSearchParams, router} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import WhatsAppSupport from "@/components/WhatsAppSupport";
import CartButton from "@/components/CartButton";
import {MenuItem, Restaurant} from "@/type";
import {getRestaurantById, getMenuByRestaurant} from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";

const RestaurantDetail = () => {
    const { id } = useLocalSearchParams();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [dishes, setDishes] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem, items, getTotalItems, getTotalPrice } = useCartStore();

    useEffect(() => {
        if (id) {
            loadRestaurantData();
        }
    }, [id]);

    const loadRestaurantData = async () => {
        try {
            setLoading(true);
            const [restaurantData, dishesData] = await Promise.all([
                getRestaurantById(id as string),
                getMenuByRestaurant(id as string)
            ]);

            setRestaurant(restaurantData as Restaurant);
            setDishes(dishesData as MenuItem[]);
        } catch (error) {
            Alert.alert('Error', 'Failed to load restaurant data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (dish: MenuItem) => {
        addItem({
            id: dish.$id,
            name: dish.name,
            price: dish.price,
            image_url: dish.image_url,
            quantity: 1
        });
        Alert.alert('Added to Cart', `${dish.name} has been added to your cart!`);
    };

    const renderDish = ({ item }: { item: MenuItem }) => (
        <View className="bg-white rounded-lg shadow-sm mb-3 mx-4 overflow-hidden">
            <Image
                source={{ uri: item.image_url || 'https://via.placeholder.com/300x200' }}
                className="w-full h-32"
                resizeMode="cover"
            />
            <View className="p-3">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-base font-bold text-gray-900 flex-1 mr-2">{item.name}</Text>
                    <Text className="text-lg font-bold text-primary">${item.price}</Text>
                </View>
                <Text className="text-gray-600 text-sm mb-3">{item.description}</Text>
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                        <Text className="text-yellow-500 mr-1">⭐</Text>
                        <Text className="text-gray-700 text-sm">{item.rating.toFixed(1)}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Text className="text-gray-500 text-xs mr-2">{item.calories} cal</Text>
                        <Text className="text-gray-500 text-xs">{item.protein}g protein</Text>
                    </View>
                </View>
                {item.is_featured && (
                    <Text className="text-primary text-xs font-medium mb-2">★ Featured Dish</Text>
                )}
                <TouchableOpacity
                    className="bg-primary py-2 px-4 rounded-lg"
                    onPress={() => addToCart(item)}
                >
                    <Text className="text-white text-center font-medium">Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-lg text-gray-600">Loading restaurant...</Text>
            </SafeAreaView>
        );
    }

    if (!restaurant) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-lg text-gray-600">Restaurant not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <GlobalHeader subtitle={restaurant.name} />

            {/* Restaurant Header */}
            <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm overflow-hidden">
                <Image
                    source={{ uri: restaurant.image_url || 'https://via.placeholder.com/400x200' }}
                    className="w-full h-48"
                    resizeMode="cover"
                />
                <View className="p-4">
                    <Text className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</Text>
                    <Text className="text-gray-600 mb-3">{restaurant.description}</Text>
                    <Text className="text-gray-500 mb-2">{restaurant.address}</Text>
                    <Text className="text-gray-500 mb-3">{restaurant.phone} • {restaurant.email}</Text>

                    <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center">
                            <Text className="text-yellow-500 mr-1">⭐</Text>
                            <Text className="text-gray-700 font-medium">{restaurant.rating.toFixed(1)}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className={`text-sm font-medium mr-2 ${restaurant.is_open ? 'text-green-600' : 'text-red-600'}`}>
                                {restaurant.is_open ? '● Open' : '● Closed'}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row flex-wrap gap-1 mb-3">
                        {restaurant.cuisine_types.map((cuisine, index) => (
                            <Text key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {cuisine}
                            </Text>
                        ))}
                    </View>

                    <Text className="text-sm text-gray-600 mb-3">Operating Hours:</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {Object.entries(restaurant.opening_hours).map(([day, hours]) => (
                            <Text key={day} className="text-xs text-gray-500">
                                {day.charAt(0).toUpperCase() + day.slice(1)}: {hours.closed ? 'Closed' : `${hours.open}-${hours.close}`}
                            </Text>
                        ))}
                    </View>
                </View>
            </View>

            {/* Dishes Section */}
            <View className="flex-1 mt-4">
                <Text className="text-xl font-bold text-gray-900 mx-4 mb-3">Menu</Text>
                <FlatList
                    data={dishes}
                    renderItem={renderDish}
                    keyExtractor={(item) => item.$id}
                    contentContainerClassName="pb-20"
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center py-10">
                            <Text className="text-gray-500 text-lg">No dishes available</Text>
                            <Text className="text-gray-400 text-sm mt-2">This restaurant hasn't added any dishes yet.</Text>
                        </View>
                    )}
                />
            </View>

            <GlobalFooter />
            <WhatsAppSupport />

            {/* Floating Checkout Button */}
            {getTotalItems() > 0 && (
                <TouchableOpacity
                    className="absolute bottom-20 left-4 right-4 bg-primary py-4 px-6 rounded-lg shadow-lg"
                    onPress={() => router.push(`/checkout?restaurantId=${restaurant.$id}`)}
                >
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-white font-bold text-lg">
                                {getTotalItems()} item{getTotalItems() > 1 ? 's' : ''} in cart
                            </Text>
                            <Text className="text-white text-sm opacity-90">
                                Total: ${getTotalPrice().toFixed(2)}
                            </Text>
                        </View>
                        <Text className="text-white font-bold text-lg">Checkout →</Text>
                    </View>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    )
}

export default RestaurantDetail
