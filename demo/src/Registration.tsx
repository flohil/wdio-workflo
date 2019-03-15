import * as classnames from 'classnames';
import {
  Checkbox,
  Dropdown,
  IButtonProps,
  ICheckboxProps,
  IDropdownProps,
  ITextFieldProps,
  PrimaryButton,
  TextField
} from 'office-ui-fabric-react';
import * as React from 'react';

import './Global.css';
import './Registration.css';

const checkboxStyles = () => {
  return {
    root: {
      marginTop: '10px'
    }
  };
};

interface IRegistrationState {
  submitted: boolean
  username: string
  email: string
  password: string
  country: string
  acceptedTerms: boolean
}

export class Registration extends React.Component<{}, IRegistrationState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      acceptedTerms: false,
      country: '',
      email: '',
      password: '',
      submitted: false,
      username: ''
    }
  }

  public render() {
    return (
      <div className="Registration-wrapper">
        <div className="Registration-container">
          <div className="Global-heading">
            <h1>Registration</h1>
          </div>
          <div className="Registration-form">
            <TextField label="Username" onChange={this.onUsernameChanged} />
            <TextField label="Email" onChange={this.onEmailChanged} />
            <TextField type="password" label="Password" onChange={this.onPasswordChanged} />
            <Dropdown
              label="Country"
              // selectedKey={selectedItem ? selectedItem.key : undefined}
              onChange={this.onDropdownChanged}
              placeholder="Select a country"
              options={[
                { key: 'china', text: 'China' },
                { key: 'germany', text: 'Germany' },
                { key: 'russia', text: 'Russia' },
                { key: 'us', text: 'United States' }
              ]}
            />
            <Checkbox
              label="Accept terms"
              styles={checkboxStyles}
              onChange={this.onTermsChanged}
            />
            <div className="Registration-submit">
              <PrimaryButton
                data-automation-id="test"
                text="Submit"
                onClick={this.onSubmitClicked}
              />
            </div>
            {this.renderThanks()}
          </div>
        </div>
      </div>
    );
  }

  private renderThanks() {
    if (this.state.submitted) {
      if (this.isValid()) {
        return <div className="Registration-thanks">Thanks for your registration!</div>
      } else {
        return (
          <div className={classnames("Registration-thanks", "Registration-thanks-invalid")}>
            Please fill in all fields!
          </div>
        );
      }
    } else {
      return false
    }
  }

  private onUsernameChanged: ITextFieldProps['onChange'] = (event, newValue) => {
    this.setState({
      submitted: false,
      username: newValue || ''
    })
  }

  private onEmailChanged: ITextFieldProps['onChange'] = (event, newValue) => {
    this.setState({
      email: newValue || '',
      submitted: false
    })
  }

  private onPasswordChanged: ITextFieldProps['onChange'] = (event, newValue) => {
    this.setState({
      password: newValue || '',
      submitted: false
    })
  }

  private onDropdownChanged: IDropdownProps['onChange'] = (event, option) => {
    this.setState({
      country: (!!option) ? option.key.toString() : '',
      submitted: false
    })
  }

  private onTermsChanged: ICheckboxProps['onChange'] = (event, checked) => {
    this.setState({
      acceptedTerms: checked || false,
      submitted: false
    })
  }

  private onSubmitClicked: IButtonProps['onClick'] = () => {
    if (this.isValid()) {
      // simulate wait for server response
      setTimeout(() => {
        this.setState({
          submitted: true
        })
      }, 1000)
    } else {
      this.setState({
        submitted: true
      })
    }
  }

  private isValid() {
    return this.state.username &&
      this.state.email &&
      this.state.password &&
      this.state.country &&
      this.state.acceptedTerms
  }
}