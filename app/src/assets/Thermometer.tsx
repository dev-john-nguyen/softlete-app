import React from 'react';
import { SvgXml } from 'react-native-svg';

const svg = `<svg  viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.38388 10.319L8.70691 11.055L9.38388 10.319ZM4 4C4 2.89543 4.89543 2 6 2V0C3.79086 0 2 1.79086 2 4H4ZM4 9.50008V4H2V9.50008H4ZM2 14C2 12.835 2.49678 11.7874 3.29309 11.055L1.93916 9.583C0.748399 10.6782 0 12.2524 0 14H2ZM6 18C3.79086 18 2 16.2091 2 14H0C0 17.3137 2.68629 20 6 20V18ZM10 14C10 16.2091 8.20914 18 6 18V20C9.31371 20 12 17.3137 12 14H10ZM8.70691 11.055C9.50322 11.7874 10 12.835 10 14H12C12 12.2524 11.2516 10.6782 10.0608 9.583L8.70691 11.055ZM8 4V9.50008H10V4H8ZM6 2C7.10457 2 8 2.89543 8 4H10C10 1.79086 8.20914 0 6 0V2ZM10.0608 9.583C10.0308 9.55535 10.0137 9.52956 10.0056 9.51277C9.99817 9.49734 10 9.4937 10 9.50008H8C8 10.145 8.31008 10.69 8.70691 11.055L10.0608 9.583ZM2 9.50008C2 9.4937 2.00183 9.49734 1.99438 9.51277C1.98627 9.52956 1.96922 9.55535 1.93916 9.583L3.29309 11.055C3.68992 10.69 4 10.145 4 9.50008H2Z"/>
<circle cx="6" cy="14" r="2"/>
</svg>

`;

interface Props {
  fillColor?: string;
  color?: string;
  size?: number;
}

class Thermometer extends React.Component<Props> {
  render() {
    return (
      <SvgXml
        xml={svg}
        width={this.props.size || '100%'}
        height={this.props.size || '100%'}
        fill={this.props.color || this.props.fillColor}
      />
    );
  }
}

export default Thermometer;
