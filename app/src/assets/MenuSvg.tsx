import React from 'react';
import { SvgXml } from 'react-native-svg';

const menu = `<svg viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg">
<path d="M1 15H17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 8L17 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 1L17 0.999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

interface Props {
    strokeColor: string;
}

class Menu extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={menu} width='100%' height='100%' stroke={this.props.strokeColor} />
        )
    }
}

export default Menu