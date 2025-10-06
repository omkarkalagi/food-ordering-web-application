import {View, Text, Alert, FlatList, TouchableOpacity} from 'react-native'
import {useState, useEffect} from "react";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import useAuthStore from "@/store/auth.store";
import {MenuItem, Restaurant} from "@/type";
import {createMenuItem, getMenuByRestaurant, deleteMenuItem, updateMenuItem, getRestaurantsByOwner} from "@/lib/appwrite";

const DishManagement = () => {
    const { user } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [dishes, setDishes] = useState<MenuItem[]>([]);
    const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        calories: '',
        protein: '',
        type: 'main_course',
        categories: '',
        tags: '',
        is_featured: false
    });

    useEffect(() => {
        if (user?.user_type === 'restaurant_owner') {
            loadRestaurants();
        }
    }, [user]);

    const loadRestaurants = async () => {
        if (!user?.$id) return;

        try {
            const userRestaurants = await getRestaurantsByOwner(user.$id);
            setRestaurants(userRestaurants as Restaurant[]);
            if (userRestaurants.length > 0) {
                setSelectedRestaurant(userRestaurants[0] as Restaurant);
                loadDishes(userRestaurants[0].$id);
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to load restaurants');
        }
    };

    const loadDishes = async (restaurantId: string) => {
        try {
            const restaurantDishes = await getMenuByRestaurant(restaurantId);
            setDishes(restaurantDishes as MenuItem[]);
        } catch (error: any) {
            Alert.alert('Error', 'Failed to load dishes');
        }
    };

    const resetForm = () => {
        setForm({
            name: '',
            description: '',
            price: '',
            image_url: '',
            calories: '',
            protein: '',
            type: 'main_course',
            categories: '',
            tags: '',
            is_featured: false
        });
        setEditingDish(null);
    };

    const submit = async () => {
        if (!selectedRestaurant?.$id) return;

        const { name, description, price, image_url, calories, protein, type, categories, tags, is_featured } = form;

        if(!name || !description || !price) {
            return Alert.alert('Error', 'Please fill in all required fields.');
        }

        setIsSubmitting(true);

        try {
            const dishData = {
                name,
                description,
                price: parseFloat(price),
                image_url: image_url || 'https://via.placeholder.com/300x200',
                calories: parseInt(calories) || 0,
                protein: parseInt(protein) || 0,
                rating: 0,
                type,
                categories: categories.split(',').map(cat => cat.trim()),
                tags: tags.split(',').map(tag => tag.trim()),
                is_featured,
                restaurant_id: selectedRestaurant.$id
            };

            if (editingDish) {
                await updateMenuItem(editingDish.$id, dishData);
                Alert.alert('Success', 'Dish updated successfully!');
            } else {
                await createMenuItem(dishData);
                Alert.alert('Success', 'Dish added successfully!');
            }

            resetForm();
            loadDishes(selectedRestaurant.$id);
        } catch(error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const editDish = (dish: MenuItem) => {
        setEditingDish(dish);
        setForm({
            name: dish.name,
            description: dish.description,
            price: dish.price.toString(),
            image_url: dish.image_url,
            calories: dish.calories.toString(),
            protein: dish.protein.toString(),
            type: dish.type,
            categories: dish.categories?.join(', ') || '',
            tags: dish.tags?.join(', ') || '',
            is_featured: dish.is_featured || false
        });
    };

    const removeDish = async (dishId: string) => {
        Alert.alert(
            'Delete Dish',
            'Are you sure you want to delete this dish?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteMenuItem(dishId);
                            Alert.alert('Success', 'Dish deleted successfully!');
                            if (selectedRestaurant?.$id) {
                                loadDishes(selectedRestaurant.$id);
                            }
                        } catch (error: any) {
                            Alert.alert('Error', 'Failed to delete dish');
                        }
                    }
                }
            ]
        );
    };

    if (user?.user_type !== 'restaurant_owner') {
        return (
            <View className="flex-1 justify-center items-center p-5">
                <Text className="text-lg text-gray-600">Access denied. This page is for restaurant owners only.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-5 bg-white">
            <Text className="text-2xl font-bold mb-5 text-center">Dish Management</Text>

            {/* Restaurant Selection */}
            <View className="mb-5">
                <Text className="text-base font-semibold mb-2">Select Restaurant:</Text>
                <View className="flex-row flex-wrap gap-2">
                    {restaurants.map((restaurant) => (
                        <TouchableOpacity
                            key={restaurant.$id}
                            onPress={() => {
                                setSelectedRestaurant(restaurant);
                                loadDishes(restaurant.$id);
                            }}
                            className={`p-2 rounded-lg ${selectedRestaurant?.$id === restaurant.$id ? 'bg-primary' : 'bg-gray-200'}`}
                        >
                            <Text className={`${selectedRestaurant?.$id === restaurant.$id ? 'text-white' : 'text-gray-700'}`}>
                                {restaurant.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {!selectedRestaurant && (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg text-gray-600">Please select a restaurant to manage dishes.</Text>
                </View>
            )}

            {selectedRestaurant && (
                <>
                    {/* Dishes List */}
                    <View className="mb-5">
                        <Text className="text-lg font-semibold mb-3">Your Dishes</Text>
                        <FlatList
                            data={dishes}
                            keyExtractor={(item) => item.$id}
                            renderItem={({ item }) => (
                                <View className="bg-gray-100 p-3 rounded-lg mb-2 flex-row justify-between items-center">
                                    <View className="flex-1">
                                        <Text className="font-bold">{item.name}</Text>
                                        <Text className="text-gray-600">${item.price}</Text>
                                        <Text className="text-sm text-gray-500">{item.description}</Text>
                                    </View>
                                    <View className="flex-row gap-2">
                                        <TouchableOpacity
                                            onPress={() => editDish(item)}
                                            className="bg-blue-500 px-3 py-1 rounded"
                                        >
                                            <Text className="text-white text-sm">Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => removeDish(item.$id)}
                                            className="bg-red-500 px-3 py-1 rounded"
                                        >
                                            <Text className="text-white text-sm">Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={() => (
                                <Text className="text-gray-500 text-center py-5">No dishes added yet. Add your first dish below!</Text>
                            )}
                        />
                    </View>

                    {/* Add/Edit Dish Form */}
                    <Text className="text-lg font-semibold mb-3">
                        {editingDish ? 'Edit Dish' : 'Add New Dish'}
                    </Text>

                    <CustomInput
                        placeholder="Dish Name (e.g., Chicken Biryani)"
                        value={form.name}
                        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                        label="Dish Name"
                    />

                    <CustomInput
                        placeholder="Description"
                        value={form.description}
                        onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
                        label="Description"
                        multiline
                    />

                    <CustomInput
                        placeholder="Price"
                        value={form.price}
                        onChangeText={(text) => setForm((prev) => ({ ...prev, price: text }))}
                        label="Price"
                        keyboardType="numeric"
                    />

                    <View className="flex-row gap-2 mb-4">
                        <View className="flex-1">
                            <CustomInput
                                placeholder="Calories"
                                value={form.calories}
                                onChangeText={(text) => setForm((prev) => ({ ...prev, calories: text }))}
                                label="Calories"
                                keyboardType="numeric"
                            />
                        </View>
                        <View className="flex-1">
                            <CustomInput
                                placeholder="Protein (g)"
                                value={form.protein}
                                onChangeText={(text) => setForm((prev) => ({ ...prev, protein: text }))}
                                label="Protein"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <CustomInput
                        placeholder="Image URL"
                        value={form.image_url}
                        onChangeText={(text) => setForm((prev) => ({ ...prev, image_url: text }))}
                        label="Image URL"
                    />

                    <CustomInput
                        placeholder="Categories (comma separated)"
                        value={form.categories}
                        onChangeText={(text) => setForm((prev) => ({ ...prev, categories: text }))}
                        label="Categories"
                    />

                    <CustomInput
                        placeholder="Tags (comma separated)"
                        value={form.tags}
                        onChangeText={(text) => setForm((prev) => ({ ...prev, tags: text }))}
                        label="Tags"
                    />

                    <View className="flex-row gap-2 mb-4">
                        <TouchableOpacity
                            onPress={() => setForm((prev) => ({ ...prev, type: 'appetizer' }))}
                            className={`flex-1 p-2 rounded ${form.type === 'appetizer' ? 'bg-primary' : 'bg-gray-200'}`}
                        >
                            <Text className={`text-center ${form.type === 'appetizer' ? 'text-white' : 'text-gray-700'}`}>
                                Appetizer
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setForm((prev) => ({ ...prev, type: 'main_course' }))}
                            className={`flex-1 p-2 rounded ${form.type === 'main_course' ? 'bg-primary' : 'bg-gray-200'}`}
                        >
                            <Text className={`text-center ${form.type === 'main_course' ? 'text-white' : 'text-gray-700'}`}>
                                Main Course
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setForm((prev) => ({ ...prev, type: 'dessert' }))}
                            className={`flex-1 p-2 rounded ${form.type === 'dessert' ? 'bg-primary' : 'bg-gray-200'}`}
                        >
                            <Text className={`text-center ${form.type === 'dessert' ? 'text-white' : 'text-gray-700'}`}>
                                Dessert
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => setForm((prev) => ({ ...prev, is_featured: !prev.is_featured }))}
                        className={`p-2 rounded mb-4 ${form.is_featured ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                        <Text className={`text-center ${form.is_featured ? 'text-white' : 'text-gray-700'}`}>
                            {form.is_featured ? 'Featured Dish ✓' : 'Mark as Featured'}
                        </Text>
                    </TouchableOpacity>

                    <View className="flex-row gap-2">
                        <CustomButton
                            title={editingDish ? "Update Dish" : "Add Dish"}
                            isLoading={isSubmitting}
                            onPress={submit}
                        />
                        {editingDish && (
                            <CustomButton
                                title="Cancel"
                                onPress={resetForm}
                                style="bg-gray-500"
                            />
                        )}
                    </View>
                </>
            )}
        </View>
    )
}

export default DishManagement
