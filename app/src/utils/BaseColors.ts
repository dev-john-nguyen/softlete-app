export default {
  primary: '#170001',
  lightPrimary: '#290000',
  primaryRgb: '23, 0, 1',
  lightWhite: '#FAFAFA',
  lightWhiteRgb: '250, 250, 250',
  black: '#250000',
  lightBlack: '#333333',
  secondary: '#C4C4C4',
  secondaryRgb: '196, 196, 196',
  white: '#FFFFFF',
  whiteRbg: '255, 255, 255',
  green: '#10b949',
  blue: '#10B9AF',
  blueRgb: '16, 185, 175',
  lightGreen: '#b7f0cb',
  greenRbg: '18, 206, 82',
  red: '#CE1212',
  medGrey: '#D9D9D9',
  lightGrey: '#E8E8E8',
  darkGrey: '#D9D9D9',
  yellow: '#F7FF00',
  primaryBoxShadow: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: '#000',
    elevation: 7,
  },
  lightBoxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
};

export function rgba(rgb: string, a: number) {
  return `rgba(${rgb},${a})`;
}
