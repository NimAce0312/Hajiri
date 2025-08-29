import React from 'react';
import { View, Text } from 'react-native';
import { CommonStyles } from '../../constants/commonStyles';

export const Card = ({
  children,
  style,
  contentStyle,
  ...props
}) => {
  return (
    <View style={[CommonStyles.card, style]} {...props}>
      <View style={contentStyle}>
        {children}
      </View>
    </View>
  );
};
