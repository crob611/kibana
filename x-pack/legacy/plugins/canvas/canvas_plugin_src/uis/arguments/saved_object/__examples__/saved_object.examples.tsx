/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { SavedObjectInput } from '..';
import { EuiComboBox } from '@elastic/eui';

const defaultValues = {
  argValue: 'some-id',
};

const options = [
  {
    label: 'Titan',
    'data-test-subj': 'titanOption',
  },
  {
    label: 'Enceladus is disabled',
    disabled: true,
  },
  {
    label: 'Mimas',
  },
  {
    label: 'Dione',
  },
  {
    label: 'Iapetus',
  },
  {
    label: 'Phoebe',
  },
  {
    label: 'Rhea',
  },
  {
    label: "Pandora is one of Saturn's moons, named for a Titaness of Greek mythology",
  },
  {
    label: 'Tethys',
  },
  {
    label: 'Hyperion',
  },
];

const exampleOptions = [
  {
    label: 'Option 1',
    id: 'something-something-something',
    icon: 'bell',
  },
  {
    label: 'Option 2',
    id: 'somethsssing-something-something',
    icon: 'beaker',
  },
];

class Interactive extends React.Component<{}, typeof defaultValues> {
  public state = defaultValues;

  public render() {
    return (
      <div>
        <SavedObjectInput
          options={exampleOptions}
          argValue={this.state.argValue}
          onArgChange={(argValue: string) => {
            action('onValueChange')(argValue);
            this.setState({ argValue });
          }}
        />
      </div>
    );
  }
}

storiesOf('arguments/SavedObject', module)
  .addDecorator(story => (
    <div style={{ width: '323px', padding: '16px', background: '#fff' }}>{story()}</div>
  ))
  .add('simple', () => <Interactive />);

/*
storiesOf('arguments/SavedObject/components', module)
  .addDecorator(story => (
    <div style={{ width: '323px', padding: '16px', background: '#fff' }}>{story()}</div>
  ))
  .add('simple template', () => (
    <SavedObjectInput onValueChange={action('onValueChange')} argValue={'something'} />
  ));
*/
