function Tooltip({ iconPath, content: Content }: TooltipProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={iconPath}
        alt="tooltip icon"
      />
      <div
        style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)' }}>
        <Content />
      </div>
    </div>
  );
}

export default Tooltip;
