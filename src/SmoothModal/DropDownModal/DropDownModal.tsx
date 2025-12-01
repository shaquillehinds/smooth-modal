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
import type { DropDownModalProps, DropDownValue } from './DropDownModal.types';

export function DropDownModal<T extends DropDownValue = DropDownValue>(
  props: DropDownModalProps<T>
) {
  const controller = DropDownModalController(props);

  return (
    <Layout style={{ zIndex }} onLayout={controller.handleLayout}>
      <ComponentMounter
        showComponent={controller.showItems}
        setShowComponent={controller.setShowItems}
        unMountDelayInMilliSeconds={300}
        component={
          <ModalWrapper enableBackgroundContentPress>
            <ModalForegroundWrapper>
              <View style={{ ...shadowStyles({ shadowOpacity: 0.15 }) }}>
                {isAndroid && (
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
                  style={controller.scrollViewStyle}
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
                    toPosition={controller.selectionItemsListAnimationConfig}
                  >
                    <Layout
                      borderRadius="soft"
                      backgroundColor={'#FAFAFA'}
                      padding={
                        controller.canRenderDown ? [5, 0, 0, 0] : [0, 0, 5, 0]
                      }
                    >
                      {props.items.map((item) => (
                        <TouchableLayout
                          key={item.label}
                          flexDirection="row"
                          center
                          spaceBetween
                          padding={[1, 5]}
                          onPress={() => {
                            props.onSelect(item.value);
                            controller.setShowItems(false);
                          }}
                        >
                          <Layout width={'85%'}>
                            <BaseText numberOfLines={1}>{item.label} </BaseText>
                          </Layout>
                          {item.value === props.selectedItem && (
                            <Layout
                              square={2}
                              center
                              centerX
                              borderRadius="full"
                              borderWidth="medium"
                              borderColor={'#4A87F2'}
                            >
                              <Layout
                                square={0.8}
                                borderRadius="full"
                                backgroundColor={'#4A87F2'}
                              />
                            </Layout>
                          )}
                        </TouchableLayout>
                      ))}
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
        style={{
          zIndex: zIndex + 3,
          ...shadowStyles({ shadowOpacity: 0.1 }),
        }}
        onPress={(e) => {
          controller.pageYRef.current = e.nativeEvent.pageY;
          controller.setShowItems((prev) => !prev);
        }}
        padding={[1, 5]}
        spaceBetween
        center
      >
        <BaseText numberOfLines={1}>
          {controller.label || props.placeholder || 'Select an item'}
        </BaseText>
        {controller.canRenderDown === null ? undefined : (
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
