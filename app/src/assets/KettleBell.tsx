import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 27H17C19.4 25.2 21 22.3 21 19C21 13.5 16.5 9 11 9C5.5 9 1 13.5 1 19C1 22.3 2.6 25.2 5 27Z"  stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 11.9V8C4 4.2 7.1 1 11 1C14.8 1 18 4.1 18 8V11.9"  stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.2998 14C15.3998 14.7 16.2998 15.9 16.6998 17.2"  stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

interface Props {
  size?: number;
  color: string;
}

class KettleBell extends React.Component<Props> {
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

export default KettleBell;
