import React, { ReactElement, useState } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameter } from '@services/ConfigService/ConfigService.types';
import { EditorConfigMap } from '@components/ConfigManager/ConfigManager.types';
import getButtonIcon from '@assets/icons/getIcon';
import styles from './ConfigEditor.number.styles.module.css';

interface ConfigEditorNumberProps {
  paramName: SavedParameter['name'];
  paramValue: number;
}

function ConfigEditorNumber({
  paramName,
  paramValue,
}: ConfigEditorNumberProps): ReactElement | null {
  const initialValue = paramValue;
  const [inputValue, setInputValue] = useState(paramValue);

  const editorConfig = EditorConfigMap[paramName];
  const extraParams = editorConfig?.extraParams || {};
  const { min = 0, max = 100 } = extraParams;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) {
      setInputValue(newValue);
      await ConfigService.getInstance().updateValue(paramName, newValue);
    }
  };

  const resetToDefault = async () => {
    setInputValue(initialValue);
    await ConfigService.getInstance().updateValue(paramName, initialValue);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{paramName}</label>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type="number"
          value={inputValue}
          onChange={handleChange}
          min={min}
          max={max}
          step="1"
        />
        <button
          className={styles.resetButton}
          onClick={resetToDefault}
          title="Reset to Default">
          <img
            src={getButtonIcon('undo.svg')}
            alt={'Undo'}
          />
        </button>
      </div>
    </div>
  );
}

export default ConfigEditorNumber;
