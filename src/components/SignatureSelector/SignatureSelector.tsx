import styles from './SignatureSelector.styles.module.css';
import { KeySignature } from '@services/notationRenderer/Signature';
import React, { useState } from 'react';
import EventNotifier from '@services/eventNotifier/eventNotifier';

const sp = '\u00A0';
const barLine = '\uE030';
const sharp = '\uE262';
const stave = '\uE014';
const narrowStave = '\uE020';
const flat = '\uE260';

const signatures = [
  {
    enumValue: KeySignature.C,
    text: `${barLine}${stave}${sp.repeat(4)}${barLine}`,
  },
  {
    enumValue: KeySignature.G,
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
  },
  {
    enumValue: KeySignature.D,
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
  },
  {
    enumValue: KeySignature.A,
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${stave}${sp}\uEB94${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
  },
  {
    enumValue: KeySignature.E,
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${stave}${sp}\uEB94${sharp}${sp}${stave}${sp}\uEB91${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
  },
  {
    enumValue: KeySignature.B,
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${stave}${sp}\uEB94${sharp}${sp}${stave}${sp}\uEB91${sharp}${sp}${stave}${sp}\uEB98${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
  },
  {
    enumValue: KeySignature['F#'],
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${stave}${sp}\uEB94${sharp}${sp}${stave}${sp}\uEB91${sharp}${sp}${stave}${sp}\uEB98${sharp}${sp}${stave}${sp}\uEB92${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
  },
  {
    enumValue: KeySignature['C#'],
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${stave}${sp}\uEB94${sharp}${sp}${stave}${sp}\uEB91${sharp}${sp}${stave}${sp}\uEB98${sharp}${sp}${stave}${sp}\uEB92${sharp}${sp}${stave}${sp}${sharp}${sp}${barLine}`,
  },
  {
    enumValue: KeySignature.F,
    text: `${barLine}${stave}${sp}${flat}${sp}${barLine}`,
  },
  {
    enumValue: KeySignature.Bb,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp.repeat(4)}${barLine}`,
  },
  {
    enumValue: KeySignature.Eb,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp}${stave}${sp}\uEB98${flat}${sp.repeat(3)}${barLine}`,
  },
  {
    enumValue: KeySignature.Ab,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp}${stave}${sp}\uEB98${flat}${sp}${stave}${sp}\uEB91${flat}${sp.repeat(3)}${barLine}`,
  },
  {
    enumValue: KeySignature.Db,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp}${stave}${sp}\uEB98${flat}${sp}${stave}${sp}\uEB91${flat}${sp}${stave}${sp}\uEB99${flat}${sp.repeat(3)}${barLine}`,
  },
  {
    enumValue: KeySignature.Gb,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp}${stave}${sp}\uEB98${flat}${sp}${stave}${sp}\uEB91${flat}${sp}${stave}${sp}\uEB99${flat}${sp}${stave}${sp}\uEB90${flat}${sp.repeat(3)}${barLine}`,
  },
  {
    enumValue: KeySignature.Cb,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp}${stave}${sp}\uEB98${flat}${sp}${stave}${sp}\uEB91${flat}${sp}${stave}${sp}\uEB99${flat}${sp}${stave}${sp}\uEB90${flat}${sp}${stave}${sp}\uEB9A${flat}${sp.repeat(3)}${barLine}`,
  },
];

function SignatureSelector() {
  const [selectedSignature, setSelectedSignature] = useState<KeySignature>(KeySignature.C);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = event.target.value as KeySignature;
    setSelectedSignature(selectedKey);
  };

  const handleClick = () => {
    EventNotifier.Notify('startAddingSignature', selectedSignature);
    console.log(selectedSignature);
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
      <button
        className={`${styles.button} ${styles.refreshButton}`}
        onClick={handleClick}>
        {signatures.find(sb => sb.enumValue === KeySignature.F)?.text}
      </button>
    </div>
  );
}

export default SignatureSelector;
