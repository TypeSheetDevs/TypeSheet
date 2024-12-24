import React, { ReactElement, useState } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameter } from '@services/ConfigService/ConfigService.types';
import { EditorConfigMap } from '@components/ConfigManager/ConfigManager.types';
import styles from '@components/ConfigManager/ConfigEditors/ConfigEditor.enum.styles.module.css';
import editorStyles from '@components/ConfigManager/ConfigEditors/ConfigEditor.styles.module.css';
import getButtonIcon from '@assets/icons/getIcon';

interface ConfigEditorEnumProps {
  paramName: SavedParameter['name'];
  paramValue: string;
}

function ConfigEditorEnum({ paramName, paramValue }: ConfigEditorEnumProps): ReactElement | null {
  const initialValue = paramValue;
  const [inputValue, setInputValue] = useState(paramValue);

  const editorConfig = EditorConfigMap[paramName];
  const options = editorConfig?.extraParams?.options || [];

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    await ConfigService.getInstance().updateValue(paramName, newValue);
  };

  const resetToDefault = async () => {
    setInputValue(initialValue);
    await ConfigService.getInstance().updateValue(paramName, initialValue);
  };

  return (
    <div className={styles.enumEditorDiv}>
      <button
        className={editorStyles.resetButton}
        onClick={resetToDefault}>
        <img
          src={getButtonIcon('undo.svg')}
          alt={'Undo'}
        />
      </button>
      <select
        className={styles.enumInput}
        value={inputValue}
        onChange={handleChange}>
        {options.map((option: string) => (
          <option
            key={option}
            value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ConfigEditorEnum;
