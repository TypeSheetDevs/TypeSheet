import styles from './Tooltip.styles.module.css';

function Tooltip({ iconPath, content: Content }: TooltipProps) {
  return (
    <div className={styles.button}>
      <img
        draggable={false}
        src={iconPath}
      />
      <div className={styles.tooltip}>
        <Content />
      </div>
    </div>
  );
}

export default Tooltip;
