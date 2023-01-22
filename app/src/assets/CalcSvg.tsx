import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3Z"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 7H9C8.44772 7 8 7.44772 8 8V9C8 9.55228 8.44772 10 9 10H15C15.5523 10 16 9.55228 16 9V8C16 7.44772 15.5523 7 15 7Z"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 14V14.01"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 14V14.01"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 14V14.01"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 17V17.01"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 17V17.01"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 17V17.01"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

interface Props {
    strokeColor: string;
}

class CalcSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' stroke={this.props.strokeColor} />
        )
    }
}

export default CalcSvg