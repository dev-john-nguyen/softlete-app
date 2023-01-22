import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg viewBox="0 0 23 16" xmlns="http://www.w3.org/2000/svg">
<path d="M18.0002 1C15.7085 1 13.8335 2.875 13.8335 5.16667C13.8335 7.45833 15.7085 9.33333 18.0002 9.33333C20.2918 9.33333 22.1668 7.45833 22.1668 5.16667C22.1668 2.875 20.2918 1 18.0002 1ZM18.0002 8.5C16.1627 8.5 14.6668 7.00417 14.6668 5.16667C14.6668 3.32917 16.1627 1.83333 18.0002 1.83333C19.8377 1.83333 21.3335 3.32917 21.3335 5.16667C21.3335 7.00417 19.8377 8.5 18.0002 8.5ZM18.2085 3.08333H17.5835V5.58333L19.7502 6.91667L20.0835 6.375L18.2085 5.25V3.08333Z" />
<path d="M12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8C10.21 8 12 6.21 12 4ZM10 4C10 5.1 9.1 6 8 6C6.9 6 6 5.1 6 4C6 2.9 6.9 2 8 2C9.1 2 10 2.9 10 4Z" />
<path d="M0 14V16H16V14C16 11.34 10.67 10 8 10C5.33 10 0 11.34 0 14ZM2 14C2.2 13.29 5.3 12 8 12C10.69 12 13.77 13.28 14 14H2Z" />
</svg>`

interface Props {
    fillColor: string
}

class PersonTimeSvg extends React.Component<Props, {}> {
    render() {
        return (
            <SvgXml xml={svg} width='100%' height='100%' fill={this.props.fillColor} />
        )
    }
}

export default PersonTimeSvg