import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="10" cy="8" r="3" stroke-linecap="round"/>
<circle cx="10" cy="10" r="9"/>
<path d="M16 16.7059C15.6461 15.6427 14.8662 14.7033 13.7814 14.0332C12.6966 13.3632 11.3674 13 10 13C8.6326 13 7.30341 13.3632 6.21858 14.0332C5.13375 14.7033 4.35391 15.6427 4 16.7059" stroke-linecap="round"/>
</svg>`;

interface Props {
  strokeColor: string;
  size?: number;
  color?: string;
}

class PersonSvg extends React.Component<Props> {
  render() {
    return (
      <SvgXml
        xml={svg}
        width={this.props.size || '100%'}
        height={this.props.size || '100%'}
        stroke={this.props.color || this.props.strokeColor}
      />
    );
  }
}

export default PersonSvg;
