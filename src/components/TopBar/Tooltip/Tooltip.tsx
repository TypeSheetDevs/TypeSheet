import styles from './Tooltip.styles.module.css';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { ConfigService } from '@services/ConfigService/ConfigService';
import CssFilterConverter from 'css-filter-converter';
import SignatureSelector from '@components/SignatureSelector/SignatureSelector';
import { CSSProperties } from 'react';

function Tooltip({ iconPath, content, usedPadding, IsSignatureSelector }: TooltipProps) {
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
        className={styles.tooltip}
        style={{ padding: usedPadding }}>
        {IsSignatureSelector ? <SignatureSelector /> : content}
      </div>
    </div>
  );
}

export default Tooltip;
