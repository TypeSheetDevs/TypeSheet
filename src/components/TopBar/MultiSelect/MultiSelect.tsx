import styles from './MultiSelect.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';

function MultiSelect({ iconPath, groups }: MultiSelectProps) {
  return (
    <div className={styles.button}>
      <img
        draggable={false}
        src={iconPath}
      />
      <div
        className={styles.card}
        style={{
          backgroundColor: ConfigService.getInstance().getValue(SavedParameterName.TopBarColor),
        }}>
        {groups.map((group, index, array) => (
          <>
            <ul
              className={styles.list}
              key={index}>
              {group.options.map((option, index) => (
                <li
                  className={styles.element}
                  key={index}
                  onClick={option.onClick}>
                  <p className={styles.label}>{option.text}</p>
                </li>
              ))}
            </ul>
            {array.length - 1 !== index ? <div className={styles.separator}></div> : <></>}
          </>
        ))}
      </div>
    </div>
  );
}

export default MultiSelect;
