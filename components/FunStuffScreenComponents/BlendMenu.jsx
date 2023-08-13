import React, { useState } from 'react';
import { Button, Menu, Text } from 'react-native-paper';
import { globalStyles } from '../../assets/globalStyles'; 

const BlendMenu = ({ blends, handleBlendSelection }) => {
  const [visible, setVisible] = useState(false);

  if (!blends || blends.length === 0) {
    return <Text>No blends available</Text>;
  }

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Button
          onPress={openMenu}
          mode="contained" 
          style={globalStyles.button} 
        >
          Select a blend
        </Button>
      }
    >
      {blends.map((blend) => (
        <Menu.Item
          key={blend.id.toString()}
          onPress={() => {
            handleBlendSelection(blend);
            closeMenu();
          }}
          title={blend.name}
          accessibilityLabel={`Select ${blend.name}`}
          accessibilityRole="menuitem"
        />
      ))}
    </Menu>
  );
};

export default BlendMenu;
