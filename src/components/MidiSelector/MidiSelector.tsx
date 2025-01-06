import { useState } from 'react';
import { MidiService } from '@services/MidiService/MidiService';
import styles from './MidiSelector.styles.module.css';

function MidiSelector() {
  const midiService = MidiService.getInstance();
  const ports = midiService.GetPorts();
  const [selectedPort, setSelectedPort] = useState<string | null>(null);

  const handlePortSelection = (portName: string) => {
    setSelectedPort(portName);
    midiService.ConnectToPort(portName);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Select MIDI Port</h3>
      <div>
        {ports.map(port => (
          <div
            key={port.name}
            className={styles.listItem}>
            <input
              type="radio"
              value={port.name}
              className={styles.radioInput}
              checked={selectedPort === port.name}
              onChange={() => handlePortSelection(port.name)}
            />
            <span className={styles.label}>{port.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MidiSelector;
