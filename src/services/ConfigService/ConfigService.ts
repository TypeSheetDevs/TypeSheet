import * as fs from 'fs';

export class ConfigService {
    private static _instance: ConfigService | null = null;
    private _configFilePath: string = '../../src/data/configJson.json';
    private _appConfig: AppConfig | null = null;

    public static async getInstance(): Promise<ConfigService> {
        if (!ConfigService._instance) {
            ConfigService._instance = new ConfigService();
            await ConfigService._instance.loadConfig();
        }

        return ConfigService._instance;
    }

    public async loadConfig(): Promise<AppConfig> {
        const response = await window.api.readFile(this._configFilePath);
        const config: AppConfig = JSON.parse(response);
        this._appConfig = config;
        return config;
    }

    // not working
    public async saveConfig(): Promise<void> {
        try {
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

    public getValue(name: string): string | null {
        const config = this._appConfig?.configs.find(config => config.name === name);
        return config ? config.value : null;
    }

    public updateConfig(name: string, value: string): void {
        const existingConfig = this._appConfig?.configs.find(config => config.name === name);

        if (existingConfig) {
            existingConfig.value = value;
        }
    }
}
