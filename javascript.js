const keys = document.querySelector('.calculator-keys');
const display = document.querySelector('#display');
const operators = ["-", "+", "*", "%", "/", "="]

const calculator = {
    displayValue: '0',
    firstNumber: null,
    secondNumber: null,
    waitingForSecondNumber: false,
    operator: null,
    isResult: false,
}

keys.addEventListener('click', (event) => {
    const target = event.target;

    if (!target.matches('button')) {
        return; // Not a button 
    }

    // All-Clear 
    if (target.classList.contains('all-clear')) {
        allClear();
        updateDisplay();
        return;
    }

    // Remove last character 
    if (target.classList.contains('remove-last')) {
        removeLast();
        updateDisplay();
        return;
    }

    // Decimal point
    if (target.classList.contains('decimal')) {
        if (checkDecimalAllowed()) {
            inputDigit(target.value);
            updateDisplay();
            return;
        } else {
            return;
        }
    }

    if (operators.includes(target.value)) { // It's an operator
        if (calculator.displayValue === '0') {
            console.log("Can't perform any operation");
            return;
        } else {
            if (calculator.isResult) {
                if (target.value === "=") return;
                calculator.isResult = false;
                calculator.firstNumber = calculator.displayValue;
            }
            operatorPressed(target.value);
        }

    } else { // It's a number
        if (calculator.isResult) {
            calculator.displayValue = '0';
            calculator.firstNumber = null;
            calculator.isResult = false;
        }

        inputDigit(target.value);
        updateDisplay();

    }
});


function inputDigit(digit) {
    const displayValue = calculator.displayValue;

    // Second number
    if (calculator.waitingForSecondNumber) {
        if (calculator.secondNumber === null) {
            calculator.secondNumber = digit;
        } else {
            calculator.secondNumber += digit;
        }
        calculator.displayValue += digit;

        // First Number
    } else {
        if (calculator.displayValue === '0') {
            calculator.displayValue = digit;
            calculator.firstNumber = digit;
        } else {
            calculator.displayValue += digit;
            calculator.firstNumber += digit;
        }
    }
}

function updateDisplay() {
    display.value = calculator.displayValue;
    console.table(calculator);
}

function operatorPressed(operator) {
    if (!calculator.waitingForSecondNumber && operator === '=') {
        return; // No operation, just show the number 

    } else {
        if (!calculator.waitingForSecondNumber) {
            // First we save the number
            calculator.waitingForSecondNumber = true;
            calculator.operator = operator;

            // Then we add the operator to display
            calculator.displayValue += operator;
            updateDisplay();

            console.log(`Number[1]: ${calculator.firstNumber}`);
            console.log(`Operator added: ${calculator.operator}`);
        } else {
            console.log(`Number[2]: ${calculator.secondNumber}`)

            if (operator != '=') { // For multiple operations
                if (calculator.secondNumber === null) {
                    newOperatorFound(operator);
                    return;
                }

                switch (calculator.operator) {
                    case '/':
                        if (calculator.secondNumber === '0') {
                            calculator.displayValue = "ERROR!"
                            updateDisplay();
                            resetCalculator();
                        }
                        calculator.firstNumber = divideNumbers(calculator.firstNumber, calculator.secondNumber);
                        calculator.secondNumber = null;
                        break;

                    case '*':
                        calculator.firstNumber = multiplyNumbers(calculator.firstNumber, calculator.secondNumber);
                        calculator.secondNumber = null;
                        break;

                    case '-':
                        calculator.firstNumber = subtractNumbers(calculator.firstNumber, calculator.secondNumber);
                        calculator.secondNumber = null;
                        break;

                    case '+':
                        calculator.firstNumber = sumNumbers(calculator.firstNumber, calculator.secondNumber);
                        calculator.secondNumber = null;
                        break;
                }

                calculator.operator = operator;
                calculator.displayValue = calculator.firstNumber + calculator.operator;
                updateDisplay();

            } else { // For single operations
                switch (calculator.operator) {
                    case '/':
                        if (calculator.secondNumber === '0') {
                            calculator.displayValue = "ERROR!"
                            updateDisplay();
                            resetCalculator();
                        }
                        calculator.displayValue = divideNumbers(calculator.firstNumber, calculator.secondNumber);
                        break;

                    case '*':
                        calculator.displayValue = multiplyNumbers(calculator.firstNumber, calculator.secondNumber);
                        break;

                    case '-':
                        calculator.displayValue = subtractNumbers(calculator.firstNumber, calculator.secondNumber);
                        break;

                    case '+':
                        calculator.displayValue = sumNumbers(calculator.firstNumber, calculator.secondNumber);
                        break;
                }

                calculator.isResult = true;
                updateDisplay();
                resetCalculator();
                console.table(calculator);
            }
        }
    }
}

function resetCalculator() {
    calculator.firstNumber = null;
    calculator.secondNumber = null;
    calculator.waitingForSecondNumber = false;
    calculator.operator = null;
}

function allClear() {
    resetCalculator();
    calculator.isResult = false;
    calculator.displayValue = '0';
}

function removeLast() {
    // Only one digit
    if (calculator.displayValue.length === 1) {
        allClear();
        return;
    }

    // It's a result
    if (calculator.isResult) {
        calculator.displayValue = calculator.displayValue.slice(0, -1);
        calculator.firstNumber = calculator.displayValue;
        calculator.isResult = false;
        updateDisplay();
        return;
    }

    if (operators.includes(calculator.displayValue[calculator.displayValue.length - 1])) {
        // We are trying to delete an operator
        console.log("Deleting an operator")
        calculator.displayValue = calculator.displayValue.slice(0, -1);
        calculator.operator = null;
        calculator.waitingForSecondNumber = false;
        calculator.secondNumber = null;
    } else {
        // Second number 
        if (calculator.waitingForSecondNumber) {
            if (calculator.secondNumber.length > 1) {
                calculator.displayValue = calculator.displayValue.slice(0, -1);
                calculator.secondNumber = calculator.secondNumber.slice(0, -1);
            } else {
                calculator.displayValue = calculator.displayValue.slice(0, -1);
                calculator.secondNumber = null;
            }
            // First number
        } else {
            if (calculator.firstNumber.length > 1) {
                calculator.displayValue = calculator.displayValue.slice(0, -1);
                calculator.firstNumber = calculator.firstNumber.slice(0, -1);
            }
        }
    }
}

function newOperatorFound(operator) {
    calculator.displayValue = calculator.displayValue.slice(0, -1);
    calculator.displayValue += operator;
    calculator.operator = operator;
    console.log(`New operator found: ${operator}`);
    updateDisplay();
}

function checkDecimalAllowed() {
    if (calculator.displayValue[calculator.displayValue.length - 1] === ".") {
        console.log("Last digit was already a decimal!");
        return false;
    }

    if (calculator.isResult) {
        calculator.displayValue = '0.';
        calculator.firstNumber = '0.';
        calculator.isResult = false;
        updateDisplay();
        return false;
    }

    if (calculator.waitingForSecondNumber) {
        if (Number.isInteger(Number(calculator.secondNumber))) {
            return true;
        } else {
            console.log("Can't add more decimals to second number");
            return false;
        }
    } else {
        if (Number.isInteger(Number(calculator.firstNumber))) {
            return true;
        } else {
            console.log("Can't add more decimals to first number");
            return false;
        }
    }
}

function sumNumbers(num1, num2) {
    return String(Number(num1) + Number(num2));
}

function subtractNumbers(num1, num2) {
    return String(Number(num1) - Number(num2));
}

function divideNumbers(num1, num2) {
    return String(Number(num1) / Number(num2));
}

function multiplyNumbers(num1, num2) {
    return String(Number(num1) * Number(num2));
}