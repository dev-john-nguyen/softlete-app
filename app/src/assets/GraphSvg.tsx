import React from 'react';
import { SvgXml } from 'react-native-svg';

const graph = `<svg viewBox="0 0 21 11" xmlns="http://www.w3.org/2000/svg">
<rect x="5" y="6" width="4" height="4" rx="2" transform="rotate(90 5 6)" stroke-width="2"/>
<rect x="16" y="5" width="4" height="4" rx="2" transform="rotate(-90 16 5)" stroke-width="2"/>
<path d="M17 4L15.5 5.5C14.4829 6.51705 13.9744 7.02558 13.3628 7.1384C13.1229 7.18263 12.8771 7.18263 12.6372 7.1384C12.0256 7.02558 11.5171 6.51705 10.5 5.5V5.5C9.48295 4.48295 8.97442 3.97442 8.36277 3.8616C8.12295 3.81737 7.87705 3.81737 7.63723 3.8616C7.02558 3.97442 6.51705 4.48295 5.5 5.5L4 7" stroke-width="2"/>
</svg>`;

interface Props {
  color: string;
  size?: number;
}

class GraphSvg extends React.Component<Props, {}> {
  render() {
    return (
      <SvgXml
        xml={graph}
        width={this.props.size || '100%'}
        height={this.props.size || '100%'}
        stroke={this.props.color}
      />
    );
  }
}

export default GraphSvg;
