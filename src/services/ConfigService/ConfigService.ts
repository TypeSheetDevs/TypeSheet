export class ConfigService {
    private static _instance: ConfigService | null = null;
    private _configFilePath: string = '';
    private _appConfig: AppConfig | null = null;

    public static async getInstance(): Promise<ConfigService> {
        if (!ConfigService._instance) {
            ConfigService._instance = new ConfigService();
            await ConfigService._instance.loadConfig();
        }

        return ConfigService._instance;
    }

    public async loadConfig(): Promise<void> {
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
    }

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
