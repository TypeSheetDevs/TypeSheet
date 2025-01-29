import styles from './Button.styles.module.css';
import CssFilterConverter from 'css-filter-converter';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { CSSProperties } from 'react';

function Button({ iconPath, onClick }: ButtonType) {
  return (
    <button
      className={styles.button}
      style={
        {
          '--hover-color': ConfigService.getInstance().getValue(
            SavedParameterName.TopBarHighlightColor,
          ),
        } as CSSProperties
      }
      onClick={onClick}>
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
    </button>
  );
}

export default Button;
