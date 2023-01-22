import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 14 19" xmlns="http://www.w3.org/2000/svg">
<path d="M3 1V4" stroke-width="2" stroke-linecap="round"/>
<path d="M3 12V15" stroke-width="2" stroke-linecap="round"/>
<rect x="1" y="4" width="4" height="8" rx="0.8" stroke-width="2"/>
<path d="M11 5V10" stroke-width="2" stroke-linecap="round"/>
<path d="M11 15V18" stroke-width="2" stroke-linecap="round"/>
<rect x="9" y="10" width="4" height="5" rx="0.8" stroke-width="2"/>
</svg>`;

interface Props {
  color: string;
  size: number | string;
}

class CandleSticksSvg extends React.Component<Props, {}> {
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

export default CandleSticksSvg;
