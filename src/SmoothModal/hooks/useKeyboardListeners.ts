import { useEffect } from 'react';
import {
  Keyboard,
  type EmitterSubscription,
  type KeyboardEventListener,
  type KeyboardEventName,
} from 'react-native';

type UseKeyboardListenersProps = {
  listeners: Partial<Record<KeyboardEventName, KeyboardEventListener>>;
  subscribeCondition?: () => boolean;
};

export function useKeyboardListeners(props: UseKeyboardListenersProps) {
  useEffect(() => {
    if (
      !props.subscribeCondition ||
      (props.subscribeCondition && props.subscribeCondition())
    ) {
      const subscriptions: EmitterSubscription[] = [];
      for (const keyboardListener in props.listeners) {
        const listenerName = keyboardListener as KeyboardEventName;
        const listener = props.listeners[listenerName];
        if (!listener) continue;
        subscriptions.push(Keyboard.addListener(listenerName, listener));
      }
      return () => {
        for (const subscription of subscriptions) subscription.remove();
      };
    }
    return () => {};
  }, []);
}
