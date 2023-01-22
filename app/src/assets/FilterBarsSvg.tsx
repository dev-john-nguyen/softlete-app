import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M5 12L5 4" stroke="#CCD2E3" stroke-width="2" stroke-linecap="round"/>
<path d="M19 20L19 18" stroke="#CCD2E3" stroke-width="2" stroke-linecap="round"/>
<path d="M5 20L5 16" stroke="#CCD2E3" stroke-width="2" stroke-linecap="round"/>
<path d="M19 12L19 4" stroke="#CCD2E3" stroke-width="2" stroke-linecap="round"/>
<path d="M12 7L12 4" stroke="#CCD2E3" stroke-width="2" stroke-linecap="round"/>
<path d="M12 20L12 12" stroke="#CCD2E3" stroke-width="2" stroke-linecap="round"/>
<circle cx="5" cy="14" r="2" stroke="#CCD2E3" stroke-width="2" stroke-linecap="round"/>
<circle cx="12" cy="9" r="2" stroke="#CCD2E3" stroke-width="2" stroke-linecap="round"/>
<circle cx="19" cy="15" r="2" stroke="#CCD2E3" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

interface Props {
  fillColor: string;
  color: string;
  size: number | string;
}

class FilterBarsSvg extends React.Component<Props, {}> {
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

export default FilterBarsSvg;
