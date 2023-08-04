import React, { useState } from 'react';
import { Button, Menu, Paragraph } from 'react-native-paper';

const BlendMenu = ({ blends, handleBlendSelection }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<Button onPress={openMenu}>Select a blend</Button>}
    >
      {blends.map((blend) => (
        <Menu.Item
          key={blend.id.toString()}
          onPress={() => {
            handleBlendSelection(blend);
            closeMenu();
          }}
          title={blend.name}
        />
      ))}
    </Menu>
  );
};

export default BlendMenu;
