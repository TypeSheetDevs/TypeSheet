import styles from './ConfigManager.styles.module.css';
import { SavedParameter, SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { ReactElement } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import ConfigEditorNumber from '@components/ConfigManager/ConfigEditor.number';
import ConfigEditorString from '@components/ConfigManager/ConfigEditor.string';

function ConfigManager(): ReactElement | null {
  const configService: ConfigService = ConfigService.getInstance();

  const renderValue = (paramValue: SavedParameter['value']): ReactElement => {
    if (typeof paramValue === 'string') {
      return <ConfigEditorString paramValue={paramValue}></ConfigEditorString>;
    }

    if (typeof paramValue === 'number') {
      return <ConfigEditorNumber paramValue={paramValue}></ConfigEditorNumber>;
    }

    return <li style={{ backgroundColor: 'red' }}>Enum</li>;
  };

  return (
    <div className={styles.mainDiv}>
      {Object.values(SavedParameterName).map(paramName => (
        <div key={paramName}>{renderValue(configService.getValue(paramName))}</div>
      ))}
    </div>
  );
}

export default ConfigManager;
