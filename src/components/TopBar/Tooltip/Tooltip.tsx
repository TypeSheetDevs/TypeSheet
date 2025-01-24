import styles from './Tooltip.styles.module.css';

function Tooltip({ iconPath, content }: TooltipProps) {
  return (
    <div className={styles.button}>
      <img
        draggable={false}
        src={iconPath}
      />
      <div className={styles.tooltip}>{content}</div>
    </div>
  );
}

export default Tooltip;
