import styles from './ConfigManager.styles.module.css';
import { SavedParameter, SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { ReactElement } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import ConfigEditorNumber from '@components/ConfigManager/ConfigEditor.number';
import ConfigEditorString from '@components/ConfigManager/ConfigEditor.string';
import { EditorConfigMap, EditorType } from '@components/ConfigManager/ConfigManager.types';

function ConfigManager(): ReactElement | null {
  const configService: ConfigService = ConfigService.getInstance();

  const renderValue = (
    paramName: SavedParameter['name'],
    paramValue: SavedParameter['value'],
  ): ReactElement => {
    const editorConfig = EditorConfigMap[paramName];

    switch (editorConfig.editorType) {
      case EditorType.Text:
        return (
          <ConfigEditorString
            paramName={paramName}
            paramValue={paramValue as string}
          />
        );

      case EditorType.Number:
        return (
          <ConfigEditorNumber
            paramName={paramName}
            paramValue={paramValue as number}
          />
        );

      default:
        return <li style={{ backgroundColor: 'red' }}>Unsupported Type</li>;
    }
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
