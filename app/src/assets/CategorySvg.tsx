import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
<circle cx="14" cy="5" r="4"  stroke-width="2"/>
<circle cx="9" cy="14" r="3"  stroke-width="2"/>
<circle cx="3.5" cy="6.5" r="2.5"  stroke-width="2"/>
</svg>`

interface Props {
    fillColor: string
}

class CategorySvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' stroke={this.props.fillColor} />
        )
    }
}

export default CategorySvg