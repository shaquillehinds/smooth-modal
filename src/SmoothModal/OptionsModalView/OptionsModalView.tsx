import {
  Body,
  hexOpacity,
  Layout,
  Press,
  Title,
} from '@shaquillehinds/react-native-essentials';
import { SmoothSpotModal as SpotModal } from '../SpotModal';
import React from 'react';
import type { OptionsModalViewProps } from './OptionsModalView.types';
import { OptionsModalViewController } from './OptionsModalView.controller';
import { View, type ViewStyle } from 'react-native';

export function OptionsModalView<
  Scrollable extends boolean | undefined = undefined,
>({
  onPress,
  onLongPress,
  disableNativeModal,
  disablePortal,
  children,
  options,
  separatorStyle,
  disableDismissOnPress,
  activateOn = 'press',
  ...props
}: OptionsModalViewProps<Scrollable>) {
  const controller = OptionsModalViewController({ onPress, onLongPress });
  const overflow: 'hidden' | undefined = props.scrollable
    ? 'hidden'
    : undefined;
  const containerStyle = {
    borderRadius: 15,
    backgroundColor: props.backgroundColor,
    overflow,
  };
  const subTitleColor = '#888888';
  const separatorColor = subTitleColor + hexOpacity(0.5);
  const optionStyle = {};
  return (
    <>
      <Press
        disableAnimation
        stopPropagation
        onPress={activateOn === 'press' ? controller.onPress : undefined}
        onLongPress={
          activateOn === 'long-press' ? controller.onLongPress : undefined
        }
      >
        {children}
      </Press>
      <SpotModal
        pageX={controller.coord.pageX}
        pageY={controller.coord.pageY}
        showModal={controller.show}
        setShowModal={controller.setShow}
        disableNativeModal={disableNativeModal}
        disablePortal={disablePortal}
      >
        <Layout
          padding={[2, 5]}
          {...props}
          style={[containerStyle, props.style]}
        >
          {options.map(
            (
              {
                title,
                id,
                subTitle,
                titleProps,
                subTitleProps,
                leftComponent,
                rightComponent,
                onOptionPress,
                onOptionLongPress,
                disableDismissOnOptionPress,
                ...rest
              },
              index: number
            ) => {
              const separatorStyles: ViewStyle = {
                height: 1,
                width: '100%',
                backgroundColor: separatorColor,
                marginVertical: controller.relativeY(2),
              };
              return (
                <React.Fragment key={id || title}>
                  <Press
                    onPress={
                      onOptionPress
                        ? () => {
                            if (
                              !disableDismissOnOptionPress &&
                              !disableDismissOnPress
                            ) {
                              controller.setShow(false);
                            }
                            onOptionPress({
                              index,
                              title,
                              subTitle,
                              id,
                              dismiss: () => controller.setShow(false),
                            });
                          }
                        : undefined
                    }
                    onLongPress={
                      onOptionLongPress
                        ? () => {
                            if (
                              !disableDismissOnOptionPress &&
                              !disableDismissOnPress
                            ) {
                              controller.setShow(false);
                            }
                            onOptionLongPress({
                              index,
                              title,
                              subTitle,
                              id,
                              dismiss: () => controller.setShow(false),
                            });
                          }
                        : undefined
                    }
                  >
                    <Layout
                      flexDirection="row"
                      center
                      {...rest}
                      style={[optionStyle, rest.style]}
                    >
                      {leftComponent}
                      <View>
                        <Title {...titleProps}>{title}</Title>
                        {subTitle ? (
                          <Body
                            customColor={subTitleColor}
                            fontSize="bodyL"
                            {...subTitleProps}
                          >
                            {subTitle}
                          </Body>
                        ) : undefined}
                      </View>
                      {rightComponent}
                    </Layout>
                  </Press>
                  {index !== options.length - 1 ? (
                    <View style={[separatorStyles, separatorStyle]} />
                  ) : undefined}
                </React.Fragment>
              );
            }
          )}
        </Layout>
      </SpotModal>
    </>
  );
}
