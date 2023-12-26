// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect the bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Update the user's balance
// 7. Display the results to the user
// 8. Ask if they want to play again

const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  "Cherries": 2,
  "Oranges": 4,
  "Plums": 6,
  "Bells": 8
};

const SYMBOLS_VALUES = {
  "Cherries": 5,
  "Oranges": 4,
  "Plums": 3,
  "Bells": 2
};

const depositMoney = () => {
  while (true) {
    var amount = prompt("How much money would you like to deposit? ");
    if (amount > 0) {
      return amount;
    } else {
      console.log("You must deposit at least $1");
    }
  }
};

const getLines = () => {
  while (true) {
    var lines = prompt("How many lines would you like to bet on?(1-3) ");
    if (lines > 0 && lines <= 3) {
      return lines;
    } else {
      console.log("You must bet on at least 1 line and no more than 3.");
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    var bet = prompt("How much would you like to bet per line? ");
    if ((bet * lines) > balance) {
      console.log("You cannot bet more than you have!");
    } else if (bet <= 0) {
      console.log("You must bet at least $1");
    } else {
      return bet;
    }
  }
};

const spin = () => {
  const results = [];
  for (const [result, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      results.push(result);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelResults = [...results]
    for (let j = 0; j < ROWS; j++) {
      const index = Math.floor(Math.random() * reelResults.length);
      const selectedSymbol = reelResults[index];
      reels[i].push(selectedSymbol);
      reelResults.splice(index, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i][j] = reels[j][i];
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    console.log(row.join(" | "));
  }
};

const checkWin = (rows, lines, bet) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += SYMBOLS_VALUES[symbols[0]] * bet;
    }
  }
  return winnings;
};

const game = () => {
  const amount = depositMoney();

  while (true) {
    console.log(`You have a balance of $${amount}.`)

    const lines = getLines();
    const bet = getBet(amount, lines);
    amount -= bet * lines;

    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = checkWin(rows, lines, bet);
    amount += winnings;

    console.log(`You won $${winnings}!`);

    if (amount <= 0) {
      console.log("You have no more money to bet.");
      break;
    }

    const again = prompt("Would you like to play again? (y/n) ");

    if (again != "y") break;
  }
};

game();
