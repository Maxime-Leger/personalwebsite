import { factorialOperation } from "./factorialModule";

const isNumber = (nb) => {
  return !isNaN(nb) || ["e", "π"].indexOf(nb) >= 0;
};

const numberConverter = (string) => {
  if (!isNaN(string)) {
    return Number(string);
  }
  if (string === undefined) {
  } else if (string === "e") {
    string = Math.E;
  } else if (string === "π") {
    string = Math.PI;
  } else {
    throw { step: "numberConverter", message: "Error: Number Convertion" };
  }
  return string;
};

const operationHandler = ({ ope, nb1, nb2, angle }) => {
  nb1 = numberConverter(nb1);
  nb2 = numberConverter(nb2);
  switch (ope) {
    case "+":
      return nb1 + nb2;
    case "-":
      return nb1 - nb2;
    case "/":
      return nb1 / nb2;
    case "x":
      return nb1 * nb2;
    case "%":
      return nb1 / 100;
    case "ln":
      return Math.log(nb1);
    case "log":
      return Math.log10(nb1);
    case "√":
      return Math.sqrt(nb1);
    case "^":
      return Math.pow(nb1, nb2);
    case "sin":
      return Math.sin(nb1 * (angle === "rad" ? 1 : Math.PI / 180));
    case "cos":
      return Math.cos(nb1 * (angle === "rad" ? 1 : Math.PI / 180));
    case "tan":
      return Math.tan(nb1 * (angle === "rad" ? 1 : Math.PI / 180));
    case "arcsin":
      return Math.asin(nb1) * (angle === "rad" ? 1 : 180 / Math.PI);
    case "arccos":
      return Math.acos(nb1) * (angle === "rad" ? 1 : 180 / Math.PI);
    case "arctan":
      return Math.atan(nb1) * (angle === "rad" ? 1 : 180 / Math.PI);
    case "!":
      return factorialOperation(nb1);
    default:
      throw {
        step: "operationHandler",
        message: "Error: Operation Unrecognised",
      };
  }
};

export const separatorHandler = (string) => {
  let stack = [],
    index = 0,
    len = string.length,
    number = "";
  while (index < len) {
    if (isNumber(string[index]) || string[index] === ".") {
      number += string[index];
      index++;
      continue;
    }
    if (number !== "") {
      stack.push(number);
      number = "";
    }
    if (
      ["e", "π", "!", "%", "^", "√", "+", "-", "x", "/", "=", "(", ")"].indexOf(
        string[index]
      ) >= 0
    ) {
      stack.push(string[index]);
      index++;
    } else if (index + 1 < len && string.substring(index, index + 2) === "ln") {
      stack.push(string.substring(index, index + 2));
      index += 2;
    } else if (
      index + 2 < len &&
      ["sin", "cos", "tan", "log"].indexOf(
        string.substring(index, index + 3)
      ) >= 0
    ) {
      stack.push(string.substring(index, index + 3));
      index += 3;
    } else if (
      index + 5 < len &&
      ["arcsin", "arccos", "arctan"].indexOf(
        string.substring(index, index + 6)
      ) >= 0
    ) {
      stack.push(string.substring(index, index + 6));
      index += 6;
    } else {
      throw {
        step: "separatorHandler",
        message: "Error: Operation Unrecognised",
      };
    }
  }
  if (number !== "") {
    stack.push(number);
  }
  return stack;
};

export const parenthesisHandler = (formula) => {
  let nbopen = 0,
    nbclose = 0;
  for (let char of formula) {
    if (char === "(") {
      nbopen++;
    } else if (char === ")") {
      nbclose++;
      if (nbclose > nbopen) {
        throw {
          step: "parenthesisHandler",
          message: "Error: Wrong Parenthesis",
        };
      }
    }
  }
  const nbdif = nbopen - nbclose;
  formula = formula.concat(Array(nbdif < 0 ? 0 : nbdif).fill(")"));
  return formula;
};

export const calculatorHandler = ({ formula, start, end, angle }) => {
  let index = start,
    stack = [];

  // remove () recursively
  while (index <= end) {
    let elt = formula[index];
    if (elt === "(") {
      let indexClose = formula.lastIndexOf(")", end);
      let result = calculatorHandler({
        formula,
        start: index + 1,
        end: indexClose - 1,
        angle,
      });
      stack.push(result);
      index = indexClose + 1;
    } else if (elt === ")") {
      throw {
        step: "calculatorHandler",
        message: "Error: Wrong Parenthesis",
      };
    } else {
      stack.push(elt);
      index++;
    }
  }

  // switch !, % for computation handling
  index = 0;
  while (index < stack.length) {
    if (["!", "%"].indexOf(stack[index]) >= 0) {
      if (index === 0 || !isNumber(stack[index - 1])) {
        stack[index] = 0;
      } else {
        let temp = stack[index];
        stack[index] = stack[index - 1];
        stack[index - 1] = temp;
      }
    }
    index++;
  }

  // computes operations aside from x, /, +, -
  let stack2 = [];
  index = 0;
  while (index < stack.length) {
    let current = stack[index];
    if (isNumber(current)) {
      while (
        stack2.length > 0 &&
        !isNumber(stack2[stack2.length - 1]) &&
        ["+", "-", "x", "/"].indexOf(stack2[stack2.length - 1]) < 0
      ) {
        if (stack2[stack2.length - 1] === "^") {
          current = operationHandler({
            ope: stack2.pop(),
            nb1: stack2.pop(),
            nb2: current,
            angle,
          });
        } else {
          current = operationHandler({
            ope: stack2.pop(),
            nb1: current,
            angle,
          });
        }
      }
    }
    stack2.push(current);
    index++;
  }

  // computes operations x, /
  stack = stack2;
  stack2 = [];
  index = 0;
  while (index < stack.length) {
    let current = stack[index];
    if (isNumber(current)) {
      while (
        stack2.length > 0 &&
        ["+", "-"].indexOf(stack2[stack2.length - 1]) < 0
      ) {
        if (isNumber(stack2[stack2.length - 1])) {
          current = operationHandler({
            ope: "x",
            nb1: stack2.pop(),
            nb2: current,
            angle,
          });
        } else if (["x", "/"].indexOf(stack2[stack2.length - 1]) >= 0) {
          current = operationHandler({
            ope: stack2.pop(),
            nb1: stack2.pop(),
            nb2: current,
            angle,
          });
        } else {
          throw {
            step: "calculatorHandler",
            message: "Error: Wrong x or ÷ Calculation",
          };
        }
      }
    }
    stack2.push(current);
    index++;
  }

  // computes operations +-
  let result = stack2[0];
  index = 1;
  while (index < stack2.length) {
    result = operationHandler({
      ope: stack2[index],
      nb1: result,
      nb2: stack2[index + 1],
      angle,
    });
    index += 2;
  }

  return result;
};
