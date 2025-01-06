export class MidiService {
    private static _instance: MidiService | null = null;

    public static getInstance(): MidiService {
        if (!MidiService._instance) {
            MidiService._instance = new MidiService();
        }

        return MidiService._instance;
    }

    public async Connect(): Promise<void> {
        try {
            const access = await navigator.requestMIDIAccess();

            console.log('MIDI Access granted.');

            const inputs = Array.from(access.inputs.values());
            console.log('Available MIDI inputs:', inputs);

            if (inputs.length === 0) {
                console.warn('No MIDI inputs available.');
                return;
            }

            const input = inputs[0];
            console.log(`Connected to input: ${input.name}`);

            input.onmidimessage = message => {
                const [status, note, velocity] = message.data;

                if (status === 144 && velocity > 0) {
                    console.log(`Note On: ${note}`);
                } else if (status === 128 || velocity === 0) {
                    console.log(`Note Off: ${note}`);
                }
            };
        } catch (error) {
            console.error('Error while connecting to MIDI:', error);
        }
    }
}
