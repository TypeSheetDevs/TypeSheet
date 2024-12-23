import React, { ReactElement, useState } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameter } from '@services/ConfigService/ConfigService.types';

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
    <div>
      <input
        type="color"
        value={inputValue}
        onChange={handleChange}
      />
      <button onClick={resetToDefault}>Reset to Default</button>
    </div>
  );
}

export default ConfigEditorColor;
