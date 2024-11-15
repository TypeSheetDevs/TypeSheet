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

    // not working
    public saveConfig(): void {
        try {
            fs.writeFileSync(
                this._configFilePath,
                JSON.stringify(this._appConfig, null, 2),
                'utf-8',
            );
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }

    public getConfigValue(name: string): string | null {
        const config = this._appConfig?.configs.find(config => config.name === name);
        return config ? config.value : null;
    }

    public updateConfig(name: string, value: string): void {
        if (!this._appConfig) {
            this._appConfig = { configs: [] };
        }

        const existingConfig = this._appConfig.configs.find(config => config.name === name);

        if (existingConfig) {
            existingConfig.value = value;
        }
    }
}
