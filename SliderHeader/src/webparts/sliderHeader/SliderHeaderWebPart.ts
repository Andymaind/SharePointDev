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
import 'primeicons/primeicons.css'; // Iconos de PrimeReact
import 'primereact/resources/primereact.css'; // Estilos principales de PrimeReact
import 'primereact/resources/themes/lara-dark-green/theme.css';
import 'primeflex/primeflex.css';


export interface ISliderHeaderWebPartProps {
  description: string;
  collectionData: ISliderHeaderInfo[];
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
        item: this.properties.collectionData? this.properties.collectionData : [],
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

    

    let webpartOptions: IPropertyPaneField<any>[] = [];

    if (this.propertyFieldCollectionData) {
      webpartOptions.push(
        this.propertyFieldCollectionData('collectionData', {
          key: 'collectionDataFieldId',
          label: 'Collection Data',
          panelHeader: 'Collection Data',
          manageBtnLabel: 'Manage Collection Data',
          value: this.properties.collectionData,
          fields: [
            {
              id: 'title',
              title: 'Title',
              type: this.customCollectionFieldType.string
            },
            {
              id: 'subtitle',
              title: 'Subtitle',
              type: this.customCollectionFieldType.string
            },
            {
              id: 'backgroundImageUrl',
              title: 'Background Image URL',
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
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              isCollapsed: true,
              groupFields: webpartOptions
            }
          ]
        }
      ]
    };
  }
}
