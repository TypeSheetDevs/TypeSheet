import styles from './SignatureSelector.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { KeySignature } from '@services/notationRenderer/Signature.types';

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
    group: 'Sharp Keys',
  },
  {
    enumValue: KeySignature.G,
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
    group: 'Sharp Keys',
  },
  {
    enumValue: KeySignature.D,
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
    group: 'Sharp Keys',
  },
  {
    enumValue: KeySignature.A,
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${stave}${sp}\uEB94${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
    group: 'Sharp Keys',
  },
  {
    enumValue: KeySignature.E,
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${stave}${sp}\uEB94${sharp}${sp}${stave}${sp}\uEB91${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
    group: 'Sharp Keys',
  },
  {
    enumValue: KeySignature.B,
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${stave}${sp}\uEB94${sharp}${sp}${stave}${sp}\uEB91${sharp}${sp}${stave}${sp}\uEB98${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
    group: 'Sharp Keys',
  },
  {
    enumValue: KeySignature['F#'],
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${stave}${sp}\uEB94${sharp}${sp}${stave}${sp}\uEB91${sharp}${sp}${stave}${sp}\uEB98${sharp}${sp}${stave}${sp}\uEB92${sharp}${sp}${narrowStave}${sp.repeat(2)}${barLine}`,
    group: 'Sharp Keys',
  },
  {
    enumValue: KeySignature['C#'],
    text: `${barLine}${stave}${sp}\uEB93${sharp}${sp}${stave}${sp}\uEB90${sharp}${sp}${stave}${sp}\uEB94${sharp}${sp}${stave}${sp}\uEB91${sharp}${sp}${stave}${sp}\uEB98${sharp}${sp}${stave}${sp}\uEB92${sharp}${sp}${stave}${sp}${sharp}${sp}${barLine}`,
    group: 'Sharp Keys',
  },
  {
    enumValue: KeySignature.F,
    text: `${barLine}${stave}${sp}${flat}${sp}${barLine}`,
    group: 'Flat Keys',
  },
  {
    enumValue: KeySignature.Bb,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp.repeat(4)}${barLine}`,
    group: 'Flat Keys',
  },
  {
    enumValue: KeySignature.Eb,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp}${stave}${sp}\uEB98${flat}${sp.repeat(3)}${barLine}`,
    group: 'Flat Keys',
  },
  {
    enumValue: KeySignature.Ab,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp}${stave}${sp}\uEB98${flat}${sp}${stave}${sp}\uEB91${flat}${sp.repeat(3)}${barLine}`,
    group: 'Flat Keys',
  },
  {
    enumValue: KeySignature.Db,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp}${stave}${sp}\uEB98${flat}${sp}${stave}${sp}\uEB91${flat}${sp}${stave}${sp}\uEB99${flat}${sp.repeat(3)}${barLine}`,
    group: 'Flat Keys',
  },
  {
    enumValue: KeySignature.Gb,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp}${stave}${sp}\uEB98${flat}${sp}${stave}${sp}\uEB91${flat}${sp}${stave}${sp}\uEB99${flat}${sp}${stave}${sp}\uEB90${flat}${sp.repeat(3)}${barLine}`,
    group: 'Flat Keys',
  },
  {
    enumValue: KeySignature.Cb,
    text: `${barLine}${stave}${sp}${flat}${stave}\uEB92${flat}${sp}${stave}${sp}\uEB98${flat}${sp}${stave}${sp}\uEB91${flat}${sp}${stave}${sp}\uEB99${flat}${sp}${stave}${sp}\uEB90${flat}${sp}${stave}${sp}\uEB9A${flat}${sp.repeat(3)}${barLine}`,
    group: 'Flat Keys',
  },
];

function SignatureSelector() {
  const color = ConfigService.getInstance().getValue(SavedParameterName.TopBarColor);

  const handleClick = (signature: KeySignature) => {
    NotationRenderer.getInstance().AddSignatureToChosenBar(signature);
  };

  // Group signatures by type
  const groupedSignatures = signatures.reduce(
    (acc, signature) => {
      if (!acc[signature.group]) {
        acc[signature.group] = [];
      }
      acc[signature.group].push(signature);
      return acc;
    },
    {} as Record<string, typeof signatures>,
  );

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: color }}>
      <label className={styles.header}>Select Key Signature</label>
      {Object.entries(groupedSignatures).map(([groupName, groupSignatures]) => (
        <div
          key={groupName}
          className={styles.buttonGroup}>
          <div className={styles.groupLabel}>{groupName}</div>
          <div className={styles.buttonRow}>
            {groupSignatures.map(signature => (
              <button
                key={signature.enumValue}
                className={styles.button}
                onClick={() => handleClick(signature.enumValue)}>
                {signature.text}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SignatureSelector;
