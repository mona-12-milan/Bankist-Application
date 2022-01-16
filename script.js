'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2021-12-20T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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
// Functions

const diffDate = (date1, date2) =>
  Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

const ret_currency = function (acc, num) {
  const object = {
    style: 'currency',
    currency: acc.currency,
  };
  const formattedCurrency = new Intl.NumberFormat(acc.locale, object).format(
    num
  );

  return formattedCurrency;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // displaying date
    const date = new Date(acc.movementsDates[i]);
    const today = new Date();

    let displayDate;
    const datediff = diffDate(date, today);

    if (datediff == 0) displayDate = 'Today';
    else if (datediff == 1) displayDate = 'Yesterday';
    else if (datediff <= 7) displayDate = `${datediff} days ago`;
    else
      displayDate = new Intl.DateTimeFormat(currentAccount.locale).format(date);

    // displaying Currency
    // const object = {
    //   style: 'currency',
    //   currency: acc.currency,
    // };
    // const formattedCurrency = new Intl.NumberFormat(acc.locale, object).format(
    //   mov.toFixed(2)
    // );
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    
     <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${ret_currency(acc, mov.toFixed(2))}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${ret_currency(acc, acc.balance.toFixed(2))}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${ret_currency(acc, incomes.toFixed(2))}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${ret_currency(acc, Math.abs(out).toFixed(2))}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${ret_currency(acc, interest.toFixed(2))}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const timer = function () {
  let time = 20;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time == 0) {
      clearInterval(timer1);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }

    time--;
  };

  tick();
  const timer1 = setInterval(tick, 1000);
  return timer1;
};

///////////////////////////////////////
// Event handlers
let currentAccount, startTimer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  const now = new Date();
  // const day = `${now.getDay()}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const hour = `${now.getHours()}`.padStart(2, 0);
  // const min = `${now.getMinutes()}`.padStart(2, 0);

  const object = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  };
  const locale = navigator.language;
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    object
  ).format(now);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // timing
    if (startTimer) clearInterval(startTimer);
    startTimer = timer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(Number(inputTransferAmount.value));
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Adding Dates

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // timing
    if (startTimer) clearInterval(startTimer);
    startTimer = timer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(Number(inputLoanAmount.value));

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement, with some time
    setTimeout(function () {
      currentAccount.movements.push(amount);
      // Adding dates
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);

    // timing
    if (startTimer) clearInterval(startTimer);
    startTimer = timer();
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(0.1 + 0.2 == 0.3);
// numeric seperator
// 2000000000  difficult to read so 200_000_000_000 means the same => complier removes the _
// placing _ in the begging,end,before or after the decimal point is illegal and cant place two _ in a row
//  numeric seperator can be used only in numbers => strings to number conversion NaN

// console.log(Number('24_000'));

// so whenever we work with strings or API we should not use _

// ---------------BIGINT-------------

// normal int ->2**53 -1
// math operators like sqrt doesnt work

// console.log(3333.32220222n);  error ->bigint should be an integer

// --------------DATE--------------
/*
// taking current time from system
const now = new Date();
console.log(now);

// we giving a string
console.log(new Date('sep 12 2012'));

// we can give time along with it
console.log(new Date('sep 12 2012 14:04:1'));

// parsing from accounts->
console.log(account1.movementsDates[0]);
console.log(new Date(account1.movementsDates[0]));

// month in java is zero based
console.log(new Date(2062, 10, 93));

// we can give milliseconds from jan 1 1970
console.log(new Date(10 * 24 * 60 * 60 * 1000));
*/
// const future = new Date(2030, 10, 12, 18, 20);
// console.log(future);

// console.log(future.getFullYear());
// console.log(future.getMonth()); //0 based 0->jan;1->feb ...
// console.log(future.getDate());
// console.log(future.getDay()); // 0->sunday;1->monday...
// console.log(future.getHours());
// // mins and secs also available
// console.log(future.toISOString());
// console.log(future.getTime()); // gives us in milliseconds

// console.log(Date.now()); // current time stamp

//  we can set date and other paramerters also

// future.setHours(15);
// console.log(future);

// ----------Timers-----------

const ing = ['chicken', 'oninos'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here's your Pizza with ${ing1} and ${ing2}`),
  3000,
  ...ing
);
if (ing.includes('chicken')) {
  clearTimeout(pizzaTimer);
  console.log('pizza cancled');
}

setInterval(function () {
  const now = new Date();
  const object = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  console.log(new Intl.DateTimeFormat(navigator.language, object).format(now));
}, 1000);
