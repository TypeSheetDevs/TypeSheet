import { MidiPort } from '@components/MidiSelector/MidiSelector.types';
import MIDIAccess = WebMidi.MIDIAccess;
import MIDIInput = WebMidi.MIDIInput;

export class MidiService {
    private static _instance: MidiService | null = null;
    private access: MIDIAccess | null = null;
    private inputs: MIDIInput[] = [];
    private connectedInput: MIDIInput | null = null;

    private noteStartTimes: Map<number, number> = new Map();

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

            this.inputs = Array.from(this.access.inputs.values());
            if (this.inputs.length === 0) {
                console.warn('No MIDI inputs available.');
                return;
            }
        } catch (error) {
            console.error('Error while connecting to MIDI:', error);
        }
    }

    public Disconnect(): void {
        if (this.connectedInput) {
            this.connectedInput.onmidimessage = null;
        }
        this.connectedInput = null;
        this.noteStartTimes.clear();
    }

    public ConnectToPort(portName: string): void {
        this.Disconnect();
        this.connectedInput = this.inputs.find(input => input.name === portName) ?? null;
        if (this.connectedInput) {
            console.log(`Connected to MIDI port: ${portName}`);
            this.connectedInput.onmidimessage = this.HandleMidiMessage.bind(this);
        } else {
            console.warn(`Port "${portName}" not found.`);
        }
    }

    private HandleMidiMessage(message: WebMidi.MIDIMessageEvent): void {
        const [status, note, velocity] = message.data;

        if (status === 144 && velocity > 0) {
            this.noteStartTimes.set(note, performance.now());
            console.log(`Note On: ${note} at ${this.noteStartTimes.get(note)} ms`);
        }

        if (status === 128 || (status === 144 && velocity === 0)) {
            const startTime = this.noteStartTimes.get(note);
            if (startTime) {
                const duration = performance.now() - startTime;
                console.log(`Note Off: ${note}. Duration: ${duration.toFixed(2)} ms`);
                this.noteStartTimes.delete(note);
            } else {
                console.warn(`Note Off received for ${note}, but no start time found.`);
            }
        }
    }
}
