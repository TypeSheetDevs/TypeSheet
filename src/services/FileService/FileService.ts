export class FileService {
    private static _instance: FileService = null!;

    public static getInstance(): FileService {
        if (!FileService._instance) {
            FileService._instance = new FileService();
        }

        return FileService._instance;
    }

    // reads contents of file located under filePath
    public async ReadFile(filePath: string): Promise<string> {
        const result = await window.api.readFile(filePath);
        if (!result.success || !result.content) {
            throw new Error(`Failed to read file: ${result.error || 'Unknown error'}`);
        }

        return result.content;
    }

    // saves contents to file located under filePath
    public async SaveFile(filePath: string, content: string): Promise<void> {
        const result = await window.api.saveFile(filePath, content);
        if (!result.success) {
            throw new Error(`Failed to save file: ${result.error || 'Unknown error'}`);
        }
    }

    // returns a filePath to read from
    public async ReadFileDialog(): Promise<string> {
        const result = await window.api.readFileDialog();
        if (!result.success || !result.filePath) {
            throw new Error(`Open file dialog failed with: ${result.error || 'Unknown error'}`);
        }
        return result.filePath;
    }

    // returns a filePath to save to
    public async SaveFileDialog(): Promise<string> {
        const result = await window.api.saveFileDialog();
        if (!result.success || !result.filePath) {
            throw new Error(`Open file dialog failed with: ${result.error || 'Unknown error'}`);
        }

        return result.filePath;
    }

    public async ReadJsonFile<T>(filePath: string): Promise<T> {
        try {
            const fileContent = await this.ReadFile(filePath);
            // Parse the content into the specified type
            return JSON.parse(fileContent);
        } catch (error) {
            throw new Error(
                `Failed to parse JSON from file: ${filePath}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }
}
