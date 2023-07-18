import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.23852 11.8117C1.63734 13.3002 2.51616 14.6154 3.73867 15.5535C4.96118 16.4915 6.45906 17 8 17C9.54094 17 11.0388 16.4915 12.2613 15.5535C13.4838 14.6154 14.3627 13.3002 14.7615 11.8117" stroke="#CCD2E3" stroke-width="2"/>
<path d="M8 10L7.37531 10.7809L8 11.2806L8.62469 10.7809L8 10ZM9 1C9 0.447715 8.55229 2.42698e-07 8 2.18557e-07C7.44772 1.94416e-07 7 0.447715 7 1L9 1ZM2.37531 6.78087L7.37531 10.7809L8.62469 9.21913L3.6247 5.21913L2.37531 6.78087ZM8.62469 10.7809L13.6247 6.78087L12.3753 5.21913L7.37531 9.21913L8.62469 10.7809ZM9 10L9 1L7 1L7 10L9 10Z" fill="#CCD2E3"/>
</svg>
`;

interface Props {
  color: string;
  size: string | number;
}

class DownloadSvg extends React.Component<Props> {
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

export default DownloadSvg;
