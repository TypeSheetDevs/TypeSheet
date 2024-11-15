import * as fs from 'fs';

export class ConfigService {
    private static _instance: ConfigService | null = null;
    private _configFilePath: string = '../../data/configJson.json';
    private _appConfig: AppConfig | null = null;

    public static async getInstance(): Promise<ConfigService> {
        if (!ConfigService._instance) {
            ConfigService._instance = new ConfigService();
            await ConfigService._instance.loadConfig();
        }

        return ConfigService._instance;
    }

    private constructor() {
        this.loadConfig();
    }

    public async loadConfig(): Promise<AppConfig | null> {
        try {
            const response = await fetch(this._configFilePath);
            console.log(response);
            if (!response.ok) throw new Error('Unable to read config file');

            const config = (await response.json()) as AppConfig;
            this._appConfig = config;
            return config;
        } catch (error) {
            console.error('Error loading configuration:', error);
            return null;
        }
    }

    public getConfig(): AppConfig | null {
        return this._appConfig;
    }

    public getConfigValue(name: string): string | null {
        const config = this._appConfig?.configs.find(config => config.name === name);
        return config ? config.value : null;
    }

    // not working
    public saveConfig(config: AppConfig): void {
        try {
            fs.writeFileSync(this._configFilePath, JSON.stringify(config, null, 2), 'utf-8');
            this._appConfig = config;
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }

    // not working
    public updateConfig(name: string, value: string): void {
        if (!this._appConfig) {
            this._appConfig = { configs: [] };
        }

        const existingConfig = this._appConfig.configs.find(config => config.name === name);

        if (existingConfig) {
            existingConfig.value = value;
        } else {
            this._appConfig.configs.push({ name, value });
        }

        this.saveConfig(this._appConfig);
    }
}
