import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="8" cy="4" rx="7" ry="3" />
<path d="M1 10C1 10 1 12.3431 1 14C1 15.6569 4.13401 17 8 17C11.866 17 15 15.6569 15 14C15 13.173 15 10 15 10"  stroke-linecap="square"/>
<path d="M1 4C1 4 1 7.34315 1 9C1 10.6569 4.13401 12 8 12C11.866 12 15 10.6569 15 9C15 8.17299 15 4 15 4" />
</svg>
`;

interface Props {
  color?: string;
  size?: number;
}

class Database extends React.Component<Props> {
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

export default Database;
