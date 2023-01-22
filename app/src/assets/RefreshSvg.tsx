import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 16 19"  xmlns="http://www.w3.org/2000/svg">
<path d="M2 11C2 9.35 2.67 7.85 3.76 6.76L2.34 5.34C0.9 6.79 0 8.79 0 11C0 15.08 3.05 18.44 7 18.93V16.91C4.17 16.43 2 13.97 2 11ZM16 11C16 6.58 12.42 3 8 3C7.94 3 7.88 3.01 7.82 3.01L8.91 1.92L7.5 0.5L4 4L7.5 7.5L8.91 6.09L7.83 5.01C7.89 5.01 7.95 5 8 5C11.31 5 14 7.69 14 11C14 13.97 11.83 16.43 9 16.91V18.93C12.95 18.44 16 15.08 16 11Z" />
</svg>
`

interface Props {
    fillColor: string;
}

class RefreshSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' fill={this.props.fillColor} />
        )
    }
}

export default RefreshSvg