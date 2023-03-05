import CalculatorBox from "../components/calculatorpage/CalculatorBox";
import styles from "./CalculatorPage.module.scss";

function CalculatorPage() {
  return (
    <div className={styles.page}>
      <CalculatorBox />
    </div>
  );
}

export default CalculatorPage;
