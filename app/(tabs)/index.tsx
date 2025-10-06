import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, Text, TouchableOpacity, View, TextInput, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { router } from "expo-router";

import CartButton from "@/components/CartButton";
import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import WhatsAppSupport from "@/components/WhatsAppSupport";
import { Restaurant } from "@/type";
import { getRestaurants } from "@/lib/appwrite";

const categories = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'indian', name: 'Indian', icon: '🇮🇳' },
  { id: 'chinese', name: 'Chinese', icon: '🇨🇳' },
  { id: 'italian', name: 'Italian', icon: '🇮🇹' },
  { id: 'fast-food', name: 'Fast Food', icon: '🍔' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
];

export default function Index() {
  const { user } = useAuthStore();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const searchAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchQuery, selectedCategory]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const restaurantsData = await getRestaurants();
      setRestaurants(restaurantsData as Restaurant[]);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisine_types.some(cuisine =>
          cuisine.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine_types.some(cuisine =>
          cuisine.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredRestaurants(filtered);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    Animated.timing(searchAnimation, {
      toValue: showSearch ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const searchHeight = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-lg mx-4 mb-4 overflow-hidden transform transition-transform active:scale-95"
      onPress={() => router.push(`/restaurant/${item.$id}`)}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: item.image_url || 'https://via.placeholder.com/300x200' }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full">
          <Text className="text-sm font-bold text-gray-800">⭐ {item.rating.toFixed(1)}</Text>
        </View>
        <View className="absolute top-3 left-3">
          <View className={`px-2 py-1 rounded-full ${item.is_open ? 'bg-green-500' : 'bg-red-500'}`}>
            <Text className="text-white text-xs font-medium">
              {item.is_open ? '● Open' : '● Closed'}
            </Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        <Text className="text-xl font-bold text-gray-900 mb-2">{item.name}</Text>
        <Text className="text-gray-600 text-sm mb-3 leading-5">{item.description}</Text>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-500 text-sm">{item.address}</Text>
          <View className="flex-row gap-1">
            {item.cuisine_types.slice(0, 2).map((cuisine, index) => (
              <View key={index} className="bg-orange-100 px-2 py-1 rounded-full">
                <Text className="text-orange-800 text-xs font-medium">{cuisine}</Text>
              </View>
            ))}
            {item.cuisine_types.length > 2 && (
              <View className="bg-gray-100 px-2 py-1 rounded-full">
                <Text className="text-gray-600 text-xs">+{item.cuisine_types.length - 2}</Text>
              </View>
            )}
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">View Menu</Text>
          </TouchableOpacity>
          <Text className="text-gray-500 text-sm">
            📞 {item.phone}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-3 mx-2 rounded-full ${
        selectedCategory === item.id ? 'bg-primary' : 'bg-gray-100'
      }`}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text className="text-lg mr-2">{item.icon}</Text>
      <Text className={`font-medium ${selectedCategory === item.id ? 'text-white' : 'text-gray-700'}`}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <GlobalHeader subtitle={user ? `Welcome back, ${user.name.split(" ")[0]}!` : "Discover delicious meals"} />

      {/* Search Bar */}
      <Animated.View style={{ height: searchHeight, opacity: searchAnimation }} className="px-4 mb-4">
        <View className="bg-white rounded-xl shadow-sm flex-row items-center px-4 py-3">
          <Text className="text-gray-400 mr-3">🔍</Text>
          <TextInput
            placeholder="Search restaurants, cuisines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-gray-700"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text className="text-gray-400 ml-2">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Categories */}
      <View className="mb-4">
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      {/* Featured Section */}
      <View className="mb-6 px-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">Featured Restaurants</Text>
          <TouchableOpacity onPress={toggleSearch}>
            <Text className="text-primary font-medium">🔍 Search</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-lg text-gray-600">Loading restaurants...</Text>
          </View>
        ) : filteredRestaurants.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-lg text-gray-600 mb-2">No restaurants found</Text>
            <Text className="text-gray-400 text-sm">Try adjusting your search or filters</Text>
          </View>
        ) : (
          <FlatList
            data={filteredRestaurants}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.$id}
            contentContainerClassName="pb-28"
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <GlobalFooter />
      <WhatsAppSupport />
    </SafeAreaView>
  );
}
