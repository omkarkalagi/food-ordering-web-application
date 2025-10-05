import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import Logo from "@/components/Logo";
import NavigationMenu from "@/components/navigation/NavigationMenu";

interface GlobalHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

const GlobalHeader = ({ title, subtitle, showBackButton }: GlobalHeaderProps) => {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white">
      <View className="px-5 py-3 flex flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {showBackButton && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              className="rounded-full bg-primary/10 p-2"
            >
              <Image source={images.arrowBack} className="h-5 w-5" resizeMode="contain" />
            </Pressable>
          )}
          <Logo />
          <View>
            {title ? (
              <Text className="text-lg font-quicksand-bold text-dark-100">{title}</Text>
            ) : (
              <Text className="text-lg font-quicksand-bold text-dark-100">Feastly</Text>
            )}
            {subtitle && <Text className="text-sm font-quicksand-medium text-gray-100">{subtitle}</Text>}
          </View>
        </View>

        <View className="flex-row items-center gap-5">
          <NavigationMenu />
          <Pressable accessibilityRole="button" onPress={() => router.push("/search")}
            className="rounded-full bg-dark-100/5 p-2">
            <Image source={images.search} className="h-5 w-5" resizeMode="contain" />
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push("/(tabs)/profile")}
            className="rounded-full bg-dark-100/5 p-2">
            <Image source={images.person} className="h-5 w-5" resizeMode="contain" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GlobalHeader;