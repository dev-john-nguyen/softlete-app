import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.60001 9.59992C2.48367 9.59992 3.20002 8.88357 3.20002 7.99991C3.20002 7.11625 2.48367 6.3999 1.60001 6.3999C0.716349 6.3999 0 7.11625 0 7.99991C0 8.88357 0.716349 9.59992 1.60001 9.59992Z"/>
<path d="M7.99991 9.59992C8.88357 9.59992 9.59992 8.88357 9.59992 7.99991C9.59992 7.11625 8.88357 6.3999 7.99991 6.3999C7.11625 6.3999 6.3999 7.11625 6.3999 7.99991C6.3999 8.88357 7.11625 9.59992 7.99991 9.59992Z"/>
<path d="M14.4003 9.59992C15.284 9.59992 16.0003 8.88357 16.0003 7.99991C16.0003 7.11625 15.284 6.3999 14.4003 6.3999C13.5166 6.3999 12.8003 7.11625 12.8003 7.99991C12.8003 8.88357 13.5166 9.59992 14.4003 9.59992Z"/>
</svg>
`;

interface Props {
  fillColor: string;
  color?: string;
  size: string | number;
}

class MoreSvg extends React.Component<Props> {
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

export default MoreSvg;
