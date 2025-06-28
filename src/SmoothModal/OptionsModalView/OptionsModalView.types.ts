import type {
  BaseTextProps,
  LayoutProps,
} from '@shaquillehinds/react-native-essentials';
import type { ViewStyle } from 'react-native';

export interface OptionTitleTextProps extends BaseTextProps {
  fontSize?: 'titleS' | 'titleL';
}
export interface OptionBodyTextProps extends BaseTextProps {
  fontSize?: 'bodyS' | 'bodyL';
}

export type OptionInfo = {
  id?: string;
  title: string;
  subTitle?: string;
};

export type Option = {
  disableDismissOnOptionPress?: boolean;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  titleProps?: OptionTitleTextProps;
  subTitleProps?: OptionBodyTextProps;
  separatorStyle?: ViewStyle;
  onOptionPress: (
    optionInfo: OptionInfo & { index: number; dismiss: () => void }
  ) => void | Promise<void>;
} & OptionInfo &
  LayoutProps;

export type OptionsModalViewProps = {
  options: Option[];
} & LayoutProps;
