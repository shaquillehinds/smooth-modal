import { useCallback, useRef } from 'react';
import { useKeyboardListeners } from '../../hooks/useKeyboardListeners';
import * as Layout from '../../utils/Layout.const';
import { runOnUI, type SharedValue, withTiming } from 'react-native-reanimated';
import {
  closeKeyboardTimingConfig,
  openKeyboardTimingConfig,
} from '../config/bottomSheetModal.constants';
import { type KeyboardEvent, type TextInput } from 'react-native';
import { wait } from '../../utils/wait';

type UseKeyboardAnimationProps = {
  avoidKeyboard?: boolean;
  inputsForKeyboardToAvoid?: React.RefObject<TextInput>[];
  keyboardHeight: SharedValue<number>;
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  modalContentTranslateY: SharedValue<number>;
  setDisableLayoutAnimation: (bool: boolean) => void;
};

export function keyboardAnimationController(props: UseKeyboardAnimationProps) {
  const {
    translationY,
    prevTranslationY,
    modalContentTranslateY,
    keyboardHeight,
  } = props;

  const keyboardHeightRef = useRef(0);

  const setKeyboardHeight = useCallback((height: number) => {
    keyboardHeight.value = height;
    keyboardHeightRef.current = height;
  }, []);

  const adjustForKeyboardHeight = useCallback(
    (currentKeyboardHeight: number, previousKeyboardHeight: number) => {
      'worklet';
      const maxModalY = Layout.SCREEN_HEIGHT * -1;
      if (currentKeyboardHeight > 10) {
        if (translationY.value <= maxModalY) {
          modalContentTranslateY.value = withTiming(
            -currentKeyboardHeight,
            openKeyboardTimingConfig
          );
        } else {
          const maxGap = maxModalY - translationY.value;
          const height = translationY.value - currentKeyboardHeight;
          if (height < maxModalY) {
            const modalShift = translationY.value + maxGap;
            translationY.value = withTiming(
              modalShift,
              openKeyboardTimingConfig
            );
            prevTranslationY.value = modalShift;
            modalContentTranslateY.value = withTiming(
              -currentKeyboardHeight - maxGap,
              openKeyboardTimingConfig
            );
          } else {
            translationY.value = withTiming(height, openKeyboardTimingConfig);
            prevTranslationY.value = height;
          }
        }
      } else {
        const newTranslationY =
          translationY.value +
          (previousKeyboardHeight + modalContentTranslateY.value);
        translationY.value = withTiming(
          newTranslationY,
          closeKeyboardTimingConfig
        );
        prevTranslationY.value = newTranslationY;
        modalContentTranslateY.value = withTiming(0, closeKeyboardTimingConfig);
      }
    },
    []
  );

  const keyBoardShowListener = useCallback(
    async (e: KeyboardEvent, shouldAdjust?: boolean) => {
      await wait(10);
      if (keyboardHeightRef.current) return;
      setKeyboardHeight(e.endCoordinates.height);
      if (!shouldAdjust) return;
      if (
        props.inputsForKeyboardToAvoid &&
        !props.inputsForKeyboardToAvoid.find((input) => {
          return input.current?.isFocused();
        })
      )
        return;
      props.setDisableLayoutAnimation(true);
      runOnUI(adjustForKeyboardHeight)(keyboardHeightRef.current, 0);
    },
    []
  );

  const keyboardHideListener = useCallback(async (shouldAdjust?: boolean) => {
    if (!keyboardHeightRef.current) return;
    const previousKeyboardHeight = keyboardHeightRef.current;
    setKeyboardHeight(0);
    if (!shouldAdjust) return;
    props.setDisableLayoutAnimation(false);
    runOnUI(adjustForKeyboardHeight)(
      keyboardHeightRef.current,
      previousKeyboardHeight
    );
  }, []);

  const shouldAdjustForKeyboard = !!(
    props.avoidKeyboard || props.inputsForKeyboardToAvoid?.length
  );
  useKeyboardListeners({
    listeners: {
      keyboardWillShow: (e) => {
        Layout.isIOS && keyBoardShowListener(e, shouldAdjustForKeyboard);
      },
      keyboardWillHide: () => {
        Layout.isIOS && keyboardHideListener(shouldAdjustForKeyboard);
      },
      keyboardDidShow: (e) => {
        Layout.isAndroid && keyBoardShowListener(e, shouldAdjustForKeyboard);
      },
      keyboardDidHide: async () => {
        Layout.isAndroid && keyboardHideListener(shouldAdjustForKeyboard);
      },
    },
    subscribeCondition: () => true,
  });
}
