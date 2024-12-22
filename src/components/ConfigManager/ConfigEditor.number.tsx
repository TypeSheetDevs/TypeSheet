import React, { ReactElement, useState } from 'react';

interface ConfigEditorNumberProps {
  paramValue: number;
}

function ConfigEditorNumber({ paramValue }: ConfigEditorNumberProps): ReactElement | null {
  const [inputValue, setInputValue] = useState(paramValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) {
      setInputValue(newValue);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        step="1"
        min="0"
      />
    </div>
  );
}

export default ConfigEditorNumber;
