export class FileService {
    private static _instance: FileService = null!;

    public static getInstance(): FileService {
        if (!FileService._instance) {
            FileService._instance = new FileService();
        }

        return FileService._instance;
    }

    public async ReadFile(filePath: string): Promise<string> {
        const result = await window.api.readFile(filePath);
        if (!result.success || !result.content) {
            throw new Error(`Failed to read file: ${result.error || 'Unknown error'}`);
        }

        return result.content;
    }

    public async SaveFile(filePath: string, content: string): Promise<void> {
        const result = await window.api.saveFile(filePath, content);
        if (!result.success) {
            throw new Error(`Failed to save file: ${result.error || 'Unknown error'}`);
        }
    }
}
