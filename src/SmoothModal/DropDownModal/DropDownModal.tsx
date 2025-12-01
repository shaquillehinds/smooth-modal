import {
  AnimateComponent,
  BaseText,
  isAndroid,
  Layout,
  RNPressableLayout,
  shadowStyles,
  TouchableLayout,
} from '@shaquillehinds/react-native-essentials';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ComponentMounter,
  ModalForegroundWrapper,
  ModalWrapper,
} from '../components';
import { zIndex } from '../styles/styles.const';
import { ChevronUp } from '../svgs/ChevronUp';
import { DropDownModalController } from './DropDownModal.controller';
import type { DropDownModalProps } from './DropDownModal.types';
import { RadioIcon } from '../components/icons/Radio.icon';

export function DropDownModal<T>(props: DropDownModalProps<T>) {
  const controller = DropDownModalController(props);

  return (
    <Layout
      {...props.containerProps}
      style={[{ zIndex }, props.containerProps?.style]}
      onLayout={controller.handleLayout}
    >
      <ComponentMounter
        showComponent={controller.showItems}
        setShowComponent={controller.setShowItems}
        unMountDelayInMilliSeconds={controller.unMountDelayInMilliSeconds}
        onComponentShow={props.onOpen}
        onComponentClose={props.onClose}
        component={
          <ModalWrapper enableBackgroundContentPress>
            <ModalForegroundWrapper>
              <View
                style={
                  !props.disableShadow
                    ? { ...shadowStyles({ shadowOpacity: 0.15 }) }
                    : undefined
                }
              >
                {!props.disableShadow && isAndroid && (
                  <AnimateComponent
                    ref={controller.animateAndroidShadowRef}
                    initialPosition={0}
                    style={controller.androidShadowAnimatedStyle}
                    autoStart
                    toPosition={controller.androidShadowAnimationConfig}
                  />
                )}

                <ScrollView
                  ref={controller.scrollViewRef}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  overScrollMode="never"
                  {...props.dropdownScrollViewProps}
                  style={[
                    controller.scrollViewStyle,
                    props.dropdownScrollViewProps?.style,
                  ]}
                >
                  <AnimateComponent
                    ref={controller.animateComponentRef}
                    style={controller.selectionItemsListAnimatedStyle}
                    initialPosition={
                      controller.canRenderDown
                        ? -controller.relativeY(110)
                        : controller.relativeY(110)
                    }
                    autoStart
                    toPosition={
                      props.expandAnimationConfig
                        ? { ...props.expandAnimationConfig, toValue: 0 }
                        : controller.selectionItemsListAnimationConfig
                    }
                  >
                    <Layout
                      borderRadius="soft"
                      backgroundColor={'#FAFAFA'}
                      padding={
                        controller.canRenderDown ? [5, 0, 0, 0] : [0, 0, 5, 0]
                      }
                      {...props.dropdownContentContainerProps}
                    >
                      {props.items.map((item) =>
                        props.DropdownItemComponent ? (
                          <props.DropdownItemComponent
                            key={item.label}
                            item={item}
                            isSelected={item.value === props.selectedItem}
                          />
                        ) : (
                          <TouchableLayout
                            key={item.label}
                            flexDirection="row"
                            center
                            spaceBetween
                            padding={[1, 5]}
                            {...props.dropdownItemProps}
                            onPress={() => {
                              props.onSelect(item.value);
                              controller.setShowItems(false);
                              props.onDropdownItemPress?.(item);
                            }}
                          >
                            <Layout width={'85%'}>
                              <BaseText
                                numberOfLines={1}
                                {...props.dropdownItemTextProps}
                              >
                                {item.label}
                              </BaseText>
                            </Layout>
                            {item.value === props.selectedItem ? (
                              props.DropdownItemSelectedIcon ? (
                                <props.DropdownItemSelectedIcon item={item} />
                              ) : (
                                <RadioIcon isSelected={true} />
                              )
                            ) : null}
                          </TouchableLayout>
                        )
                      )}
                    </Layout>
                  </AnimateComponent>
                </ScrollView>
              </View>
            </ModalForegroundWrapper>
          </ModalWrapper>
        }
      />
      <RNPressableLayout
        disabled={props.isDisabled}
        activeOpacity={1}
        flexDirection="row"
        backgroundColor={'white'}
        borderRadius="medium"
        padding={[1, 5]}
        spaceBetween
        center
        {...props.dropdownButtonProps}
        style={[
          {
            zIndex: zIndex + 3,
            ...shadowStyles({ shadowOpacity: 0.1 }),
          },
          props.dropdownButtonProps?.style,
        ]}
        onPress={(e) => {
          controller.pageYRef.current = e.nativeEvent.pageY;
          controller.setShowItems((prev) => !prev);
          props.dropdownButtonProps?.onPress?.(e);
        }}
      >
        <BaseText numberOfLines={1} {...props.dropdownButtonTextProps}>
          {controller.label || props.placeholder || 'Select an item'}
        </BaseText>
        {props.DropdownButtonIcon ? (
          <props.DropdownButtonIcon
            isOpen={controller.showItems}
            expandDirection={
              props.expandDirection || controller.canRenderDown ? 'down' : 'up'
            }
          />
        ) : controller.canRenderDown === null ? undefined : (
          <AnimateComponent
            ref={controller.animateChevronRef}
            style={controller.chevronAnimatedStyle}
            initialPosition={controller.canRenderDown ? -1 : 1}
            toPosition={controller.chevronAnimationConfig}
          >
            <ChevronUp color={'black'} />
          </AnimateComponent>
        )}
      </RNPressableLayout>
    </Layout>
  );
}
