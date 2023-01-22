import React from 'react';
import { SvgXml } from 'react-native-svg';

const menu = `<svg viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9" cy="13" r="8" stroke-width="2"/>
<path d="M9 13L9 10" stroke-width="2" stroke-linecap="round"/>
<path d="M14.5 6.5L16 5" stroke-width="2" stroke-linecap="round"/>
<path d="M7.06815 1.37059C7.1821 1.26427 7.43319 1.17033 7.78248 1.10332C8.13177 1.03632 8.55973 1 9 1C9.44027 1 9.86823 1.03632 10.2175 1.10332C10.5668 1.17033 10.8179 1.26427 10.9319 1.37059" stroke-width="2" stroke-linecap="round"/>
</svg>`;

interface Props {
  fillColor: string;
  color: string | number;
  size: number;
}

class ClockSvg extends React.Component<Props> {
  render() {
    return (
      <SvgXml
        xml={menu}
        width={this.props.size || '100%'}
        height={this.props.size || '100%'}
        stroke={this.props.color || this.props.fillColor}
      />
    );
  }
}

export default ClockSvg;
