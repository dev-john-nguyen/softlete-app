import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = (fill: string) => `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="4" width="90%" height="75%" rx="2" stroke-width="2"/>
<path d="M1 8C1 6.11438 1 5.17157 1.58579 4.58579C2.17157 4 3.11438 4 5 4H15C16.8856 4 17.8284 4 18.4142 4.58579C19 5.17157 19 6.11438 19 8H1Z" fill=${fill}/>
<path d="M5 1L5 4" stroke-width="2" stroke-linecap="round"/>
<path d="M15 1L15 4" stroke-width="2" stroke-linecap="round"/>
</svg>`

interface Props {
    fillColor: string;
}

class CalendarTodaySvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg(this.props.fillColor)} width='100%' height='100%' stroke={this.props.fillColor} />
        )
    }
}

export default CalendarTodaySvg