import { MidiPort } from '@components/MidiSelector/MidiSelector.types';
import MIDIAccess = WebMidi.MIDIAccess;
import MIDIInput = WebMidi.MIDIInput;

export class MidiService {
    private static _instance: MidiService | null = null;
    private access: MIDIAccess | null = null;
    private inputs: MIDIInput[] = [];
    private connectedInput: MIDIInput | null = null;

    public static getInstance(): MidiService {
        if (!MidiService._instance) {
            MidiService._instance = new MidiService();
        }

        return MidiService._instance;
    }

    public GetPorts(): MidiPort[] {
        return this.inputs
            .filter(input => input.name)
            .map(input => {
                return { name: input.name!, connected: input === this.connectedInput };
            });
    }

    public async Init(): Promise<void> {
        try {
            this.access = await navigator.requestMIDIAccess();

            if (!this.access) {
                console.warn(`Could not connect to MIDIAccess service`);
                return;
            }

            console.log('MIDI Access granted.');

            this.inputs = Array.from(this.access.inputs.values());
            console.log('Available MIDI inputs:', this.inputs);

            if (this.inputs.length === 0) {
                console.warn('No MIDI inputs available.');
                return;
            }

            // const input = inputs[0];
            // console.log(`Connected to input: ${input.name}`);
            //
            // input.onmidimessage = message => {
            //     const [status, note, velocity] = message.data;
            //
            //     if (status === 144 && velocity > 0) {
            //         console.log(`Note On: ${note}`);
            //     } else if (status === 128 || velocity === 0) {
            //         console.log(`Note Off: ${note}`);
            //     }
            // };
        } catch (error) {
            console.error('Error while connecting to MIDI:', error);
        }
    }

    public ConnectToPort(portName: string) {
        this.connectedInput = this.inputs.find(input => input.name === portName) ?? null;
    }
}
