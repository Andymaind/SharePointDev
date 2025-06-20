import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  IPropertyPaneField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'SliderHeaderWebPartStrings';
import SliderHeader from './components/SliderHeader';
import { ISliderHeaderProps } from './components/ISliderHeaderProps';
import { ISliderHeaderInfo } from './ISliderHeaderInfo';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import {PropertyPaneSlider, PropertyPaneToggle} from '@microsoft/sp-property-pane'
import 'primeicons/primeicons.css'; // Iconos de PrimeReact
import 'primereact/resources/primereact.css'; // Estilos principales de PrimeReact
import 'primereact/resources/themes/lara-dark-green/theme.css';
import 'primeflex/primeflex.css';
import CustomFilePickerField from './components/ControlPane/CustomFilePickerField'; // Asegúrate que el path sea correcto


export interface ISliderHeaderWebPartProps {
  description: string;
  collectionData: ISliderHeaderInfo[];
  altura: number;
  TamañoText: number;
  brillo: number;
  vercaptions: boolean;
}

export default class SliderHeaderWebPart extends BaseClientSideWebPart<ISliderHeaderWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private propertyFieldCollectionData: any;
  private customCollectionFieldType: any;

  public render(): void {
    const element: React.ReactElement<ISliderHeaderProps> = React.createElement(
      SliderHeader,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        item: this.properties.collectionData ? this.properties.collectionData : [],
        altura: this.properties.altura,
        TamañoText: this.properties.TamañoText,
        brillo: this.properties.brillo,
        vercaptions: this.properties.vercaptions
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected async loadPropertyPaneResources(): Promise<void> {
    this.propertyFieldCollectionData = PropertyFieldCollectionData;
    this.customCollectionFieldType = CustomCollectionFieldType;
  }

  



protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

  let webpartOptionsCollectionData: IPropertyPaneField<any>[] = [];
  let webpartOptionsDesign: IPropertyPaneField<any>[] = [];

    // Configuración de las opciones del webpart
    webpartOptionsDesign.push(
      PropertyPaneSlider('altura', {
        label: 'Altura del Slider',
        min: 300,
        max: 800,
        step: 2,
        value: this.properties.altura,
        showValue: true
      }
    ),
    /*PropertyPaneSlider('TamañoText', {
        label: 'Tamaño del Texto',
        min: 8,
        max: 24,
        step: 1,
        value: this.properties.TamañoText,
        showValue: true
      }
    ),
    PropertyPaneSlider('Brillo', {
        label: 'Brillo del Slider',
        min: 0,
        max: 100,
        step: 1,
        value: this.properties.brillo,
        showValue: true
      }
    )*/
    PropertyPaneToggle('vercaptions', {
      label: 'Mostrar Títulos',
      onText: 'Sí',
      offText: 'No',
      checked: false      
    })
  );


    if (this.propertyFieldCollectionData) {
      webpartOptionsCollectionData.push(
        this.propertyFieldCollectionData('collectionData', {
          key: 'collectionDataFieldId',
          label: 'Colección de Imagenes',
          manageBtnLabel: 'Administrar Colección',
          panelDescription: 'Agrega, edita o elimina imágenes de la colección.',
          enableSorting: true,
          disableReactivePropertyChanges: true,
          panelHeader: 'Colección de Imágenes',
          manageBtnIcon: 'Edit',
          manageBtnClass: 'ms-Button--primary',
          iconName: 'PictureLibrary',
          value: this.properties.collectionData,
          fields: [
            {
              id: 'title',
              title: 'Título',
              type: this.customCollectionFieldType.string
            },
            {
              id: 'subtitle',
              title: 'Sub Título',
              type: this.customCollectionFieldType.string
            },
            {
              id: 'link',
              title: 'Enlace',
              description: 'URL del enlace (opcional)',
              type: this.customCollectionFieldType.string
            },
            {
              id: 'target',
              title: 'Target',
              type: this.customCollectionFieldType.dropdown,
              options: [
                { key: '_blank', text: '_blank' },
                { key: '_self', text: '_self' },
                { key: '_parent', text: '_parent' },
                { key: '_top', text: '_top' }
              ]
            },
            {
              id: 'backgroundImage',
              title: 'Background Image',
              type: CustomCollectionFieldType.custom,
              onCustomRender: (field: any, value: any, onUpdate: any, item: any, itemId: any, onError: any) => {
                return React.createElement(CustomFilePickerField, {
                  value: value,
                  context: this.context,
                  onChange: (newValue: string) => {
                    onUpdate(field.id, newValue);
                    onError(field.id, "");
                  }
                });
              }
            }
          ],
          disabled: false
        })
      );
    }

    return {
      pages: [
        {
          header: {
            description: 'Configuración del WebPart Banner Slider'
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: 'Configuración del Slider',
              isCollapsed: true,
              groupFields: webpartOptionsCollectionData
            },
            {
              groupName: 'Configuración del Diseño',
              isCollapsed: true,
              groupFields: webpartOptionsDesign
            }
          ]
        }
      ]
    };
  }
}
