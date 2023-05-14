import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 9L3 1"  stroke-width="2" stroke-linecap="round"/>
<path d="M17 17L17 15"  stroke-width="2" stroke-linecap="round"/>
<path d="M3 17L3 13"  stroke-width="2" stroke-linecap="round"/>
<path d="M17 9L17 1"  stroke-width="2" stroke-linecap="round"/>
<path d="M10 4L10 1"  stroke-width="2" stroke-linecap="round"/>
<path d="M10 17L10 9"  stroke-width="2" stroke-linecap="round"/>
<circle cx="3" cy="11" r="2"  stroke-width="2" stroke-linecap="round"/>
<circle cx="10" cy="6" r="2"  stroke-width="2" stroke-linecap="round"/>
<circle cx="17" cy="12" r="2"  stroke-width="2" stroke-linecap="round"/>
</svg>
`;

interface Props {
  fillColor: string;
  color: string;
  size: number | string;
}

class FilterBarsSvg extends React.Component<Props> {
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

export default FilterBarsSvg;
