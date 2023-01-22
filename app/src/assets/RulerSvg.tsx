import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 22 12" xmlns="http://www.w3.org/2000/svg">
<path d="M20 0H2C0.9 0 0 0.9 0 2V10C0 11.1 0.9 12 2 12H20C21.1 12 22 11.1 22 10V2C22 0.9 21.1 0 20 0ZM20 10H2V2H4V6H6V2H8V6H10V2H12V6H14V2H16V6H18V2H20V10Z" />
</svg>
`;

interface Props {
  fillColor: string;
  color: string;
  size: number | string;
}

class RulerSvg extends React.Component<Props, {}> {
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

export default RulerSvg;
