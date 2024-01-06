import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `
<svg viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="1" width="14" height="17" rx="2" stroke-width="2"/>
<path d="M5 6H11" stroke-width="2" stroke-linecap="round"/>
<path d="M5 10H11" stroke-width="2" stroke-linecap="round"/>
<path d="M5 14H9" stroke-width="2" stroke-linecap="round"/>
</svg>

`;

interface Props {
  color: string;
  size?: number;
}

class List extends React.Component<Props> {
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

export default List;
