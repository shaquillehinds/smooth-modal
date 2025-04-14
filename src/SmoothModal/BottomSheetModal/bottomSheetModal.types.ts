import React from 'react';
import { type StyleProp, type TextInput, type ViewStyle } from 'react-native';
import { type ModalWrapperProps } from '../components/Modal.wrapper';

export type BottomSheetProps = {
  showModal: boolean;
  setShowModal:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((bool: boolean) => void);

  dragArea?: 'full' | 'bumper' | 'none';

  avoidKeyboard?: boolean;

  onModalShow?: () => Promise<void> | void;
  onModalClose?: () => Promise<void> | void;

  style?: StyleProp<ViewStyle>;
  bumperStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  bumperContainerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  inputsForKeyboardToAvoid?: React.RefObject<TextInput>[];
};

export type BottomSheetModalProps = {
  BackdropComponent?: React.ReactNode;
  disableCloseOnBackdropPress?: boolean;
} & BottomSheetProps &
  ModalWrapperProps;
