import styles from './Tooltip.styles.module.css';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { ConfigService } from '@services/ConfigService/ConfigService';

function Tooltip({ iconPath, content, usedPadding }: TooltipProps) {
  return (
    <div className={styles.button}>
      <img
        draggable={false}
        src={iconPath}
        style={{
          color: ConfigService.getInstance().getValue(SavedParameterName.TopBarTextColor),
        }}
      />
      <div
        className={styles.tooltip}
        style={{ padding: usedPadding }}>
        {content}
      </div>
    </div>
  );
}

export default Tooltip;
