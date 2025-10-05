import { Image, View } from "react-native";
import { images } from "@/constants";

const Logo = () => (
  <View className="flex flex-row items-center gap-2">
    <Image source={images.logo} className="h-10 w-10" resizeMode="contain" />
  </View>
);

export default Logo;