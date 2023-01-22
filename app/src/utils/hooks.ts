import { useMemo } from 'react';
import { StyleProp } from 'react-native';
import { moderateScale } from 'src/components/tools/StyleConstants';

export const useResizeStyles = (stylesProp: StyleProp<any>) => {
  const styles = useMemo(() => {
    Object.entries(stylesProp).forEach(([key, value]) => {
      if (typeof value === 'number') {
        stylesProp[key] = moderateScale(value);
      }
    });
    return stylesProp;
  }, [stylesProp]);
  return styles;
};
