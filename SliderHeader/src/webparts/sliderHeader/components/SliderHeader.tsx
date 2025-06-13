import * as React from 'react';
import styles from './SliderHeader.module.scss';
import type { ISliderHeaderProps } from './ISliderHeaderProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Galleria } from 'primereact/galleria';
import 'primeflex/primeflex.css';



export default class SliderHeader extends React.Component<ISliderHeaderProps> {
  public render(): React.ReactElement<ISliderHeaderProps> {
    const {
      //description,
      //isDarkTheme,
      //environmentMessage,
      hasTeamsContext,
      //userDisplayName,
      item
    } = this.props;

    const images = item.map((i: any) => ({
      itemImageSrc: i.backgroundImage || i.backgroundImageUrl,
      alt: i.title,
      title: i.title,
      subtitle: i.subtitle,
      link: i.target ? { url: i.link, target: i.target } : null
    }));
    console.log('images', images);
    const itemTemplate = (item: any) => {
      return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />;
    };

    return (
      <section className={`${styles.sliderHeader} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <Galleria value={images} style={{ maxWidth: '1080px', minHeight: '400px', width:"100%", height:"400px", objectFit:"cover" }} showThumbnails={false} showIndicators showIndicatorsOnItem={true} indicatorsPosition={'bottom'} item={itemTemplate} />
          <h2 className={styles.title}>{escape(item[0]?.title || '')}</h2>
          <p className={styles.subtitle}>{escape(item[0]?.subtitle || '')}</p>
        </div>
      </section>
    );
  }
}
