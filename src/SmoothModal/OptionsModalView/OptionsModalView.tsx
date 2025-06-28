import {
  Body,
  hexOpacity,
  Layout,
  Press,
  relativeY,
  Title,
} from '@shaquillehinds/react-native-essentials';
import { SmoothSpotModal as SpotModal } from '../SpotModal';
import React from 'react';
import type { OptionsModalViewProps } from './OptionsModalView.types';
import { OptionsModalViewController } from './OptionsModalView.controller';
import { View, type ViewStyle } from 'react-native';

export function OptionsModalView({ options, ...props }: OptionsModalViewProps) {
  const controller = OptionsModalViewController();
  const containerStyle = { borderRadius: 15 };
  const subTitleColor = '#888888';
  const separatorColor = subTitleColor + hexOpacity(0.5);
  const optionStyle = {};
  return (
    <>
      <Press disableAnimation onPress={controller.onPress}>
        {props.children}
      </Press>
      <SpotModal
        pageX={controller.coord.pageX}
        pageY={controller.coord.pageY}
        showModal={controller.show}
        setShowModal={controller.setShow}
      >
        <Layout
          backgroundColor="white"
          padding={[1, 3]}
          center
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
                separatorStyle,
                ...rest
              },
              index: number
            ) => {
              const separatorStyles: ViewStyle = {
                height: 1,
                width: '100%',
                backgroundColor: separatorColor,
                marginVertical: relativeY(0.8),
              };
              return (
                <React.Fragment key={id || title}>
                  <Press
                    onPress={() => {
                      onOptionPress({ index, title, subTitle, id });
                    }}
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
