import { useState } from 'react';
import { MidiService } from '@services/MidiService/MidiService';
import styles from './MidiSelector.styles.module.css';
import getButtonIcon from '@assets/icons/getIcon';

function MidiSelector() {
  const midiService = MidiService.getInstance();
  const [ports, setPorts] = useState(midiService.GetPorts());
  const [selectedPortName, setSelectedPortName] = useState<string | null>(getSelectedPortName());

  function getSelectedPortName(): string | null {
    return ports.find(port => port.connected)?.name ?? null;
  }

  const handlePortSelection = (portName: string) => {
    midiService.ConnectToPort(portName);
    setPorts(midiService.GetPorts());
    setSelectedPortName(portName);
  };

  const handleDisconnect = () => {
    midiService.Disconnect();
    setPorts(midiService.GetPorts());
    setSelectedPortName(null);
  };

  const handleRefresh = async () => {
    await midiService.Refresh();
    setPorts(midiService.GetPorts());
    setSelectedPortName(getSelectedPortName());
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
                selectedPortName === port.name
                  ? 'radio_button_checked.svg'
                  : 'radio_button_unchecked.svg',
              )}
              alt={'radio button'}
              className={styles.portButtonImg}
              style={{
                filter:
                  selectedPortName === port.name
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
        className={`${styles.button} ${styles.refreshButton}`}
        onClick={handleRefresh}>
        Refresh
      </button>
      <button
        className={`${styles.button} ${styles.disconnectButton}`}
        onClick={handleDisconnect}
        disabled={!selectedPortName}>
        Disconnect
      </button>
    </div>
  );
}

export default MidiSelector;
