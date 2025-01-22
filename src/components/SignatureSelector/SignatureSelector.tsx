import styles from './SignatureSelector.styles.module.css';
import { KeySignature } from '@services/notationRenderer/Signature';
import React, { useState } from 'react';

function SignatureSelector() {
  const [selectedSignature, setSelectedSignature] = useState<KeySignature>(KeySignature.C);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = event.target.value as KeySignature;
    setSelectedSignature(selectedKey);
  };

  return (
    <div className={styles.container}>
      <label className={styles.header}>Select Key Signature: </label>
      <select
        id="key-signature"
        value={selectedSignature}
        onChange={handleChange}
        className={styles.selector}>
        {Object.values(KeySignature).map(key => (
          <option
            key={key}
            value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SignatureSelector;
