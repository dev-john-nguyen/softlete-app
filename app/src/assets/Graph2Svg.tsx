import React from 'react';
import { SvgXml } from 'react-native-svg';

const graph = `<svg viewBox="0 0 12 10" xmlns="http://www.w3.org/2000/svg">
<path d="M11 1L7.95585 5.56623C7.52994 6.2051 6.57275 6.1455 6.22937 5.45874L5.77063 4.54126C5.42725 3.8545 4.47006 3.79491 4.04415 4.43377L1 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

interface Props {
  color: string;
  size: number | string;
}

class Graph2Svg extends React.Component<Props, {}> {
  render() {
    return (
      <SvgXml
        xml={graph}
        width={this.props.size || '100%'}
        height={this.props.size || '100%'}
        stroke={this.props.color}
      />
    );
  }
}

export default Graph2Svg;
