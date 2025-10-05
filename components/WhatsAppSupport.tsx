import { Linking, Pressable, Image } from "react-native";
import React from "react";
import { images } from "@/constants";

const WHATSAPP_NUMBER = "917624828106";

const WhatsAppSupport = () => {
  const handlePress = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}`;
    Linking.openURL(url).catch((error) => console.warn("Failed to open WhatsApp", error));
  };

  return (
    <Pressable
      accessibilityLabel="Chat with us on WhatsApp"
      onPress={handlePress}
      className="absolute bottom-6 right-6 z-50 rounded-full bg-white shadow-lg shadow-black/20"
      style={{ elevation: 6 }}
    >
      <Image source={images.whatsapp} className="h-14 w-14" resizeMode="contain" />
    </Pressable>
  );
};

export default WhatsAppSupport;