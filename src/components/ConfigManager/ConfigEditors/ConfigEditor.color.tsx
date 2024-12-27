import React, { ReactElement, useState } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameter } from '@services/ConfigService/ConfigService.types';
import getButtonIcon from '@assets/icons/getIcon';
import styles from './ConfigEditor.color.styles.module.css';
import editorStyles from './ConfigEditor.styles.module.css';

interface ConfigEditorColorProps {
  paramName: SavedParameter['name'];
  paramValue: string;
}

function ConfigEditorColor({ paramName, paramValue }: ConfigEditorColorProps): ReactElement | null {
  const initialValue = paramValue;
  const [inputValue, setInputValue] = useState(paramValue);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    await ConfigService.getInstance().updateValue(paramName, newValue);
  };

  const resetToDefault = async () => {
    setInputValue(initialValue);
    await ConfigService.getInstance().updateValue(paramName, initialValue);
  };

  return (
    <div className={styles.colorEditorDiv}>
      <button
        className={editorStyles.resetButton}
        onClick={resetToDefault}>
        <img
          src={getButtonIcon('undo.svg')}
          alt={'Undo'}
        />
      </button>
      <input
        className={styles.colorInput}
        type="color"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
}

export default ConfigEditorColor;
