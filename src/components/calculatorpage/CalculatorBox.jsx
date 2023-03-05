import { useState } from "react";
import parse from "html-react-parser";
import {
  separatorHandler,
  parenthesisHandler,
  calculatorHandler,
} from "./modules/calculatorHandlers";
import styles from "./CalculatorBox.module.scss";

const CalculatorBox = () => {
  const [memory, setMemory] = useState({
    formula: "",
    ans: "",
    inv: false,
    angle: "rad",
    // history: [],
    // eventListener: () => {},
  });

  const formulaHandler = (operation) => {
    if (operation === "rad" || operation === "deg") {
      setMemory({ ...memory, angle: operation });
    } else if (operation === "=") {
      try {
        let formula = parenthesisHandler(separatorHandler(memory.formula));
        let result = calculatorHandler({
          formula,
          start: 0,
          end: formula.length - 1,
          angle: memory.angle,
        });
        setMemory({ ...memory, ans: result, formula: "" });
      } catch (error) {
        setMemory({ ...memory, ans: error.message });
      }
    } else if (operation === "inv") {
      setMemory({ ...memory, inv: !memory.inv });
    } else if (operation === "CE") {
      if (memory.formula.length > 0) {
        setMemory({
          ...memory,
          formula: memory.formula.substring(0, memory.formula.length - 1),
        });
      }
    } else if (operation === "C") {
      setMemory({ ...memory, formula: "" });
    } else if (operation === "Ans") {
      if (!isNaN(memory.ans) && isFinite(memory.ans)) {
        setMemory({
          ...memory,
          formula:
            memory.formula +
            (memory.formula.length > 0 &&
            !isNaN(
              memory.formula[memory.formula.length - 1] ||
                memory.formula[memory.formula.length - 1] === "."
            )
              ? "x"
              : "") +
            memory.ans,
        });
      }
    } else if (operation === "Rnd") {
      setMemory({
        ...memory,
        formula:
          memory.formula +
          (memory.formula.length > 0 &&
          !isNaN(
            memory.formula[memory.formula.length - 1] ||
              memory.formula[memory.formula.length - 1] === "."
          )
            ? "x"
            : "") +
          Math.random(),
      });
    } else if (operation === "10^") {
      setMemory({
        ...memory,
        formula:
          memory.formula +
          (memory.formula.length > 0 &&
          !isNaN(
            memory.formula[memory.formula.length - 1] ||
              memory.formula[memory.formula.length - 1] === "."
          )
            ? "x"
            : "") +
          "10^(",
      });
    } else {
      setMemory({ ...memory, formula: memory.formula + operation });
    }
  };

  const BasicButton = (item, index) => {
    const key = item.default + "-" + index;
    return (
      <td key={key}>
        <button
          className={`${item.class ?? ""}`}
          onClick={() =>
            formulaHandler(
              memory.inv
                ? item.invOperator ??
                    item.inv ??
                    item.defaultOperator ??
                    item.default
                : item.defaultOperator ?? item.default
            )
          }
        >
          {parse(memory.inv && item.inv ? item.inv : item.default)}
        </button>
      </td>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.ans}>{memory.ans}</span>
        <span className={styles.formula}>{memory.formula}</span>
      </div>
      <div className={styles.body}>
        <table>
          <tbody>
            <tr>
              <td colSpan="2">
                <button
                  className={`${styles.angle} ${
                    memory.angle === "rad" ? styles.angleOn : styles.angleOff
                  }`}
                  onClick={() => formulaHandler("rad")}
                >
                  Rad
                </button>
                <button
                  className={`${styles.angle} ${
                    memory.angle !== "rad" ? styles.angleOn : styles.angleOff
                  }`}
                  onClick={() => formulaHandler("deg")}
                >
                  Deg
                </button>
              </td>
              {[
                { default: "%" },
                { default: "(" },
                { default: ")" },
                { default: "CE" },
                { default: "C" },
              ].map(BasicButton)}
            </tr>
            <tr>
              <td>
                <button
                  className={`${memory.inv ? styles.invOn : styles.invOff}`}
                  onClick={() => formulaHandler("inv")}
                >
                  Inv
                </button>
              </td>
              {[
                {
                  default: "sin",
                  defaultOperator: "sin(",
                  inv: "sin<sup>-1</sup>",
                  invOperator: "arcsin(",
                },
                {
                  default: "ln",
                  defaultOperator: "ln(",
                  inv: "e<sup>x</sup>",
                  invOperator: "e^(",
                },
                { default: "7", class: styles.main },
                { default: "8", class: styles.main },
                { default: "9", class: styles.main },
                { default: "÷", defaultOperator: "/" },
              ].map(BasicButton)}
            </tr>
            <tr>
              {[
                { default: "π" },
                {
                  default: "cos",
                  defaultOperator: "cos(",
                  inv: "cos<sup>-1</sup>",
                  invOperator: "arccos(",
                },
                {
                  default: "log",
                  defaultOperator: "log(",
                  inv: "10<sup>x</sup>",
                  invOperator: "10^",
                },
                { default: "4", class: styles.main },
                { default: "5", class: styles.main },
                { default: "6", class: styles.main },
                { default: "x" },
              ].map(BasicButton)}
            </tr>
            <tr>
              {[
                { default: "e" },
                {
                  default: "tan",
                  defaultOperator: "tan(",
                  inv: "tan<sup>-1</sup>",
                  invOperator: "arctan(",
                },
                {
                  default: "√",
                  defaultOperator: "√(",
                  inv: "x²",
                  invOperator: "^2",
                },
                { default: "1", class: styles.main },
                { default: "2", class: styles.main },
                { default: "3", class: styles.main },
                { default: "-" },
              ].map(BasicButton)}
            </tr>
            <tr>
              {[
                { default: "!" },
                { default: "Ans", inv: "Rnd" },
                {
                  default: "x<sup>y</sup>",
                  defaultOperator: "^(",
                  inv: "<sup>y</sup>√x",
                  invOperator: "^(1/(",
                },
                { default: "0", class: styles.main },
                { default: ".", class: styles.main },
                { default: "=", class: styles.equal },
                { default: "+" },
              ].map(BasicButton)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalculatorBox;
