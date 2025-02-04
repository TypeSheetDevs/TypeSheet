// noinspection ExceptionCaughtLocallyJS

import {
    AppConfig,
    SavedParameter,
    SavedParameterName,
    ValueOf,
} from '@services/ConfigService/ConfigService.types';
import DefaultConfig from '@services/ConfigService/DefaultConfig';
import { FileService } from '@services/FileService/FileService';

export class ConfigService {
    private static _instance: ConfigService | null = null;
    private _fileService: FileService = FileService.getInstance();
    private _configFilePath = '';
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

            const fileContent = await this._fileService.ReadFile(this._configFilePath);

            try {
                this._appConfig = JSON.parse(fileContent) as AppConfig;
            } catch (error) {
                throw new Error(`Failed to parse config file: ${(error as Error).message}`);
            }
        } catch (error) {
            await this.CreateConfigFile();
            console.error('Error loading config:', error);
        }
    }

    private async CreateConfigFile(): Promise<void> {
        const appConfig: AppConfig = {
            configs: Object.entries(DefaultConfig).map(([name, value]) => ({
                name: name as SavedParameterName,
                value,
            })) as SavedParameter[],
        };

        await this._fileService.SaveFile(this._configFilePath, JSON.stringify(appConfig, null, 2));
    }

    public getValue<T extends SavedParameter['name']>(name: T): ValueOf<T> {
        const config = this._appConfig?.configs?.find(param => param.name === name);

        const defaultValue = DefaultConfig[name] as ValueOf<T>;

        if (!config || config.value === null || typeof config.value !== typeof defaultValue) {
            console.warn(
                `Configuration "${name}" not found or its value is faulty. Returning default value.`,
            );
            return defaultValue;
        }

        return config.value as ValueOf<T>;
    }

    public async updateValue<T extends SavedParameter['name']>(
        name: T,
        value: ValueOf<T>,
    ): Promise<void> {
        if (!this._appConfig) {
            console.warn('Config is not loaded or was corrupted.');
            return;
        }

        const existingConfig = this._appConfig?.configs?.find(config => config.name === name);

        if (!existingConfig) {
            console.warn(`Configuration "${name}" not found. No update performed.`);
            return;
        }

        if (!value) {
            console.warn(
                `Provided value for configuration "${name}" is faulty. No update performed.`,
            );
            return;
        }

        existingConfig.value = value;
        await this.saveConfig();
    }

    public async saveConfig(): Promise<void> {
        try {
            if (!this._appConfig) {
                throw new Error('No config data available to save');
            }

            const content = JSON.stringify(this._appConfig, null, 2);
            await this._fileService.SaveFile(this._configFilePath, content);
            console.log('Configuration saved successfully.');
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }
}
