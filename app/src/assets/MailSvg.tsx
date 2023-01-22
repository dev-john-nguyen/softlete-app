import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 49 49" xmlns="http://www.w3.org/2000/svg">
<path d="M44.9163 12.2498C44.9163 10.004 43.0788 8.1665 40.833 8.1665H8.16634C5.92051 8.1665 4.08301 10.004 4.08301 12.2498V36.7498C4.08301 38.9957 5.92051 40.8332 8.16634 40.8332H40.833C43.0788 40.8332 44.9163 38.9957 44.9163 36.7498V12.2498ZM40.833 12.2498L24.4997 22.4582L8.16634 12.2498H40.833ZM40.833 36.7498H8.16634V16.3332L24.4997 26.5415L40.833 16.3332V36.7498Z" />
</svg>`;

interface Props {
  color: string;
  size?: number;
}

class MailSvg extends React.Component<Props> {
  render() {
    return (
      <SvgXml
        xml={svg}
        width={this.props.size || '100%'}
        height={this.props.size || '100%'}
        fill={this.props.color}
      />
    );
  }
}

export default MailSvg;
