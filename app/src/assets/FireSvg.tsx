import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.5 6.00029C8.5 5.20875 9.55278 4.99895 9.83209 5.73957C10.5077 7.53109 11 9.13374 11 10.0002C11 12.7616 8.76142 15.0002 6 15.0002C3.23858 15.0002 1 12.7616 1 10.0002C1 9.06931 1.56822 7.28866 2.32156 5.33698C3.29743 2.80879 3.78536 1.54469 4.38767 1.4766C4.5804 1.45482 4.79066 1.49399 4.96261 1.58371C5.5 1.86413 5.5 3.24285 5.5 6.00029C5.5 6.82872 6.17157 7.50029 7 7.50029C7.82843 7.50029 8.5 6.82872 8.5 6.00029Z" stroke-width="2"/>
<path d="M5 15L4.73721 14.343C4.28159 13.204 4.47365 11.9079 5.24002 10.95V10.95C5.62964 10.463 6.37036 10.463 6.75998 10.95V10.95C7.52635 11.9079 7.71841 13.204 7.26279 14.343L7 15" stroke-width="2"/>
</svg>`;

interface Props {
  fillColor: string;
  color: string | number;
  size: number;
}

class FireSvg extends React.Component<Props> {
  render() {
    return (
      <SvgXml
        xml={svg}
        width={this.props.size || '100%'}
        height={this.props.size || '100%'}
        stroke={this.props.color || this.props.fillColor}
      />
    );
  }
}

export default FireSvg;
