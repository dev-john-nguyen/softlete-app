import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 22 16" xmlns="http://www.w3.org/2000/svg">
<path d="M0 4.99977L2 6.99977C6.97 2.02977 15.03 2.02977 20 6.99977L22 4.99977C15.93 -1.07023 6.08 -1.07023 0 4.99977ZM8 12.9998L11 15.9998L14 12.9998C12.35 11.3398 9.66 11.3398 8 12.9998ZM4 8.99977L6 10.9998C8.76 8.23977 13.24 8.23977 16 10.9998L18 8.99977C14.14 5.13977 7.87 5.13977 4 8.99977Z" />
</svg>`;

interface Props {
  fillColor: string;
  size: number | string;
  color: string;
}

class NetworkSvg extends React.Component<Props, {}> {
  render() {
    return (
      <SvgXml
        xml={svg}
        width={this.props.size || '100%'}
        height={this.props.size || '100%'}
        fill={this.props.color || this.props.fillColor}
      />
    );
  }
}

export default NetworkSvg;
