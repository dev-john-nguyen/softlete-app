import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.94246 8.68723C7.91195 7.91075 7.91762 7.09875 7.93431 6.42186C8.52886 6.74586 9.23491 7.14694 9.8921 7.5616C10.3721 7.86449 10.8095 8.16426 11.1527 8.43792C11.5227 8.73299 11.6888 8.9248 11.7321 8.99986C11.7755 9.07493 11.8585 9.31468 11.9291 9.78265C11.9945 10.2167 12.0354 10.7453 12.0577 11.3125C12.0882 12.089 12.0825 12.901 12.0658 13.5779C11.4713 13.2539 10.7652 12.8528 10.108 12.4381C9.628 12.1352 9.19063 11.8355 8.84746 11.5618C8.47745 11.2667 8.31135 11.0749 8.26802 10.9999C8.22468 10.9248 8.14161 10.6851 8.07108 10.2171C8.00567 9.78305 7.96474 9.2544 7.94246 8.68723Z" stroke-width="2"/>
<circle cx="10" cy="10" r="9" stroke-width="2"/>
</svg>`;

interface Props {
  color: string;
  size?: number;
}

class CompassSvg extends React.Component<Props> {
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

export default CompassSvg;
