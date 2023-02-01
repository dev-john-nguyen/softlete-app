import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 14 18" xmlns="http://www.w3.org/2000/svg">
<path d="M11 6V16H3V6H11ZM9.5 0H4.5L3.5 1H0V3H14V1H10.5L9.5 0ZM13 4H1V16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4Z" />
</svg>`;

interface Props {
  fillColor?: string;
  size?: number;
  color?: string;
}

class TrashSvg extends React.Component<Props> {
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

export default TrashSvg;
