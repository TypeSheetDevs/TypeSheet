export class ConfigService {
    private static _instance: ConfigService | null = null;
    private _configFilePath: string = '';
    private _appConfig: AppConfig | null = null;
    private _configLoaded: Promise<void> | null = null;

    public static async getInstance(): Promise<ConfigService> {
        if (!ConfigService._instance) {
            ConfigService._instance = new ConfigService();
            ConfigService._instance._configLoaded = ConfigService._instance.loadConfig();
        }

        await ConfigService._instance._configLoaded;

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

    public async getValue(configName: string): Promise<string | null> {
        await this._configLoaded;
        if (!this._appConfig) {
            console.warn('Config is not loaded or was corrupted.');
            return null;
        }

        const config = this._appConfig.configs.find(config => config.name === configName);
        return config ? config.value : null;
    }

    public async updateValue(configName: string, value: string): Promise<void> {
        await this._configLoaded;
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
