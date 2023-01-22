import React from 'react';
import { SvgXml } from 'react-native-svg';
import { moderateScale } from 'src/components/tools/StyleConstants';

const menu = `<svg viewBox="0 0 9 14" xmlns="http://www.w3.org/2000/svg">
<path d="M2 7L1.29289 6.29289L0.585786 7L1.29289 7.70711L2 7ZM7.29289 0.292893L1.29289 6.29289L2.70711 7.70711L8.70711 1.70711L7.29289 0.292893ZM1.29289 7.70711L7.29289 13.7071L8.70711 12.2929L2.70711 6.29289L1.29289 7.70711Z"/>
</svg>
`;

interface Props {
  strokeColor: string;
  size?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  color?: string;
}

class Chevron extends React.Component<Props, {}> {
  render() {
    let rotate = '0deg';

    const { direction = 'left' } = this.props;
    switch (direction) {
      case 'right':
        rotate = '180deg';
        break;
      case 'up':
        rotate = '90deg';
        break;
      case 'down':
        rotate = '-90deg';
        break;
      case 'left':
      default:
        rotate = '0deg';
    }

    return (
      <SvgXml
        xml={menu}
        width={this.props.size || '100%'}
        height={this.props.size || '100%'}
        fill={this.props.color || this.props.strokeColor}
        style={{
          transform: [{ rotate }],
        }}
      />
    );
  }
}

export default Chevron;
