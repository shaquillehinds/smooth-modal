import { DragGesture } from '../gestures/Drag.gesture';
import {
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { bottomModalStyle as styles } from './bottomModal.styles';
import {
  bottomModalController,
  type BottomModalControllerReturn,
} from './bottomModal.controller';
import { type PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { type BottomModalAnimatedProps } from './bottomModal.types';
import { BlurView } from 'expo-blur';
import { Timer } from '../utils/Scheduler';
import { isAndroid } from '../utils/Layout.const';

export function BottomModal(
  props: PropsWithChildren<BottomModalAnimatedProps>
) {
  const [mounted, setMounted] = useState(false);
  const [justStop, setJustStop] = useState(false);

  const unMountTimer = useMemo(
    () =>
      new Timer(() => {
        setMounted((prev) => {
          if (prev) {
            props.onModalClose && props.onModalClose();
            return !prev;
          }
          return prev;
        });
      }, 300),
    []
  );

  useEffect(() => {
    if (justStop) {
      setJustStop(false);
      setMounted(false);
    } else if (!props.showModal) {
      unMountTimer.stop();
      unMountTimer.start();
    } else {
      if (mounted) {
        // Fixes out of sync and stuck modal by triggering an unmount
        // Basically if you get mounted twice the modal never properly unmounted
        props.setShowModal(false);
        setJustStop(true);
      } else {
        props.onModalShow && props.onModalShow();
        setMounted(true);
      }
    }
    return () => {
      unMountTimer.stop();
    };
  }, [props.showModal]);

  if (!mounted) return null;

  return <BottomModalAnimated {...props} />;
}

export function BottomModalAnimated(
  props: PropsWithChildren<BottomModalAnimatedProps>
) {
  const controller = bottomModalController(props);
  const PlatformView = isAndroid ? SafeAreaView : View;
  return (
    <>
      <TouchableWithoutFeedback onPress={controller.onModalBackdropPress}>
        <Animated.View
          style={[styles.backdrop, controller.backdropOpacityStyle]}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={15}
            tint={'dark'}
            experimentalBlurMethod="dimezisBlurView"
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      {props.disableSafeArea ? (
        <Modal {...props} controller={controller} />
      ) : (
        <PlatformView
          onLayout={controller.onPlatformViewLayout}
          style={styles.platformView}
        >
          <Modal {...props} controller={controller} />
        </PlatformView>
      )}
    </>
  );
}

function Modal(
  props: PropsWithChildren<BottomModalAnimatedProps> & {
    controller: BottomModalControllerReturn;
  }
) {
  const controller = props.controller;
  return (
    <Animated.View
      style={[
        styles.modal,
        props.style,
        { backgroundColor: props.backgroundColor },
        controller.dragAnimatedStyle,
      ]}
    >
      <DragGesture
        onDrag={controller.onDragGesture}
        onDragStart={controller.onDragStartGesture}
        onDragEnd={controller.onDragEndGesture}
      >
        <View
          style={[
            styles.bumperContainer,
            { backgroundColor: props.backgroundColor },
            props.bumperContainerStyle,
          ]}
        >
          <View style={[styles.bumper, props.bumperStyle]} />
        </View>
      </DragGesture>
      <Animated.View
        onLayout={controller.onModalContentLayout}
        style={[
          styles.contentContainer,
          controller.modalContentAnimatedStyle,
          props.contentContainerStyle,
        ]}
      >
        {props.children}
      </Animated.View>
    </Animated.View>
  );
}
