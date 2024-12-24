import React, { ReactElement, useState } from 'react';
import { SavedParameter } from '@services/ConfigService/ConfigService.types';
import { ConfigService } from '@services/ConfigService/ConfigService';
import getButtonIcon from '@assets/icons/getIcon';

interface ConfigEditorStringProps {
  paramName: SavedParameter['name'];
  paramValue: string;
}

function ConfigEditorString({
  paramName,
  paramValue,
}: ConfigEditorStringProps): ReactElement | null {
  const initialValue = paramValue;
  const [inputValue, setInputValue] = useState(paramValue);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    await ConfigService.getInstance().updateValue(paramName, paramValue);
  };

  const resetToDefault = async () => {
    setInputValue(initialValue);
    await ConfigService.getInstance().updateValue(paramName, paramValue);
  };

  return (
    <div>
      <button onClick={resetToDefault}>
        <img
          src={getButtonIcon('undo.svg')}
          alt="undo"
        />
      </button>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
}

export default ConfigEditorString;
