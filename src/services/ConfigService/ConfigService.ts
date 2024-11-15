import * as fs from 'fs';
import * as path from 'path';

export class ConfigService {
    private static _instance: ConfigService | null = null;
    private _configPath: string = '';
    private _config: AppConfig | null = null;

    public static getInstance(): ConfigService {
        if (!ConfigService._instance) {
            ConfigService._instance = new ConfigService();
            ConfigService._instance.loadConfig();
        }

        return ConfigService._instance;
    }

    private constructor() {
        this.loadConfig();
    }

    public loadConfig(): void {
        try {
            const configData = fs.readFileSync(this._configPath, 'utf-8');
            this._config = JSON.parse(configData) as AppConfig;
            console.log('Configuration loaded successfully.');
        } catch (error) {
            console.error('Error loading configuration:', error);
            this._config = { configs: [] };
        }
    }

    public getConfig(): AppConfig | null {
        return this._config;
    }

    public saveConfig(config: AppConfig): void {
        try {
            fs.writeFileSync(this._configPath, JSON.stringify(config, null, 2), 'utf-8');
            this._config = config;
            console.log('Configuration saved successfully.');
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }

    public updateConfig(name: string, value: string): void {
        if (!this._config) {
            this._config = { configs: [] };
        }

        const existingConfig = this._config.configs.find(config => config.name === name);

        if (existingConfig) {
            existingConfig.value = value;
        } else {
            this._config.configs.push({ name, value });
        }

        this.saveConfig(this._config);
    }

    public getConfigValue(name: string): string | null {
        const config = this._config?.configs.find(config => config.name === name);
        return config ? config.value : null;
    }
}
