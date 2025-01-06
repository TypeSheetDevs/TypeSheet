import { useState } from 'react';
import { MidiService } from '@services/MidiService/MidiService';
import styles from './MidiSelector.styles.module.css';
import getButtonIcon from '@assets/icons/getIcon';

function MidiSelector() {
  const midiService = MidiService.getInstance();
  const ports = midiService.GetPorts();
  const [selectedPort, setSelectedPort] = useState<string | null>(null);

  const handlePortSelection = (portName: string) => {
    setSelectedPort(portName);
    midiService.ConnectToPort(portName);
  };

  const handleDisconnect = () => {
    midiService.Disconnect();
    setSelectedPort(null);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Select MIDI Port</h3>
      <div className={styles.ports}>
        {ports.map(port => (
          <button
            className={styles.portButton}
            key={port.name}
            onClick={() => handlePortSelection(port.name)}>
            <img
              src={getButtonIcon(
                selectedPort === port.name
                  ? 'radio_button_checked.svg'
                  : 'radio_button_unchecked.svg',
              )}
              alt={'radio button'}
              className={styles.portButtonImg}
              style={{
                filter:
                  selectedPort === port.name
                    ? 'brightness(40%) saturate(0%)'
                    : 'brightness(70%) saturate(0%)',
                transition: 'filter 0.3s ease',
              }}
            />
            <span>{port.name}</span>
          </button>
        ))}
      </div>
      <button
        className={styles.disconnectButton}
        onClick={handleDisconnect}
        disabled={!selectedPort}>
        Disconnect
      </button>
    </div>
  );
}

export default MidiSelector;
