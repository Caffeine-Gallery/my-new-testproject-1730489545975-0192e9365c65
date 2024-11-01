import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let currentValue = '';
let storedValue = '';
let currentOperation = null;

window.appendToDisplay = (value) => {
    currentValue += value;
    display.value = currentValue;
};

window.clearDisplay = () => {
    currentValue = '';
    storedValue = '';
    currentOperation = null;
    display.value = '';
};

window.setOperation = (operation) => {
    if (currentValue !== '') {
        storedValue = currentValue;
        currentValue = '';
        currentOperation = operation;
    }
};

window.calculate = async () => {
    if (storedValue !== '' && currentValue !== '' && currentOperation) {
        const x = parseFloat(storedValue);
        const y = parseFloat(currentValue);
        let result;

        try {
            switch (currentOperation) {
                case '+':
                    result = await backend.add(x, y);
                    break;
                case '-':
                    result = await backend.subtract(x, y);
                    break;
                case '*':
                    result = await backend.multiply(x, y);
                    break;
                case '/':
                    const divisionResult = await backend.divide(x, y);
                    result = divisionResult[0] !== null ? divisionResult[0] : 'Error';
                    break;
            }

            display.value = result;
            currentValue = result.toString();
            storedValue = '';
            currentOperation = null;
        } catch (error) {
            console.error('Error during calculation:', error);
            display.value = 'Error';
        }
    }
};

// Add loading spinner
const addLoadingSpinner = () => {
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border text-primary';
    spinner.setAttribute('role', 'status');
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    document.body.appendChild(spinner);
};

// Remove loading spinner
const removeLoadingSpinner = () => {
    const spinner = document.querySelector('.spinner-border');
    if (spinner) {
        spinner.remove();
    }
};

// Wrap the calculate function to show/hide loading spinner
const originalCalculate = window.calculate;
window.calculate = async () => {
    addLoadingSpinner();
    try {
        await originalCalculate();
    } finally {
        removeLoadingSpinner();
    }
};
