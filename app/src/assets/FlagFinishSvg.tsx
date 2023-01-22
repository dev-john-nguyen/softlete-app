import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 9V1.5C1 1.2643 1 1.14645 1.07322 1.07322C1.14645 1 1.2643 1 1.5 1H5.38197C5.68267 1 5.83302 1 5.95385 1.07467C6.07467 1.14935 6.14191 1.28383 6.27639 1.55279L6.72361 2.44721C6.85809 2.71617 6.92533 2.85065 7.04615 2.92533C7.16698 3 7.31733 3 7.61803 3H12.5C12.7357 3 12.8536 3 12.9268 3.07322C13 3.14645 13 3.2643 13 3.5V10.5C13 10.7357 13 10.8536 12.9268 10.9268C12.8536 11 12.7357 11 12.5 11H7.61803C7.31733 11 7.16698 11 7.04615 10.9253C6.92533 10.8507 6.85809 10.7162 6.72361 10.4472L6.27639 9.55279C6.14191 9.28383 6.07467 9.14935 5.95385 9.07467C5.83302 9 5.68267 9 5.38197 9H1ZM1 9V15" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

interface Props {
  color?: string;
  size?: string | number;
}

class FlagFinish extends React.Component<Props> {
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

export default FlagFinish;
