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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Movements

const displayMovements = function (acc) {
  acc.movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // console.log(type);
    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i} deposit</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${Math.abs(mov)}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const user = 'Jonas Schmedtmann';

const usernameToPseudo = function (user) {
  const username = user
    .toLowerCase()
    .split(' ')
    .map(i => i[0])
    .join('');
  return username;
};

// console.log(usernameToPseudo(user));

// Change username for every account

accounts.forEach(acc => {
  acc.username = usernameToPseudo(acc.owner);
});
// console.log(accounts);

const deposits = movements.filter(mov => mov > 0);
const withdrawals = movements.filter(mov => mov < 0);

//   console.log(deposits);
//   console.log(withdrawals);

const displayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = account.balance + '€';
};

// const balances = accounts.forEach(account => {
//   account.balance = account.movements.reduce((acc, mov) => {
//     return acc + mov;
//   });
// });

// console.log(accounts);

// console.log(movements);

// Maxvimum Value
const maximum = movements.reduce((max, mov) => {
  if (max > mov) return max;
  else return mov;
}, movements[0]);
// console.log(maximum);

// chaining Methode mapFilterReduce

// const EurToUsd = 1.1;

// const balanceUSD = movements.filter(mov => mov > 0).map(mov => Math.round(mov*EurToUsd)).reduce((acc, mov, i,arr) => acc + mov/arr.length)
// console.log(balanceUSD);

// console.log('---------------------------------------');
// console.log(movements);
// Calculer le total des In dans le movement

const statistics = function (account) {
  const moveIn = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  // console.log(moveIn);

  // Calculer le total des Out dans le movement
  const moveOut = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  // console.log(moveOut);

  const interest = (moveIn * account.interestRate) / 100;

  labelSumIn.textContent = moveIn + '€';
  labelSumOut.textContent = Math.abs(moveOut) + '€';
  labelSumInterest.textContent = interest + '€';
};

const update = function (account) {
  displayMovements(account);
  displayBalance(account);
  statistics(account);
};

// console.log(accounts);

// const jessica = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(jessica);

let currentAccount;
// console.log(accounts);
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // console.log(currentAccount.pin);
  // console.log(inputLoginPin.value);
  if (currentAccount?.pin == inputLoginPin.value) {
    containerApp.style.opacity = '1';
    setTimeout(() => {
      inputLoginUsername.value = '';
      inputLoginPin.value = '';
      inputLoginPin.blur();
      labelWelcome.textContent =
        'Welcome Back ' + currentAccount.owner.split(' ')[0];
      displayMovements(currentAccount);
      displayBalance(currentAccount);
      statistics(currentAccount);
    }, 100);
  }

  // console.log(currentAccount);
});

// Transfert Money

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  if (inputTransferTo.value != '' && inputTransferAmount.value != '') {
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(
      acc => acc.username === inputTransferTo.value
    );
    console.log(amount, receiverAcc);
    setTimeout(() => {
      inputTransferTo.value = '';
      inputTransferAmount.value = '';
      inputTransferAmount.blur();
    }, 100);

    if (
      amount > 0 &&
      receiverAcc &&
      currentAccount.balance > amount &&
      receiverAcc.username !== currentAccount.username
    ) {
      console.log(receiverAcc.balance);
      currentAccount.movements.push(-amount);
      console.dir(displayMovements);
      receiverAcc.movements.push(amount);
      console.log(receiverAcc.balance);
      console.log(currentAccount);
      update(currentAccount);
      // update(receiverAcc);
    }
  }
});

// Close Account

btnClose.addEventListener('click', e => {
  e.preventDefault();
  console.log(currentAccount);
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin == inputClosePin.value
  ) {
    console.log('delete Account');
    const deleteAccountIndex = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(deleteAccountIndex, 1);
    console.log(deleteAccountIndex);
    console.log(accounts);
    inputCloseUsername.value = '';
    (inputClosePin.value = ''), (containerApp.style.opacity = '0');
  }
});

console.log(movements);

// Request loan

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  const loanRate = 0.1;

  const greaterDeposit = currentAccount.movements.some(
    acc => acc >= loanAmount * loanRate
  );
  currentAccount.movements.push(loanAmount);
  update(currentAccount);

  // if(loanAmount > 0 && loanAmount)
});
