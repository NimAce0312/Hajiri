import React, { useState } from 'react';
import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import { CommonStyles } from '../../constants/commonStyles';
import { Colors, Spacing } from '../../constants/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  secureTextEntry,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  icon,
  iconPosition = 'left',
  onIconPress,
  editable = true,
  style,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);

  const getInputStyle = () => {
    let inputStyle = [CommonStyles.input];
    
    if (isFocused) {
      inputStyle.push(CommonStyles.inputFocused);
    }
    
    if (error) {
      inputStyle.push(CommonStyles.inputError);
    }
    
    if (!editable) {
      inputStyle.push({ backgroundColor: Colors.surfaceSecondary, color: Colors.textTertiary });
    }
    
    if (multiline) {
      inputStyle.push({ height: 'auto', minHeight: 80, textAlignVertical: 'top' });
    }
    
    if (icon) {
      if (iconPosition === 'left') {
        inputStyle.push({ paddingLeft: 40 });
      } else {
        inputStyle.push({ paddingRight: 40 });
      }
    }
    
    if (secureTextEntry) {
      inputStyle.push({ paddingRight: 40 });
    }
    
    if (style) {
      inputStyle.push(style);
    }
    
    return inputStyle;
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 12,
          [iconPosition]: 12,
          zIndex: 1,
        }}
        onPress={onIconPress}
        disabled={!onIconPress}
      >
        <AntDesign
          name={icon}
          size={20}
          color={isFocused ? Colors.primary : Colors.textTertiary}
        />
      </TouchableOpacity>
    );
  };

  const renderSecureIcon = () => {
    if (!secureTextEntry) return null;
    
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1,
        }}
        onPress={() => setIsSecureVisible(!isSecureVisible)}
      >
        <AntDesign
          name={isSecureVisible ? 'eyeo' : 'eye'}
          size={20}
          color={Colors.textTertiary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[{ marginBottom: Spacing.base }, containerStyle]}>
      {label && (
        <Text style={CommonStyles.inputLabel}>{label}</Text>
      )}
      
      <View style={{ position: 'relative' }}>
        {renderIcon()}
        
        <TextInput
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={editable}
          {...props}
        />
        
        {renderSecureIcon()}
      </View>
      
      {error ? (
        <Text style={CommonStyles.inputErrorText}>{error}</Text>
      ) : helperText ? (
        <Text style={CommonStyles.inputHelperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};
