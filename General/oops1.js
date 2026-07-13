"use strict";

class BankAccount{
     #accountNumber; 
     #balance =0;
    constructor(customerName, balance=0){
        this.customerName = customerName;
        this.#accountNumber = Date.now();
        this.#balance = balance;
    }

    deposit(amount){
        if(amount <= 0){
            console.log("Deposit amount must be positive.");
        }
        else{
            this.#balance += amount;
            console.log(`Deposited ${amount}. New balance is ${this.#balance}.`);
        }
    }

    withdraw(amount){
        if(amount <= 0){
            console.log("Withdrawal amount must be positive.");
        }
        else if(amount > this.#balance){
            console.log("Insufficient funds.");
        }else{
            this.#balance -= amount;
            console.log(`Withdrew ${amount}. New balance is ${this.#balance}.`);
        }
    }

    set Balance(amount){
        if(isNaN(amount) || amount < 0){
            console.log("Balance is not valid.");
        }else{
            this.#balance = amount;
        }
    }

    get Balance(){
        return { balance: this.#balance, accountNumber: this.#accountNumber };
    }
}

const account1 = new BankAccount("Alice", 1000);
account1.deposit(500); // Deposited 500. New balance is 1500.
account1.withdraw(200); // Withdrew 200. New balance is 1300.
account1.withdraw(2000); // Insufficient funds.
// account1.#accountNumber = 1634567890123; // Manually setting account number for demonstration
// console.log(account1.getBalance()); // { balance: 1300, accountNumber: 1634567890123 }
console.log(account1)