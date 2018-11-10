import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { getDefaultFieldValue } from '../../../../common/optionsHelper';
import OptionList from '../OptionList/OptionList';
import UiButton from '../UiButton/UiButton';
import UiCard from '../UiCard/UiCard';
import UiCardButtonRow from '../UiCardButtonRow/UiCardButtonRow';
import UiCardContent from '../UiCardContent/UiCardContent';
import UiCardTitle from '../UiCardTitle/UiCardTitle';
import { IOptionCardProps } from './IOptionCardProps';
import { OptionCardContext, OptionsCardContextData } from './OptionCardContext';

import './OptionCard.css';

interface IOptionCardState {
  newOptions: any;
  formContext: OptionsCardContextData;
}

export default class OptionCard extends React.Component<IOptionCardProps, IOptionCardState> {
  constructor(props: IOptionCardProps) {
    super(props);

    const newOptions = this.setDefaultValues(props.options || {});

    this.state = {
      newOptions,
      formContext: new OptionsCardContextData()
    };

    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
    this.reset = this.reset.bind(this);
    this.optionsChange = this.optionsChange.bind(this);
  }

  // init fields
  private setDefaultValues(options: object) {
    this.props.fields.forEach(field => {
      let value = options[field.name];

      if (value === undefined) {
        value = getDefaultFieldValue(field);
        if (value !== undefined) {
          options[field.name] = value;
        }
      }
    });
    return options;
  }

  private reset() {
    const newOptions = this.setDefaultValues(this.props.options || {});
    this.setState({ newOptions });
  }

  private async save() {
    await this.state.formContext.onSave.publish();
    return this.props.onSave(this.state.newOptions);
  }

  private cancel() {
    return this.props.onCancel && this.props.onCancel();
  }

  private optionsChange(newValue: any) {
    this.setState({ newOptions: newValue });
  }

  public renderTitle() {
    return (
      <UiCardTitle>
        <FontAwesomeIcon icon={this.props.icon} /> {this.props.title}
      </UiCardTitle>
    );
  }

  public renderContent() {
    return (
      <OptionCardContext.Provider value={this.state.formContext}>
        <OptionList fields={this.props.fields}
          value={this.state.newOptions}
          valueChange={this.optionsChange}
        />
      </OptionCardContext.Provider>
    );
  }

  public renderFooter() {
    return (
      <UiCardButtonRow divider="half">
        {this.props.onCancel && (
          <UiButton onClick={this.cancel}>
            <FontAwesomeIcon icon={SolidIcons.faTimes} /> Cancel
          </UiButton>
        )}
        {this.props.showReset && (
        <UiButton onClick={this.reset}>
          <FontAwesomeIcon icon={SolidIcons.faUndo} /> Reset
        </UiButton>
        )}
        <UiButton onClick={this.save}>
          <FontAwesomeIcon icon={SolidIcons.faSave} /> Save
        </UiButton>
      </UiCardButtonRow>
    );
  }

  public render() {
    const className = 'OptionCard ' + this.props.className;

    return (
      <UiCard className={className}>
        {this.renderTitle()}
        {this.renderContent()}
        <UiCardContent className="debug" style={{ whiteSpace: 'pre' }}>
          {JSON.stringify(this.state.newOptions, undefined, 2)}
        </UiCardContent>
        {this.renderFooter()}
      </UiCard >
    );
  }
}
