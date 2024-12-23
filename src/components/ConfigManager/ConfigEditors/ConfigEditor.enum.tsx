import React, { ReactElement, useState } from 'react';

interface ConfigEditorEnumProps {
  paramValue: string;
  enumValues: string[];
}

function ConfigEditorEnum({ paramValue, enumValues }: ConfigEditorEnumProps): ReactElement | null {
  const [inputValue, setInputValue] = useState<string>(paramValue);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  const handleBlur = (): void => {
    console.log(inputValue);
  };

  return (
    <div>
      <select
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}>
        {enumValues.map(enumValue => (
          <option
            key={enumValue}
            value={enumValue}>
            {enumValue}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ConfigEditorEnum;
