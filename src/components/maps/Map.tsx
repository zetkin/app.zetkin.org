import dynamic from 'next/dynamic';
import { MapComponent, MapProps } from './types';

const BrowserMap = dynamic(() => {
    return import('./BrowserMap');
}, { ssr: false });

export default function Map({ height, markers , width }: MapProps): JSX.Element {
    const CastMap = BrowserMap as MapComponent;
    return (<CastMap height={ height } markers={ markers } width={ width }/>);
}
