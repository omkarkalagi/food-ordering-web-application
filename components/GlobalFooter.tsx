import { Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const footerLinks = [
  {
    title: "Explore",
    items: [
      { label: "Home", href: "/" },
      { label: "Menu", href: "/menu" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", href: "/support" },
      { label: "Delivery Info", href: "/delivery" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Community",
    items: [
      { label: "Testimonials", href: "/testimonials" },
      { label: "Blog", href: "/blog" },
      { label: "Gift Cards", href: "/gift-cards" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
];

const PHONE_NUMBER = "+917624828106";

const GlobalFooter = () => {
  const handleLinkPress = (href: string) => {
    Linking.openURL(`https://example.com${href}`);
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${PHONE_NUMBER}`).catch((error) =>
      console.warn("Failed to initiate phone call", error)
    );
  };

  return (
    <SafeAreaView className="bg-dark-100">
      <View className="px-6 py-10">
        <View className="flex-row flex-wrap gap-10 mb-8">
          {footerLinks.map((group) => (
            <View key={group.title} className="min-w-[120px]">
              <Text className="text-white text-lg font-quicksand-bold mb-3">{group.title}</Text>
              <View className="gap-2">
                {group.items.map((item) => (
                  <Pressable key={item.label} onPress={() => handleLinkPress(item.href)}>
                    <Text className="text-white/80 text-base font-quicksand-medium">
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View className="border-t border-white/10 pt-6 flex-row flex-wrap items-center justify-between gap-4">
          <View className="gap-1">
            <Text className="text-white/70 font-quicksand-medium">
              © {new Date().getFullYear()} Feastly Foods. All rights reserved.
            </Text>
            <Pressable accessibilityRole="button" onPress={handlePhonePress}>
              <Text className="text-white font-quicksand-semibold">
                Call us: {PHONE_NUMBER}
              </Text>
            </Pressable>
          </View>
          <Text className="text-white/70 font-quicksand-medium text-right">
            Crafted with passion in Bengaluru, India.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GlobalFooter;