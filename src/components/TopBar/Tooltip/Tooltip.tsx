import styles from './Tooltip.styles.module.css';

function Tooltip({ iconPath, content, usedPadding }: TooltipProps) {
  return (
    <div className={styles.button}>
      <img
        draggable={false}
        src={iconPath}
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
