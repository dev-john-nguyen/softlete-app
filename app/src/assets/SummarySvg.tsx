import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 43 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="43" height="52" rx="10" />
<path d="M7.5 12H19.5" stroke-width="2" stroke-linecap="round"/>
<path d="M7 21H37" stroke-width="2" stroke-linecap="round"/>
<path d="M7 28H37" stroke-width="2" stroke-linecap="round"/>
<path d="M7 35H37" stroke-width="2" stroke-linecap="round"/>
</svg>`

interface Props {
    strokeColor: string;
    fillColor: string
}

class SummarySvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' stroke={this.props.strokeColor} fill={this.props.fillColor} />
        )
    }
}

export default SummarySvg