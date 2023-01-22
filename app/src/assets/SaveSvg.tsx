import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 19V17C14 15.1144 14 14.1716 13.4142 13.5858C12.8284 13 11.8856 13 10 13H9C7.11438 13 6.17157 13 5.58579 13.5858C5 14.1716 5 15.1144 5 17V19" stroke-width="2"/>
<path d="M5 6H10" stroke-width="2" stroke-linecap="round"/>
<path d="M1 7C1 4.17157 1 2.75736 1.87868 1.87868C2.75736 1 4.17157 1 7 1H14.1716C14.5803 1 14.7847 1 14.9685 1.07612C15.1522 1.15224 15.2968 1.29676 15.5858 1.58579L18.4142 4.41421C18.7032 4.70324 18.8478 4.84776 18.9239 5.03153C19 5.2153 19 5.41968 19 5.82843V13C19 15.8284 19 17.2426 18.1213 18.1213C17.2426 19 15.8284 19 13 19H7C4.17157 19 2.75736 19 1.87868 18.1213C1 17.2426 1 15.8284 1 13V7Z" stroke-width="2"/>
</svg>`;

interface Props {
  color: string;
  size: number | string;
}

class SaveSvg extends React.Component<Props, {}> {
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

export default SaveSvg;
