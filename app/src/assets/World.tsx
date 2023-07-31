import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 4L16.0333 5.1C15.6871 5.35964 15.2661 5.5 14.8333 5.5H11.475C10.8775 5.5 10.3312 5.83761 10.064 6.37206V6.37206C9.7342 7.03161 9.9053 7.83161 10.476 8.29856L12.476 9.9349C14.0499 11.2227 14.8644 13.22 14.6399 15.2412L14.5936 15.6577C14.5314 16.2177 14.4102 16.7695 14.232 17.304L14 18" stroke-width="2"/>
<path d="M0.5 8.5L3.7381 7.96032C5.09174 7.73471 6.26529 8.90826 6.03968 10.2619L5.90517 11.069C5.66434 12.514 6.3941 13.9471 7.70437 14.6022V14.6022C8.75353 15.1268 9.29759 16.3097 9.01309 17.4476L8.5 19.5" stroke-width="2"/>
<circle cx="10" cy="10" r="9" stroke-width="2"/>
</svg>
`;

interface Props {
  color: string;
  size?: number;
}

class World extends React.Component<Props> {
  render() {
    return (
      <SvgXml
        xml={svg}
        width={this.props.size}
        height={this.props.size}
        stroke={this.props.color}
      />
    );
  }
}

export default World;
