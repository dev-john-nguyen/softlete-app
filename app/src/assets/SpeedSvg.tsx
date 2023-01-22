import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.6933 12.3294C19.0506 10.9959 19.0964 9.59815 18.8271 8.24419C18.5577 6.89022 17.9806 5.61636 17.1402 4.52115C16.2998 3.42593 15.2187 2.53872 13.9806 1.92815C12.7425 1.31757 11.3805 1 10 1C8.61951 1 7.25752 1.31757 6.0194 1.92815C4.78128 2.53872 3.70021 3.42593 2.85982 4.52115C2.01943 5.61636 1.44225 6.89022 1.17293 8.24419C0.903612 9.59815 0.949371 10.9959 1.30667 12.3294" stroke-width="2" stroke-linecap="round"/>
<path d="M10.7657 10.5823C11.2532 11.2916 10.9104 12.3738 10 12.9994C9.08967 13.625 7.95652 13.5571 7.46906 12.8477C6.94955 12.0917 5.15616 7.84088 4.06713 5.21143C3.86203 4.71621 4.4677 4.3 4.85648 4.669C6.92077 6.62825 10.2462 9.82631 10.7657 10.5823Z" stroke-width="2"/>
<path d="M10 1V3" stroke-width="2" stroke-linecap="round"/>
<path d="M3.63599 3.63574L5.0502 5.04996" stroke-width="2" stroke-linecap="round"/>
<path d="M16.364 3.63574L14.9498 5.04996" stroke-width="2" stroke-linecap="round"/>
<path d="M18.6934 12.3291L16.7615 11.8115" stroke-width="2" stroke-linecap="round"/>
<path d="M1.30664 12.3291L3.23849 11.8115" stroke-width="2" stroke-linecap="round"/>
</svg>`;

interface Props {
  color: string;
  size?: string | number;
}

class SpeedSvg extends React.Component<Props> {
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

export default SpeedSvg;
