import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 9V1.69371C1 1.37716 1 1.21888 1.10382 1.14405C1.20764 1.06921 1.3578 1.11927 1.65811 1.21937L11.577 4.52566C12.1653 4.72176 12.4594 4.81981 12.4594 5C12.4594 5.18019 12.1653 5.27824 11.577 5.47434L1 9ZM1 9V14V15" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

interface Props {
  color: string;
  size?: string | number;
}

class Flag extends React.Component<Props> {
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

export default Flag;
