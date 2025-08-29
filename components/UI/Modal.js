import React from 'react';
import { Modal, View, Text, TouchableWithoutFeedback } from 'react-native';
import { CommonStyles } from '../../constants/commonStyles';
import { Button } from './Button';

export const CustomModal = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  primaryAction,
  secondaryAction,
  closeOnOverlayPress = true,
  ...props
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <TouchableWithoutFeedback onPress={closeOnOverlayPress ? onClose : undefined}>
        <View style={CommonStyles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={CommonStyles.modalContent}>
              {title && (
                <Text style={CommonStyles.modalTitle}>{title}</Text>
              )}
              
              {subtitle && (
                <Text style={CommonStyles.modalSubtitle}>{subtitle}</Text>
              )}
              
              {children}
              
              {(primaryAction || secondaryAction) && (
                <View style={CommonStyles.modalButtons}>
                  {secondaryAction && (
                    <Button
                      {...secondaryAction}
                      variant={secondaryAction.variant || 'secondary'}
                      style={[CommonStyles.modalButton, secondaryAction.style]}
                    />
                  )}
                  
                  {primaryAction && (
                    <Button
                      {...primaryAction}
                      variant={primaryAction.variant || 'primary'}
                      style={[CommonStyles.modalButton, primaryAction.style]}
                    />
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
