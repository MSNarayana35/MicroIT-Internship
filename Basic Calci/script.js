// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;
let calculationHistory = [];
let selectedHistoryItems = new Set();

// DOM elements
const currentOperandElement = document.getElementById('current-operand');
const previousOperandElement = document.getElementById('previous-operand');
const historyListElement = document.getElementById('history-list');
const historyContainerElement = document.getElementById('history-container');
const deleteSelectedButton = document.getElementById('delete-selected');

// Initialize the calculator
function initialize() {
    updateDisplay();
    loadHistory();
}

// Append a number to the current operand
function appendNumber(number) {
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    
    // Prevent multiple decimal points
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Replace initial 0 with number unless it's a decimal point
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    
    updateDisplay();
}

// Append an operator to the calculation
function appendOperator(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

// Perform the calculation
function calculate() {
    if (previousOperand === '' || currentOperand === '') return;
    
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    // Check for invalid inputs
    if (isNaN(prev) || isNaN(current)) return;
    
    try {
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) throw new Error('Division by zero');
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        // Format the result to avoid excessive decimal places
        // but preserve necessary precision
        const resultStr = computation.toString();
        
        // Add to history
        const calculationStr = `${previousOperand} ${operation} ${currentOperand}`;
        addToHistory(calculationStr, resultStr);
        
        currentOperand = resultStr;
        operation = undefined;
        previousOperand = '';
        shouldResetScreen = true;
        updateDisplay();
    } catch (error) {
        currentOperand = error.message;
        shouldResetScreen = true;
        updateDisplay();
    }
}

// Clear all calculator data
function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

// Delete the last character from the current operand
function deleteLastChar() {
    if (shouldResetScreen) return;
    
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    
    updateDisplay();
}

// Update the calculator display
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    
    if (operation) {
        previousOperandElement.textContent = `${previousOperand} ${operation}`;
    } else {
        previousOperandElement.textContent = previousOperand;
    }
}

// Add a calculation to history
function addToHistory(expression, result) {
    const historyItem = {
        id: Date.now().toString(),
        expression: expression,
        result: result
    };
    
    calculationHistory.push(historyItem);
    saveHistory();
    renderHistory();
}

// Save history to local storage
function saveHistory() {
    localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
}

// Load history from local storage
function loadHistory() {
    const savedHistory = localStorage.getItem('calculationHistory');
    if (savedHistory) {
        calculationHistory = JSON.parse(savedHistory);
        renderHistory();
    }
}

// Render the history list
function renderHistory() {
    historyListElement.innerHTML = '';
    
    if (calculationHistory.length === 0) {
        historyListElement.innerHTML = '<div class="empty-history">No calculations yet</div>';
        return;
    }
    
    calculationHistory.forEach(item => {
        const historyItemElement = document.createElement('div');
        historyItemElement.classList.add('history-item');
        historyItemElement.dataset.id = item.id;
        
        if (selectedHistoryItems.has(item.id)) {
            historyItemElement.classList.add('selected');
        }
        
        historyItemElement.innerHTML = `
            <div class="history-expression">${item.expression} =</div>
            <div class="history-result">${item.result}</div>
        `;
        
        historyItemElement.addEventListener('click', () => toggleHistoryItemSelection(item.id));
        historyListElement.appendChild(historyItemElement);
    });
    
    updateDeleteSelectedButton();
}

// Toggle selection of a history item
function toggleHistoryItemSelection(id) {
    if (selectedHistoryItems.has(id)) {
        selectedHistoryItems.delete(id);
    } else {
        selectedHistoryItems.add(id);
    }
    
    renderHistory();
}

// Toggle history container visibility
function toggleHistory() {
    if (historyContainerElement.style.display === 'none') {
        historyContainerElement.style.display = 'block';
    } else {
        historyContainerElement.style.display = 'none';
    }
}

// Update the state of the delete selected button
function updateDeleteSelectedButton() {
    deleteSelectedButton.disabled = selectedHistoryItems.size === 0;
}

// Clear all history
function clearHistory() {
    calculationHistory = [];
    selectedHistoryItems.clear();
    saveHistory();
    renderHistory();
}

// Delete selected history items
function deleteSelected() {
    if (selectedHistoryItems.size === 0) return;
    
    calculationHistory = calculationHistory.filter(item => !selectedHistoryItems.has(item.id));
    selectedHistoryItems.clear();
    saveHistory();
    renderHistory();
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', initialize);

// Add keyboard support
document.addEventListener('keydown', (event) => {
    if (/^[0-9]$/.test(event.key)) {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendNumber('.');
    } else if (event.key === '+') {
        appendOperator('+');
    } else if (event.key === '-') {
        appendOperator('-');
    } else if (event.key === '*') {
        appendOperator('×');
    } else if (event.key === '/') {
        appendOperator('÷');
    } else if (event.key === '%') {
        appendOperator('%');
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Backspace') {
        deleteLastChar();
    } else if (event.key === 'Escape') {
        clearAll();
    }
});