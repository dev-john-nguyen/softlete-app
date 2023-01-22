import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 14L8.23309 16.4248C8.66178 16.7463 9.26772 16.6728 9.60705 16.2581L18 6" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

interface Props {
  strokeColor: string;
  color: string;
  size: number | string;
}

class CheckedSvg extends React.Component<Props, {}> {
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

export default CheckedSvg;
