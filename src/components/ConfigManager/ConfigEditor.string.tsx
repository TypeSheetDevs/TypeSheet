import React, { ReactElement, useState } from 'react';

interface ConfigEditorStringProps {
  paramValue: string;
}

function ConfigEditorString({ paramValue }: ConfigEditorStringProps): ReactElement | null {
  const [inputValue, setInputValue] = useState(paramValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
}

export default ConfigEditorString;
