class LineItem{
    private productName:string;
     private quantity: number;
    private unitPrice: number;


    constructor(productName:string , quantity:number , unitPrice:number){
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    
    getSubtotal(): number {
        return this.quantity * this.unitPrice;
    }

    getProductName():string{
        return this.productName;
    }

    describe(): void {
        console.log(`${this.productName} x${this.quantity} ` +
            `@ $${this.unitPrice.toFixed(2)} = $${this.getSubtotal().toFixed(2)}`);
    }
}


class Order{
    private orderId: string;
    private lineItems: LineItem[];

    constructor(orderId: string){
        this.orderId = orderId;
        this.lineItems = [];
    }

    addItem(productName:string , quantity:number , unitPrice:number){
        this.lineItems.push(new LineItem(productName, quantity , unitPrice))
    }

    removeItem(product: string): void {
        this.lineItems = this.lineItems.filter(
            item => item.getProductName() !== product
        );
    }

    getTotal():number{
      return  this.lineItems.reduce((total , item)=>
        total += item.getSubtotal(),
        0)
    }

    printReceipt(): void {
        console.log(`Order: ${this.orderId}`);
        for (const item of this.lineItems) {
            item.describe();
        }
       
        console.log(`Total: $${this.getTotal().toFixed(2)}`);
    }
}

function main(): void {
    const order = new Order("ORD-1001");
    order.addItem("Wireless Mouse", 2, 29.99);
    order.addItem("USB-C Cable", 3, 9.99);
    order.addItem("Laptop Stand", 1, 49.99);

    order.printReceipt();

    // When order is garbage collected, all LineItems go with it.
    // No LineItem exists outside of an Order.
}

main();