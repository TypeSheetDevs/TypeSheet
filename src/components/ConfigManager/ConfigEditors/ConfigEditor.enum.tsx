import React, { ReactElement, useState } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameter } from '@services/ConfigService/ConfigService.types';
import { EditorConfigMap } from '@components/ConfigManager/ConfigManager.types';

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
    <div>
      <select
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
      <button onClick={resetToDefault}>Reset to Default</button>
    </div>
  );
}

export default ConfigEditorEnum;
