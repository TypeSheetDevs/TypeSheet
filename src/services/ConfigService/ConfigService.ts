import { ConfigTypes, DefaultConfig, TypeCasters } from './ConfigService.types';

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

    public getValue<K extends keyof ConfigTypes>(
        configName: K,
        validator?: (value: ConfigTypes[K]) => boolean,
    ): ConfigTypes[K] {
        const defaultValue = DefaultConfig[configName];
        if (!this._appConfig) {
            console.warn('Config is not loaded or was corrupted.');
            return defaultValue;
        }

        const config = this._appConfig.configs.find(config => config.name === configName);
        if (config) {
            const castValue = TypeCasters[configName](config.value);
            if (!castValue) {
                return defaultValue;
            }

            if (validator && !validator(castValue)) {
                console.warn(`Validation failed for config "${configName}" with value:`, castValue);
                return defaultValue;
            }

            return castValue;
        }

        return defaultValue;
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
