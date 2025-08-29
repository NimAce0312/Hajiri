import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Layout } from '../../constants/theme';

const Toast = ({ visible, message, type = 'info', duration = 3000, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) onHide();
    });
  };

  if (!visible) return null;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'warning':
        return styles.warningToast;
      default:
        return styles.infoToast;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'checkcircle';
      case 'error':
        return 'closecircle';
      case 'warning':
        return 'exclamationcircle';
      default:
        return 'infocirlce';
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        getToastStyle(),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.toastContent}>
        <AntDesign name={getIcon()} size={20} color={Colors.textOnDark} style={styles.toastIcon} />
        <Text style={styles.toastText} numberOfLines={2}>
          {message}
        </Text>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <AntDesign name="close" size={16} color={Colors.textOnDark} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: (Spacing.base * 2) + Layout.buttonHeight.sm + 1 + Spacing.sm,
    left: Spacing.base,
    right: Spacing.base,
    zIndex: 1000,
    borderRadius: BorderRadius.base,
    ...Shadows.lg,
  },
  
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    paddingVertical: Spacing.md,
  },
  
  toastIcon: {
    marginRight: Spacing.sm,
  },
  
  toastText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textOnDark,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  
  closeButton: {
    marginLeft: Spacing.sm,
    padding: 2,
  },
  
  infoToast: {
    backgroundColor: Colors.primary,
  },
  
  successToast: {
    backgroundColor: Colors.success,
  },
  
  errorToast: {
    backgroundColor: Colors.error,
  },
  
  warningToast: {
    backgroundColor: Colors.warning,
  },
});

export default Toast;
