'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

let sort = false;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Functions
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, index) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

function createUsernames(accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
}

function calcDisplayBalance(account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance} EUR`;
}

function filterDeposits(movements) {
  return movements.filter(mov => mov > 0);
}

function filterWithdrawals(movements) {
  return movements.filter(mov => mov < 0);
}

const calcDisplaySummary = function (account) {
  const totalIn = filterDeposits(account.movements).reduce(
    (acc, deposit) => acc + deposit,
    0
  );
  labelSumIn.textContent = `${totalIn}€`;
  const totalOut = filterWithdrawals(account.movements).reduce(
    (acc, withdrawal) => acc + withdrawal,
    0
  );
  labelSumOut.textContent = `${Math.abs(totalOut)}€`;
  const interest = filterDeposits(account.movements)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (currentAccount) {
  displayMovements(currentAccount.movements);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

// Event handlers
createUsernames(accounts);
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // diplay movements, balance, summary.
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAccount?.userName !== currentAccount.userName &&
    receiverAccount
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    inputTransferAmount.value = inputTransferTo.value = '';
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  const inputUserName = inputCloseUsername.value;
  const inputUserPin = Number(inputClosePin.value);
  if (
    inputUserName === currentAccount.userName &&
    inputUserPin === currentAccount.pin
  ) {
    // close the UI.
    containerApp.style.opacity = 0;
    // delete the account.
    const index = accounts.findIndex(acc => acc.userName === inputUserName);
    accounts.splice(index, 1);
  }
});

btnLoan.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  const loan = Number(inputLoanAmount.value);
  if (
    loan &&
    filterDeposits(currentAccount.movements).length >= 1 &&
    currentAccount.movements.some(mov => mov >= 0.1 * loan)
  ) {
    inputLoanAmount.value = '';
    currentAccount.movements.push(loan);
    updateUI(currentAccount);
  }
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sort = !sort;
  displayMovements(currentAccount.movements, sort);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// forEach for Maps
currencies.forEach(function (currentVal, key, entireMap) {
  console.log(`${key}: ${currentVal}`);
});

// forEach for Sets
const currenciesUnique = new Set(['USD', 'USD', 'GBP', 'EUR', 'EUR']);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}`);
});

// Coding Challenge #1
const checkDog = function (dogsJulia, dogsKate) {
  const juliaDogs = dogsJulia.slice(0, -2).slice(1);
  console.log(juliaDogs);
  const allDogs = juliaDogs.concat(dogsKate);
  allDogs.forEach(function (age, index, _) {
    const type = age >= 3 ? 'an adult' : 'still a puppy';
    console.log(`Dog number ${index + 1} is ${type} and is ${age} years old.`);
  });
};
checkDog([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDog([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

/////////////////////////////////////////////////
*/

/* // Coding Challenge #2

const calcAverageHumanAge = function (ages) {
  return ages
    .map(function (age) {
      return age <= 2 ? 2 * age : 16 + age * 4;
    })
    .filter(function (age) {
      return age >= 18;
    })
    .reduce(function (acc, age, index, arr) {
      return acc + age / arr.length;
    }, 0);
};

console.log('Coding Challenge #2');
const dogs1 = [5, 2, 4, 1, 15, 8, 3];
const dogs2 = [16, 6, 10, 5, 6, 1, 4];
console.log(calcAverageHumanAge(dogs1));
console.log(calcAverageHumanAge(dogs2));
 */

/* // Coding Challenge #3
const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, index, arr) => acc + age / arr.length, 0);
console.log('Coding Challenge #2');
const dogs1 = [5, 2, 4, 1, 15, 8, 3];
const dogs2 = [16, 6, 10, 5, 6, 1, 4];
console.log(calcAverageHumanAge(dogs1));
console.log(calcAverageHumanAge(dogs2));
 */

/* // Generating an array with 100 dice rolls
const diceRolls = Array.from(
  { length: 100 },
  () => Math.trunc(Math.random() * 6) + 1
);
console.log(diceRolls);
 */

/* //////////////////////////////////////
// Array Methods Practice
// 1. Total deposits to the bank
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, cur) => acc + cur, 0);
console.log(`Total deposits to bank: ${bankDepositSum}`);
// 2. Number of deposits greater than $1000.
const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(
  `Number of deposits to the bank that are greater than $1000: ${numDeposit1000}`
);
// 3. Create an object which contains sums of the
// deposits and sums of the withdrawals.
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sums);
// 4. Create a simple function that converts any
// string to title case (unaltered words: a, an,
// the, but, or, on, in, with)

function converTitleCase(str) {
  const unaltered = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
  return str
    .toLowerCase()
    .split(' ')
    .map(word =>
      unaltered.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
}
console.log(converTitleCase('this is a nice title'));
// This Is a Nice Title
console.log(converTitleCase('this is a LONG title but not too long'));
// This Is a Long Title but Not Too Long
console.log(converTitleCase('and here is another title with an EXAMPLE'));
// And Here Is Another Title with an Example
 */

// Coding Challenge #4

/* const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => (dog.recommendedFood = dog.weight ** 0.75 * 28));
console.log(dogs);
const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog currently consumes ${
    sarahDog.curFood
  } gr, it should consume between ${(
    sarahDog.recommendedFood * 0.9
  ).toPrecision(4)} and ${(sarahDog.recommendedFood * 1.1).toPrecision(
    4
  )}. \nSo, it consumes ${
    sarahDog.curFood > sarahDog.recommendedFood * 1.1 ? 'too much' : ''
  }${sarahDog.curFood < sarahDog.recommendedFood * 0.9 ? 'too little' : ''}${
    sarahDog.curFood <= sarahDog.recommendedFood * 1.1 &&
    sarahDog.curFood >= sarahDog.recommendedFood * 0.9
      ? 'right amount of'
      : ''
  } food.`
);

const owner = dogs.reduce(
  (owners, cur) => {
    owners[
      (cur.curFood > cur.recommendedFood * 1.1 ? 'ownersEatTooMuch' : '') +
        (cur.curFood < cur.recommendedFood * 0.9 ? 'ownersEatTooLittle' : '') +
        (cur.curFood < cur.recommendedFood * 1.1 &&
        cur.curFood > cur.recommendedFood * 0.9
          ? 'ownersEatRecommended'
          : '') +
        (cur.curFood === cur.recommendedFood ? 'ownersEatExact' : '')
    ]?.push(...cur.owners);
    return owners;
  },
  {
    ownersEatTooMuch: [],
    ownersEatTooLittle: [],
    ownersEatRecommended: [],
    ownersEatExact: [],
  }
);
console.log(`${owner.ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${owner.ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
console.log(
  `Whether there is any dog eating the exact recommended amount: ${Boolean(
    owner.ownersEatExact.length
  )}`
);
console.log(
  `Whether there is any dog eating the okay amount: ${Boolean(
    owner.ownersEatRecommended.length
  )}`
);

const sortedDogs = dogs
  .slice()
  .sort((a, b) => b.recommendedFood - a.recommendedFood);
console.log(sortedDogs.map(dog => dog.recommendedFood)); */
