import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="4" width="18" height="15" rx="2"  stroke-width="2"/>
<path d="M2 9H18"  stroke-width="2" stroke-linecap="round"/>
<path d="M7 14H13"  stroke-width="2" stroke-linecap="round"/>
<path d="M6 1L6 5"  stroke-width="2" stroke-linecap="round"/>
<path d="M14 1L14 5"  stroke-width="2" stroke-linecap="round"/>
</svg>`;

interface Props {
  color: string;
  size: number | string;
}

class CalendarSvg extends React.Component<Props, {}> {
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

export default CalendarSvg;
