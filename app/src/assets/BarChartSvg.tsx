import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 10L8 16"  stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 12V16"  stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 8V16"  stroke-linecap="round" stroke-linejoin="round"/>
<rect x="3" y="4" width="18" height="16" rx="2" />
</svg>
`

interface Props {
    strokeColor: string;
}

class BarChartSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' stroke={this.props.strokeColor} />
        )
    }
}

export default BarChartSvg