interface ShadowStylesProps {
  shadowOffset?: { width: number; height: number };
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
}

export function shadowStyles(styles?: ShadowStylesProps) {
  return {
    shadowColor: styles?.shadowColor || 'black',
    shadowOpacity:
      typeof styles?.shadowOpacity !== 'number' ? 0.3 : styles.shadowOpacity,
    shadowRadius:
      typeof styles?.shadowRadius !== 'number' ? 20 : styles.shadowRadius,
    shadowOffset: {
      width:
        typeof styles?.shadowOffset?.width !== 'number'
          ? 0
          : styles.shadowOffset.width,
      height:
        typeof styles?.shadowOffset?.height !== 'number'
          ? 6
          : styles.shadowOffset.height,
    },
    elevation:
      typeof styles?.shadowRadius !== 'number' ? 20 : styles.shadowRadius,
  };
}
