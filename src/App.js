import React, {useState} from 'react';
import MaskedInput from './masked-input/masked-input';
import './App.css';

function App() {
  const [phone, setPhone] = useState('');

  const onChange = event => setPhone(event.target.value);

  /* eslint-disable-next-line no-useless-escape */
  const phoneMask = '(ddd)ddd-dddd';
  return (
    <div className="App">
      <div>
        <label>Phone Number</label>
        <MaskedInput
          mask={phoneMask}
          onChange={onChange}
          placeholder="(999)999-9999"
          value={phone}
        />
      </div>
      <div>You entered {phone}.</div>
    </div>
  );
}

export default App;
