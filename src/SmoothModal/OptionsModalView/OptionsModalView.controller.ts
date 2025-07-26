import type { GestureResponderNativeEventSnapshot } from '@shaquillehinds/react-native-essentials';
import { useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { OptionsModalViewProps } from './OptionsModalView.types';

export function OptionsModalViewController(
  props: Pick<OptionsModalViewProps, 'onPress' | 'onLongPress'>
) {
  const [show, setShow] = useState(false);
  const [coord, setCoord] = useState({ pageX: 0, pageY: 0 });
  const onPress = (e: GestureResponderEvent) => {
    props.onPress?.();
    setCoord({ pageX: e.nativeEvent.pageX, pageY: e.nativeEvent.pageY });
    setShow(true);
  };
  const onLongPress = (snapshot: GestureResponderNativeEventSnapshot) => {
    props.onLongPress?.();
    setCoord({ pageX: snapshot.pageX, pageY: snapshot.pageY });
    setShow(true);
  };

  return {
    show,
    setShow,
    coord,
    onPress,
    onLongPress,
  };
}
