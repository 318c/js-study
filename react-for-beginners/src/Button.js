import PropTypes from "prop-types";
import styles from "./Button.module.css";

function Button({text}) {
  console.log(styles.btn)
  return (
    <button className={styles.btn}>
    {text}
    </button>
  );
}

Button.propTypes = {
  test: PropTypes.string,
};

export default Button;