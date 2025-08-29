import React from 'react';
import { View, Text } from 'react-native';
import { CommonStyles } from '../../constants/commonStyles';

export const Card = ({
  title,
  subtitle,
  children,
  style,
  headerStyle,
  contentStyle,
  showHeader = true,
  ...props
}) => {
  return (
    <View style={[CommonStyles.card, style]} {...props}>
      {showHeader && (title || subtitle) && (
        <View style={[CommonStyles.cardHeader, headerStyle]}>
          {title && (
            <Text style={CommonStyles.cardTitle}>{title}</Text>
          )}
          {subtitle && (
            <Text style={CommonStyles.cardSubtitle}>{subtitle}</Text>
          )}
        </View>
      )}
      
      <View style={contentStyle}>
        {children}
      </View>
    </View>
  );
};
