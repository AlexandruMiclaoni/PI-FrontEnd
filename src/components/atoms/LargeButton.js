import './atoms-style.css';

const LargeButton = ({ _label, _type }) => {
  return <button type={_type}>{_label}</button>;
};

export default LargeButton;