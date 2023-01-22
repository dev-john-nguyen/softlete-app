import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 407 346" xmlns="http://www.w3.org/2000/svg">
<path d="M203.5 55.4596L304.958 146.772V305.25H264.375V183.5H142.625V305.25H102.042V146.772L203.5 55.4596ZM203.5 0.875L0.583252 183.5H61.4583V345.833H183.208V224.083H223.792V345.833H345.542V183.5H406.417L203.5 0.875Z" />
</svg>`

interface Props {
    strokeColor: string;
}

class HomeSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' fill={this.props.strokeColor} />
        )
    }
}

export default HomeSvg;