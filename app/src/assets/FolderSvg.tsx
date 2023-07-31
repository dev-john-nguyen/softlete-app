import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 5C1 3.11438 1 2.17157 1.58579 1.58579C2.17157 1 3.11438 1 5 1H5.34315C6.16065 1 6.5694 1 6.93694 1.15224C7.30448 1.30448 7.59351 1.59351 8.17157 2.17157L8.82843 2.82843C9.40649 3.40649 9.69552 3.69552 10.0631 3.84776C10.4306 4 10.8394 4 11.6569 4H13C14.8856 4 15.8284 4 16.4142 4.58579C17 5.17157 17 6.11438 17 8V12C17 13.8856 17 14.8284 16.4142 15.4142C15.8284 16 14.8856 16 13 16H5C3.11438 16 2.17157 16 1.58579 15.4142C1 14.8284 1 13.8856 1 12V5Z" stroke-width="2"/>
<path d="M2 8H16" stroke-width="2" stroke-miterlimit="1.41421"/>
</svg>
`;

interface Props {
  strokeColor: string;
  color?: string;
  size?: number;
}

class FolderSvg extends React.Component<Props> {
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

export default FolderSvg;
