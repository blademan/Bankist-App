'use strict';

///////////////////////////////////////
/////    BANKIST APP  /////////////////
///////////////////////////////////////

////////////////////////////////
////// Data  ///////////////////
////////////////////////////////

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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

////////////////////////////////
////// Elements  ///////////////
////////////////////////////////

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

////////////////////////////////////////
///////    Movements    ////////////////
////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          
          <div class="movements__value">${mov}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////
/////    DISPLAY BALANCE  ///////
/////////////////////////////////

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}`;
};

//////////////////////////////////////
//////// Display Summary  ////////////
//////////////////////////////////////

const calcDisplaySummary = function (curentAcc) {
  const incomes = curentAcc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = curentAcc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = curentAcc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * curentAcc.interestRate) / 100)
    .filter((mov) => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

////////////////////////////////////
//////   Create User Names   //////
///////////////////////////////////

const createUserNames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUserNames(accounts);

//////////////////////////////////
///   Calc and Print Balance  ////
//////////////////////////////////

const calcAndPrintBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance}€`;
};
calcAndPrintBalance(account1.movements);

//////////////////////////////////////
////////////   Event Handler  /////////
//////////////////////////////////////

let currentAccount;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

//////////////////////////////////
////////////   Update UI /////////
//////////////////////////////////

const updateUI = (acc) => {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

/////////////////////////////////////////
////////////    Transfer Money  /////////
/////////////////////////////////////////

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (user) => user.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

/////////////////////////////////////////
////////////    Close Account  /////////
/////////////////////////////////////////

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (currentAccount.userName === username && currentAccount.pin === pin) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

/////////////////////////////////////////
////////////    Request Loan  /////////
/////////////////////////////////////////

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const loan = currentAccount.movements.some((mov) => {
    return mov >= amount * 0.1;
  });

  if (amount > 0 && loan) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

//////////////////////////////////
////////////    Sort  /////////
//////////////////////////////////

let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);

  sorted = !sorted;
});

//////////////////////////////////
////////////    LECTURE  /////////
//////////////////////////////////
