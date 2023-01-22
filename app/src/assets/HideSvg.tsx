import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 47 47"  xmlns="http://www.w3.org/2000/svg">
<path d="M3.32244 2.3225L0.127441 5.495L5.23494 10.6025C2.87244 14.1575 1.49994 18.41 1.49994 23C1.49994 35.42 11.5799 45.5 23.9999 45.5C28.5899 45.5 32.8424 44.1275 36.3974 41.765L41.5049 46.8725L44.6774 43.7L3.32244 2.3225ZM23.9999 41C14.0774 41 5.99994 32.9225 5.99994 23C5.99994 19.67 6.92244 16.565 8.51994 13.865L33.1349 38.48C30.4349 40.0775 27.3299 41 23.9999 41ZM14.8649 7.52L11.6024 4.235C15.1574 1.8725 19.4099 0.5 23.9999 0.5C36.4199 0.5 46.4999 10.58 46.4999 23C46.4999 27.59 45.1274 31.8425 42.7649 35.3975L39.4799 32.1125C41.0774 29.435 41.9999 26.33 41.9999 23C41.9999 13.0775 33.9224 5 23.9999 5C20.6699 5 17.5649 5.9225 14.8649 7.52Z" />
</svg>`;

interface Props {
  fillColor: string;
  color?: string;
  size?: number;
}

class HideSvg extends React.Component<Props> {
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

export default HideSvg;
