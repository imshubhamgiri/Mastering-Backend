interface paymentStrategy {
    pay(amount: number): void;
}


class CreditCardPayment implements paymentStrategy {
    private readonly CardNumber: string;
    private readonly ExpirtyDate: string;

    constructor(cardNumber: string, expiryDate: string) {
        this.CardNumber = cardNumber;
        this.ExpirtyDate = expiryDate;
    }

    pay(amount: number): void {
        console.log(`Paid ${amount} using Credit Card ending with ${this.CardNumber.slice(-4)}.`);
    }
}


class PayPalPayment implements paymentStrategy {
    private readonly Email: string;
    private readonly Password: string;

    constructor(email: string, password: string) {
        this.Email = email;
        this.Password = password;
    }

    pay(amount: number): void {
        console.log(`Paid ${amount} using PayPal account ${this.Email}.`);
    }
}

class CryptoPayment implements paymentStrategy {
    private readonly WalletAddress: string;
    constructor(walletAddress: string) {
        this.WalletAddress = walletAddress;
    }

    pay(amount: number): void {
        console.log(`Paid ${amount} using Crypto wallet ${this.WalletAddress}.`);
    }
}



class PaymentProcessor {
    private  strategy: paymentStrategy;

    constructor(strategy: paymentStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: paymentStrategy): void {
        this.strategy = strategy;
    }

    processPayment(amount: number): void {
        this.strategy.pay(amount);
    }
}


function main2(){
    const creditCardPayment = new CreditCardPayment("1234567890123456", "12/25");
    const paypalPayment = new PayPalPayment("user@example.com", "password");
    const cryptoPayment = new CryptoPayment("0x1234567890123456789012345678901234567890");

          
    const paymentProcessor = new PaymentProcessor(creditCardPayment);

    // Process payment using Credit Card
    console.log("Processing payment using Credit Card:");
    paymentProcessor.processPayment(100);

    // Change strategy to PayPal
    console.log("\nProcessing payment using PayPal:");
    paymentProcessor.setStrategy(paypalPayment);
    paymentProcessor.processPayment(200);

    // Change strategy to Crypto
    console.log("\nProcessing payment using Crypto:");
    paymentProcessor.setStrategy(cryptoPayment);
    paymentProcessor.processPayment(300);
}

main2();