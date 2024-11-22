import { ConfigTypes, DefaultConfig, TypeCasters } from './ConfigService.types';
import { ViewType } from '@pages/MainView/MainView.types';
import { ConfigKey } from '@services/ConfigService/ConfigKey';

type AppConfig = {
    configs: SavedParameter[];
};

type SavedParameter =
    | {
          name: 'StartingView';
          value: ViewType;
      }
    | { name: 'BarsPerStave'; value: number;  }
    | { name: 'StaveMinimumHeightDistance'; value: number }
    | { name: 'MainViewMargin'; value: number }
    | { name: 'StavesPerPage'; value: number }
    | { name: 'TopBarColor'; value: string };

type ValueOf<T extends SavedParameter['name']> = Extract<SavedParameter, { name: T }>['value'];

export class ConfigService {
    private static _instance: ConfigService | null = null;
    private _configFilePath: string = '';
    private _appConfig: AppConfig | null = null;

    public static getInstance(): ConfigService {
        if (!ConfigService._instance) {
            ConfigService._instance = new ConfigService();
        }

        return ConfigService._instance;
    }

    public async loadConfig(): Promise<void> {
        try {
            const globalPathResponse = await window.api.getGlobalPath('src/data/configJson.json');

            if (!globalPathResponse.success || !globalPathResponse.path) {
                throw new Error(
                    `Failed to get global path: ${globalPathResponse.error || 'Unknown error'}`,
                );
            }

            this._configFilePath = globalPathResponse.path;

            const readFileResponse = await window.api.readFile(this._configFilePath);

            if (!readFileResponse.success || !readFileResponse.content) {
                throw new Error(
                    `Failed to read config file: ${readFileResponse.error || 'Unknown error'}`,
                );
            }

            try {
                this._appConfig = JSON.parse(readFileResponse.content) as AppConfig;
            } catch (error) {
                throw new Error(`Failed to parse config file: ${(error as Error).message}`);
            }
        } catch (error) {
            console.error('Error loading config:', error);
            throw error;
        }
    }

    public getValue<T extends SavedParameter['name']>(name: T): ValueOf<T> {
        //const defaultValue = DefaultConfig[name];

        const config = this._appConfig?.configs.find((param) => param.name === name);

        // if (!config) {
        //     console.warn(`Configuration "${name}" not found. Returning default value.`);
        //     return DefaultConfig[name]; // Assuming DefaultConfig is defined somewhere
        // }

        return config.value as ValueOf<T>;
    }

    public async updateValue(configName: string, value: string): Promise<void> {
        if (!this._appConfig) {
            console.warn('Config is not loaded or was corrupted.');
            return;
        }

        const existingConfig = this._appConfig.configs.find(config => config.name === configName);
        if (existingConfig) {
            existingConfig.value = value;
            await this.saveConfig();
        }
    }

    private async saveConfig(): Promise<void> {
        try {
            if (!this._appConfig) {
                throw new Error('No config data available to save');
            }

            const content = JSON.stringify(this._appConfig, null, 2);
            const result = await window.api.saveFile(this._configFilePath, content);
            if (!result.success) {
                throw new Error(result.error || 'Unknown error occurred while saving the config');
            }

            console.log('Configuration saved successfully.');
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }
}
