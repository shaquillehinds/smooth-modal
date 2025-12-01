import type {
  BaseTextProps,
  LayoutProps,
  RNPressableLayoutProps,
  TouchableLayoutProps,
} from '@shaquillehinds/react-native-essentials';
import type { Animated, ScrollViewProps } from 'react-native';

export type DropDownItemValue<T> = T;

export type DropDownItem<T> = {
  label: string;
  value: DropDownItemValue<T>;
};
export type DropDownModalProps<T> = {
  items: DropDownItem<T>[];
  selectedItem: T;
  onSelect: (item: T) => void;
  placeholder: string;
  onOpen?: () => void;
  onClose?: () => void;
  unMountDelayInMilliSeconds?: number;
  isDisabled?: boolean;
  disableShadow?: boolean;
  expandDirection?: 'up' | 'down';
  expandDistance?: number;
  expandAnimationConfig?:
    | (Omit<Animated.TimingAnimationConfig, 'toValue'> & { type: 'timing' })
    | (Omit<Animated.SpringAnimationConfig, 'toValue'> & { type: 'spring' });
  containerProps?: LayoutProps;
  dropdownButtonProps?: RNPressableLayoutProps;
  dropdownButtonTextProps?: BaseTextProps;
  //prettier-ignore
  DropdownButtonIcon?: (props: { isOpen: boolean, expandDirection: 'up' | 'down' }) => React.JSX.Element;
  dropdownScrollViewProps?: ScrollViewProps;
  dropdownContentContainerProps?: LayoutProps;
  //prettier-ignore
  DropdownItemComponent?: (props: {item: DropDownItem<T>, isSelected: boolean }) => React.JSX.Element;
  onDropdownItemPress?: (item: DropDownItem<T>) => void;
  dropdownItemProps?: TouchableLayoutProps;
  dropdownItemTextProps?: BaseTextProps;
  //prettier-ignore
  DropdownItemSelectedIcon?: (props: {item: DropDownItem<T>}) => React.JSX.Element;
};
