import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="39.5" cy="39.5" r="36.375"  stroke-width="5"/>
<path d="M39.5 51.625L39.5 27.375"  stroke-width="5" stroke-linecap="square"/>
<path d="M51.625 39.5L27.375 39.5"  stroke-width="5" stroke-linecap="square"/>
</svg>
`;

interface Props {
  fillColor?: string;
  color?: string;
  size?: number;
}

class AddRing extends React.Component<Props> {
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

export default AddRing;
