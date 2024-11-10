import './Button.styles.css';

function Button({ iconPath, onClick }) {
  return (
    <button
      className="button"
      onClick={onClick}>
      <img src={iconPath} />
    </button>
  );
}

export default Button;
