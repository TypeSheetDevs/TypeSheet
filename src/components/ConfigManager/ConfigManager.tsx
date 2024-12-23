import styles from './ConfigManager.styles.module.css';
import { SavedParameter, SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { ReactElement } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import ConfigEditorNumber from '@components/ConfigManager/ConfigEditor.number';
import ConfigEditorString from '@components/ConfigManager/ConfigEditor.string';

function ConfigManager(): ReactElement | null {
  const configService: ConfigService = ConfigService.getInstance();

  const renderValue = (
    paramName: SavedParameter['name'],
    paramValue: SavedParameter['value'],
  ): ReactElement => {
    if (typeof paramValue === 'string') {
      return (
        <ConfigEditorString
          paramName={paramName}
          paramValue={paramValue}
        />
      );
    }

    if (typeof paramValue === 'number') {
      return (
        <ConfigEditorNumber
          paramName={paramName}
          paramValue={paramValue}
        />
      );
    }

    return <li style={{ backgroundColor: 'red' }}>Enum</li>;
  };

  return (
    <div className={styles.mainDiv}>
      {Object.values(SavedParameterName).map(paramName => (
        <div key={paramName}>{renderValue(paramName, configService.getValue(paramName))}</div>
      ))}
    </div>
  );
}

export default ConfigManager;
