const keys = document.querySelector('.calculator-keys');
const display = document.querySelector('#display');
const operators = ["-", "+", "*", "%", "/", "="]

const calculator = {
    displayValue: '0',
    firstNumber: null,
    secondNumber: null,
    waitingForSecondNumber: false,
    operator: null,
}

keys.addEventListener('click', (event) => {
    const target = event.target;

    if (!target.matches('button')) {
        return; // Not a button 
    }

    if (operators.includes(target.value)) {
        if (calculator.displayValue === '0') {
            console.log("No numbers found to make an operation");
            return;
        } else {
            operatorPressed(target.value);
        }


    } else {
        inputDigit(target.value);
        updateDisplay();

    }

});


function inputDigit(digit) {
    const displayValue = calculator.displayValue;

    if (displayValue === '0') {
        calculator.displayValue = digit;
    } else {
        calculator.displayValue += digit;
    }
}

function updateDisplay() {
    display.value = calculator.displayValue;
}

function operatorPressed(operator) {
    if (!calculator.waitingForSecondNumber && operator === '=') {
        return; // No operation, just show the number 

    } else {
        if (!calculator.waitingForSecondNumber) {
            // First we save the number
            calculator.firstNumber = calculator.displayValue;
            calculator.waitingForSecondNumber = true;
            calculator.operator = operator;

            // Then we add the operator to display
            calculator.displayValue += operator;
            updateDisplay();

            console.log(`Number[1]: ${calculator.firstNumber}`);
            console.log(`Operator added: ${calculator.operator}`);
        } else {
            calculator.secondNumber = calculator.displayValue.split(/[+\-*/]/)[1];
            console.log(`Number[2]: ${calculator.secondNumber}`);

            if (operator != '=') {
                switch (calculator.operator) {
                    case '/':
                        calculator.firstNumber = divideNumbers(calculator.firstNumber, calculator.secondNumber);
                        break;

                    case '*':
                        calculator.firstNumber = multiplyNumbers(calculator.firstNumber, calculator.secondNumber);
                        break;

                    case '-':
                        calculator.firstNumber = subtractNumbers(calculator.firstNumber, calculator.secondNumber);
                        break;

                    case '+':
                        calculator.firstNumber = sumNumbers(calculator.firstNumber, calculator.secondNumber);
                        break;
                }

                calculator.operator = operator;
                calculator.displayValue = calculator.firstNumber + calculator.operator;
                updateDisplay();

            } else {
                switch (calculator.operator) {
                    case '/':
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

                updateDisplay();
                resetCalculator();
            }
        }
    }


}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstNumber = null;
    calculator.secondNumber = null;
    calculator.waitingForSecondNumber = false;
    calculator.operator = null;
}

function sumNumbers(num1, num2) {
    return Number(num1) + Number(num2);
}

function subtractNumbers(num1, num2) {
    return Number(num1) - Number(num2);
}

function divideNumbers(num1, num2) {
    return Number(num1) / Number(num2);
}

function multiplyNumbers(num1, num2) {
    return Number(num1) * Number(num2);
}