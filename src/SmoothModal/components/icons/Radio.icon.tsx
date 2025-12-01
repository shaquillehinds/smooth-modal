import {
  Layout,
  type BorderSize,
} from '@shaquillehinds/react-native-essentials';

export function RadioIcon({
  isSelected = false,
  selectedColor = '#4A87F2',
  unSelectedColor = '#D9D9D9',
  size = 2,
  borderWidth = 'medium',
}: {
  isSelected?: boolean;
  selectedColor?: string;
  unSelectedColor?: string;
  size?: number;
  borderWidth?: BorderSize;
}) {
  return (
    <Layout
      square={size}
      center
      centerX
      borderRadius="full"
      borderWidth={borderWidth}
      borderColor={isSelected ? selectedColor : unSelectedColor}
    >
      <Layout
        square={size / 2.5}
        borderRadius="full"
        backgroundColor={isSelected ? selectedColor : unSelectedColor}
      />
    </Layout>
  );
}
