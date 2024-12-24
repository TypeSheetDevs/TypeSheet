import { ReactElement } from 'react';
import styles from './ConfigManager.styles.module.css';
import { SavedParameter, SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { EditorConfigMap, EditorType } from '@components/ConfigManager/ConfigManager.types';
import ConfigEditorNumber from '@components/ConfigManager/ConfigEditors/ConfigEditor.number';
import ConfigEditorString from '@components/ConfigManager/ConfigEditors/ConfigEditor.string';
import ConfigEditorColor from '@components/ConfigManager/ConfigEditors/ConfigEditor.color';
import ConfigEditorEnum from '@components/ConfigManager/ConfigEditors/ConfigEditor.enum';

function ConfigManager(): ReactElement | null {
  const configService: ConfigService = ConfigService.getInstance();

  const renderConfigEditor = (
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

      case EditorType.Color:
        return (
          <ConfigEditorColor
            paramName={paramName}
            paramValue={paramValue as string}
          />
        );

      case EditorType.Enum:
        return (
          <ConfigEditorEnum
            paramName={paramName}
            paramValue={paramValue as string}
          />
        );

      default:
        return <li style={{ backgroundColor: 'red' }}>Unsupported Type</li>;
    }
  };

  return (
    <div className={styles.mainDiv}>
      {Object.values(SavedParameterName).map(paramName => (
        <div
          className={styles.configItem}
          key={paramName}>
          <label>{paramName}</label>
          {renderConfigEditor(paramName, configService.getValue(paramName))}
        </div>
      ))}
    </div>
  );
}

export default ConfigManager;
