import React from 'react';
import { FloatingAction } from 'react-native-floating-action';

const BlendMenu = ({ blends, handleBlendSelection }) => {
  return (
    <FloatingAction
      actions={blends.map((blend) => ({
        text: blend.name,
        name: blend.id.toString(),
      }))}
      onPressItem={name => {
        const blend = blends.find(blend => blend.id.toString() === name);
        handleBlendSelection(blend);
      }}
    />
  );
};

export default BlendMenu;
