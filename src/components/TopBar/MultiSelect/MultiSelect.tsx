import styles from './MultiSelect.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import CssFilterConverter from 'css-filter-converter';
import { CSSProperties } from 'react';

function MultiSelect({ iconPath, groups }: MultiSelectProps) {
  return (
    <div
      className={styles.button}
      style={
        {
          '--hover-color': ConfigService.getInstance().getValue(
            SavedParameterName.TopBarHighlightColor,
          ),
        } as CSSProperties
      }>
      <img
        draggable={false}
        src={iconPath}
        style={{
          filter:
            CssFilterConverter.hexToFilter(
              ConfigService.getInstance().getValue(SavedParameterName.TopBarTextColor),
            ).color ?? '',
        }}
      />
      <div
        className={styles.card}
        style={{
          backgroundColor: ConfigService.getInstance().getValue(SavedParameterName.TopBarColor),
        }}>
        {groups.map((group, index, array) => (
          <div key={index}>
            <ul className={styles.list}>
              {group.options.map((option, index) => (
                <li
                  className={styles.element}
                  key={index}
                  onClick={option.onClick}>
                  <p
                    className={styles.label}
                    style={{
                      color: ConfigService.getInstance().getValue(
                        SavedParameterName.TopBarTextColor,
                      ),
                    }}>
                    {option.text}
                  </p>
                </li>
              ))}
            </ul>
            {array.length - 1 !== index ? <div className={styles.separator}></div> : <></>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultiSelect;
