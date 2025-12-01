import type {
  AnimateComponentAnimationConfig,
  BaseTextProps,
  LayoutProps,
  RNPressableLayoutProps,
  TouchableLayoutProps,
} from '@shaquillehinds/react-native-essentials';
import type { ScrollViewProps } from 'react-native';

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
  isDisabled?: boolean;
  disableShadow?: boolean;
  expandDirection?: 'up' | 'down';
  expandDistance?: number;
  expandAnimationConfig?: AnimateComponentAnimationConfig;
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
  onOpen?: () => void;
  onClose?: () => void;
};
