import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { CommonStyles } from '../../constants/commonStyles';
import { Colors, Spacing } from '../../constants/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'base',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    let buttonStyle = [CommonStyles.button];
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        buttonStyle.push(CommonStyles.buttonSecondary);
        break;
      case 'success':
        buttonStyle.push(CommonStyles.buttonSuccess);
        break;
      case 'warning':
        buttonStyle.push(CommonStyles.buttonWarning);
        break;
      case 'error':
        buttonStyle.push(CommonStyles.buttonError);
        break;
    }
    
    // Size styles
    if (size === 'small') {
      buttonStyle.push(CommonStyles.buttonSmall);
    } else if (size === 'large') {
      buttonStyle.push(CommonStyles.buttonLarge);
    }
    
    // Disabled styles
    if (disabled) {
      buttonStyle.push({ opacity: 0.5 });
    }
    
    // Custom styles
    if (style) {
      buttonStyle.push(style);
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleArray = [CommonStyles.buttonText];
    
    if (size === 'small') {
      textStyleArray.push(CommonStyles.buttonTextSmall);
    }
    
    if (variant === 'secondary') {
      textStyleArray.push(CommonStyles.buttonTextSecondary);
    }
    
    if (textStyle) {
      textStyleArray.push(textStyle);
    }
    
    return textStyleArray;
  };
  
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={variant === 'secondary' ? Colors.primary : Colors.textOnPrimary} />;
    }
    
    const iconSize = size === 'small' ? 14 : size === 'large' ? 18 : 16;
    
    const iconComponent = icon && (
      <AntDesign
        name={icon}
        size={iconSize}
        color={variant === 'secondary' ? Colors.primary : Colors.textOnPrimary}
        style={[
          CommonStyles.buttonIcon,
          iconPosition === 'right' && { marginRight: 0, marginLeft: Spacing.sm }
        ]}
      />
    );
    
    const textComponent = <Text style={getTextStyle()}>{title}</Text>;
    
    if (iconPosition === 'right') {
      return (
        <>
          {textComponent}
          {iconComponent}
        </>
      );
    }
    
    return (
      <>
        {iconComponent}
        {textComponent}
      </>
    );
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
