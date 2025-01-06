import { useState } from 'react';
import { MidiService } from '@services/MidiService/MidiService';

function MidiPortSelector() {
  const ports = MidiService.getInstance().GetPorts();
  const [selectedPort, setSelectedPort] = useState<string | null>(null);

  const handlePortSelection = (portName: string) => {
    setSelectedPort(portName);
    MidiService.getInstance().ConnectToPort(portName);
  };

  return (
    <div>
      <h3>Select MIDI Port</h3>
      {ports.length === 0 ? (
        <p>No MIDI ports available</p>
      ) : (
        <ul>
          {ports.map(port => (
            <li key={port.name}>
              <label>
                <input
                  type="radio"
                  name="midi-port"
                  value={port.name}
                  checked={selectedPort === port.name}
                  onChange={() => handlePortSelection(port.name)}
                />
                {port.name} {port.connected ? '(Connected)' : ''}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MidiPortSelector;
