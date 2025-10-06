import {View, Text, Alert} from 'react-native'
import {useState, useEffect} from "react";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import useAuthStore from "@/store/auth.store";
import {Restaurant} from "@/type";
import {createRestaurant, getRestaurantsByOwner} from "@/lib/appwrite";

const RestaurantDashboard = () => {
    const { user } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        cuisine_types: '',
        image_url: ''
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
            setRestaurants(userRestaurants);
        } catch (error: any) {
            Alert.alert('Error', 'Failed to load restaurants');
        }
    };

    const submit = async () => {
        if (!user?.$id) return;

        const { name, description, address, phone, email, cuisine_types, image_url } = form;

        if(!name || !description || !address || !phone || !email) {
            return Alert.alert('Error', 'Please fill in all required fields.');
        }

        setIsSubmitting(true);

        try {
            await createRestaurant({
                name,
                description,
                address,
                phone,
                email,
                owner_id: user.$id,
                rating: 0,
                cuisine_types: cuisine_types.split(',').map(type => type.trim()),
                is_open: true,
                image_url: image_url || 'https://via.placeholder.com/400x200',
                opening_hours: {
                    monday: { open: '09:00', close: '22:00', closed: false },
                    tuesday: { open: '09:00', close: '22:00', closed: false },
                    wednesday: { open: '09:00', close: '22:00', closed: false },
                    thursday: { open: '09:00', close: '22:00', closed: false },
                    friday: { open: '09:00', close: '22:00', closed: false },
                    saturday: { open: '09:00', close: '22:00', closed: false },
                    sunday: { open: '09:00', close: '22:00', closed: false },
                }
            });

            Alert.alert('Success', 'Restaurant created successfully!');
            setForm({
                name: '',
                description: '',
                address: '',
                phone: '',
                email: '',
                cuisine_types: '',
                image_url: ''
            });
            loadRestaurants();
        } catch(error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (user?.user_type !== 'restaurant_owner') {
        return (
            <View className="flex-1 justify-center items-center p-5">
                <Text className="text-lg text-gray-600">Access denied. This page is for restaurant owners only.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-5 bg-white">
            <Text className="text-2xl font-bold mb-5 text-center">Restaurant Dashboard</Text>

            {restaurants.length > 0 && (
                <View className="mb-5">
                    <Text className="text-lg font-semibold mb-3">Your Restaurants</Text>
                    {restaurants.map((restaurant) => (
                        <View key={restaurant.$id} className="bg-gray-100 p-3 rounded-lg mb-3">
                            <Text className="font-bold">{restaurant.name}</Text>
                            <Text className="text-gray-600">{restaurant.description}</Text>
                            <Text className="text-gray-600">{restaurant.address}</Text>
                        </View>
                    ))}
                </View>
            )}

            <Text className="text-lg font-semibold mb-3">Add New Restaurant</Text>

            <CustomInput
                placeholder="Restaurant Name"
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                label="Restaurant Name"
            />

            <CustomInput
                placeholder="Description"
                value={form.description}
                onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
                label="Description"
                multiline
            />

            <CustomInput
                placeholder="Address"
                value={form.address}
                onChangeText={(text) => setForm((prev) => ({ ...prev, address: text }))}
                label="Address"
            />

            <CustomInput
                placeholder="Phone"
                value={form.phone}
                onChangeText={(text) => setForm((prev) => ({ ...prev, phone: text }))}
                label="Phone"
                keyboardType="phone-pad"
            />

            <CustomInput
                placeholder="Email"
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                label="Email"
                keyboardType="email-address"
            />

            <CustomInput
                placeholder="Cuisine Types (comma separated)"
                value={form.cuisine_types}
                onChangeText={(text) => setForm((prev) => ({ ...prev, cuisine_types: text }))}
                label="Cuisine Types"
            />

            <CustomInput
                placeholder="Image URL (optional)"
                value={form.image_url}
                onChangeText={(text) => setForm((prev) => ({ ...prev, image_url: text }))}
                label="Image URL"
            />

            <CustomButton
                title="Create Restaurant"
                isLoading={isSubmitting}
                onPress={submit}
            />
        </View>
    )
}

export default RestaurantDashboard
