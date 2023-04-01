import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `
<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<circle cx="10" cy="10" r="7"  stroke-width="2"/>
<circle cx="10" cy="10" r="2"   stroke-width="2"/>
<path d="M10 3V1"  stroke-width="2" stroke-linecap="round"/>
<path d="M17 10L19 10"  stroke-width="2" stroke-linecap="round"/>
<path d="M10 19L10 17"  stroke-width="2" stroke-linecap="round"/>
<path d="M1 10H3"  stroke-width="2" stroke-linecap="round"/>
</svg>
`;

interface Props {
  color?: string;
  size?: number;
}

class Target extends React.Component<Props> {
  render() {
    return (
      <SvgXml
        xml={svg}
        width={this.props.size || '100%'}
        height={this.props.size || '100%'}
        stroke={this.props.color}
      />
    );
  }
}

export default Target;
