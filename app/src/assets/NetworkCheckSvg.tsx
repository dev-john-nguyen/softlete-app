import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 22 20" xmlns="http://www.w3.org/2000/svg">
<path d="M20 9.99965L22 7.99965C18.27 4.26965 13.13 2.84965 8.3 3.68965L10.88 6.26965C14.18 6.24965 17.49 7.48965 20 9.99965ZM18 11.9996C16.92 10.9196 15.64 10.1496 14.28 9.66965L17.3 12.6896L18 11.9996ZM8 15.9996L11 18.9996L14 15.9996C12.35 14.3396 9.66 14.3396 8 15.9996ZM2.41 0.639648L1 2.04965L4.05 5.09965C2.59 5.82965 1.22 6.78965 0 7.99965L2 9.99965C3.23 8.76965 4.65 7.83965 6.17 7.21965L8.41 9.45965C6.79 9.88965 5.27 10.7396 4 11.9996L6 13.9996C7.35 12.6496 9.11 11.9596 10.89 11.9396L17.97 19.0196L19.38 17.6096L2.41 0.639648Z" />
</svg>`;

interface Props {
  fillColor: string;
  size: number | string;
  color: string;
}

class NetworkCheckSvg extends React.Component<Props, {}> {
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

export default NetworkCheckSvg;
