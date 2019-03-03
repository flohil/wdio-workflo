import { Checkbox, Dropdown, PrimaryButton, TextField } from 'office-ui-fabric-react';
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
}

export class Registration extends React.Component<{}, IRegistrationState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      submitted: false
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
            <TextField label="Username" />
            <TextField label="Email" />
            <TextField type="password" label="Password" />
            <Dropdown
              label="Country"
              // selectedKey={selectedItem ? selectedItem.key : undefined}
              // onChange={this.changeState}
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

  private onSubmitClicked: PrimaryButton['props']['onClick'] = () => {
    this.setState({
      submitted: true
    })
  }

  private renderThanks() {
    if (this.state.submitted) {
      return <div className="Registration-thanks">Thanks for your registration!</div>
    } else {
      return null;
    }
  }
}