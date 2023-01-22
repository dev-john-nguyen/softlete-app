import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<rect x="4" y="4" width="6" height="7" rx="1"  stroke-width="2" stroke-linejoin="round"/>
<rect x="4" y="15" width="6" height="5" rx="1"  stroke-width="2" stroke-linejoin="round"/>
<rect x="14" y="4" width="6" height="5" rx="1"  stroke-width="2" stroke-linejoin="round"/>
<rect x="14" y="13" width="6" height="7" rx="1"  stroke-width="2" stroke-linejoin="round"/>
</svg>`

interface Props {
    strokeColor: string
}

class DashboardSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' stroke={this.props.strokeColor} />
        )
    }
}

export default DashboardSvg