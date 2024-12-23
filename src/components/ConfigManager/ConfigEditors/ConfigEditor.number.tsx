import React, { ReactElement, useState } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameter } from '@services/ConfigService/ConfigService.types';
import { EditorConfigMap } from '@components/ConfigManager/ConfigManager.types';

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
    <div>
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        min={min}
        max={max}
        step="1"
      />
      <button onClick={resetToDefault}>Reset to Default</button>
    </div>
  );
}

export default ConfigEditorNumber;
