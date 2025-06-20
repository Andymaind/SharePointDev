import * as React from 'react';
//import styles from './SliderHeader.module.scss';
import type { ISliderHeaderProps } from './ISliderHeaderProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { Galleria } from 'primereact/galleria';
import 'primeflex/primeflex.css';
import './CSSCustom/StilesPersonalizados.css'; // Asegúrate de que la ruta sea correcta



export default class SliderHeader extends React.Component<ISliderHeaderProps> {
  public render(): React.ReactElement<ISliderHeaderProps> {
    const {
      //description,
      //isDarkTheme,
      //environmentMessage,
      //hasTeamsContext,
      //userDisplayName,
      item,
      altura,
      vercaptions,
      //TamañoText,
      //brillo  
    } = this.props;

   

    const images = item.map((i: any) => ({
      itemImageSrc: i.backgroundImage || i.backgroundImageUrl,
      alt: i.title,
      title: i.title,
      subtitle: i.subtitle,
      link:  i.link ? { url: i.link, target: i.target } : null
    }));
    console.log('images', images);
    // Template for each item in the Galleria
    const itemTemplate = (item: any) => {
      return <a style={{height: altura ? `${altura}px` : '300px', width: '100%'}} href={item.link?.url} target={item.link?.target}><img  src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block', height: altura ? `${altura}px` : '300px', objectFit: 'cover', objectPosition: 'center' }} /></a>;
    };
    const caption = (item: any) => (
      <React.Fragment>
        <div>
          <div className="text-xl mb-2 ml-2 font-bold">{item.title}</div>
          <p className="text-white ml-2" >{item.subtitle}</p>
        </div>
      </React.Fragment>
    );


    return (
      <>
        <div className='grid grid-nogutter nested-grid'>
          <div className='col-12' style={{ padding: '1px' }}>
            <Galleria value={images} style={{ minHeight: '300px', height: altura ? `${altura}px` : '300px'}} showThumbnails={false} showIndicators showIndicatorsOnItem={true} indicatorsPosition={'bottom'} circular autoPlay transitionInterval={3000} showItemNavigators item={itemTemplate} caption={vercaptions ? caption : undefined}/>
          </div>
        </div>

      </>
    );
  }
}
