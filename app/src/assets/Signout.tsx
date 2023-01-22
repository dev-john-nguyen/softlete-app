import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 11L1.21913 10.3753L0.719375 11L1.21913 11.6247L2 11ZM11 12C11.5523 12 12 11.5523 12 11C12 10.4477 11.5523 10 11 10V12ZM5.21913 5.3753L1.21913 10.3753L2.78087 11.6247L6.78087 6.6247L5.21913 5.3753ZM1.21913 11.6247L5.21913 16.6247L6.78087 15.3753L2.78087 10.3753L1.21913 11.6247ZM2 12H11V10H2V12Z" fill="#CCD2E3"/>
<path d="M10 7.13193V6.38851C10 4.77017 10 3.961 10.474 3.4015C10.9479 2.84201 11.7461 2.70899 13.3424 2.44293L15.0136 2.1644C18.2567 1.62388 19.8782 1.35363 20.9391 2.25232C22 3.15102 22 4.79493 22 8.08276V13.9172C22 17.2051 22 18.849 20.9391 19.7477C19.8782 20.6464 18.2567 20.3761 15.0136 19.8356L13.3424 19.5571C11.7461 19.291 10.9479 19.158 10.474 18.5985C10 18.039 10 17.2298 10 15.6115V15.066" stroke-width="2"/>
</svg>
`;

interface Props {
  color: string;
  size: number | string;
}

class Signout extends React.Component<Props, {}> {
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

export default Signout;
