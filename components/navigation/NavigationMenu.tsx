import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface Props {
  onOpen?: () => void;
}

const NavigationMenu: React.FC<Props> = ({ onOpen }) => {
  return (
    <Pressable onPress={onOpen} accessibilityLabel="Open navigation">
      <View style={{ padding: 8 }}>
        <Text>Menu</Text>
      </View>
    </Pressable>
  );
};

export default NavigationMenu;
