import styles from './ConfigManager.styles.module.css';
import { SavedParameter, SavedParameterNames } from '@services/ConfigService/ConfigService.types';
import { ReactElement } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';

function ConfigManager(): ReactElement | null {
  const configService: ConfigService = ConfigService.getInstance();

  const renderValue = (paramValue: SavedParameter['value']): ReactElement => {
    if (typeof paramValue === 'string') {
      return <li>{paramValue}</li>;
    }

    if (typeof paramValue === 'number') {
      return <li>{paramValue}</li>;
    }

    return <li>Enum</li>;
  };

  return (
    <div className={styles.mainDiv}>
      <ul>
        {Object.values(SavedParameterNames).map(paramName =>
          renderValue(configService.getValue(paramName)),
        )}
      </ul>
    </div>
  );
}

export default ConfigManager;
