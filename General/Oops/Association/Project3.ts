// 1. Define what a Notification looks like
interface AppNotification {
    recipient: string;
    message: string;
    timestamp: Date;
}

// 2. Create a dedicated Service to manage notifications
class NotificationService {
    private static notifications: AppNotification[] = [];

    static send(recipient: User, message: string): void {
        const newNotification: AppNotification = {
            recipient: recipient.getName(),
            message: message,
            timestamp: new Date()
        };
        this.notifications.push(newNotification);
        
        // Simulating immediate delivery/log
        console.log(`[Notification Alert for ${recipient.getName()}]: ${message}`);
    }

    static getNotificationsFor(user: User): AppNotification[] {
        return this.notifications.filter(n => n.recipient === user.getName());
    }
}



class Message {
    private author: User;
    private content: string;
    private timestamp: string;

    constructor(author: User, content: string, timestamp: string) {
        this.author = author;
        this.content = content;
        this.timestamp = timestamp;


        author.getMessages().push(this);
    }

    getAuthor(): User { return this.author; }
    getContent(): string { return this.content; }
    getTimestamp(): string { return this.timestamp; }
}

class User {
    private name: string;
    private followers: User[] = [];
    private following: User[] = [];
    private messages: Message[] = [];

    constructor(name: string) {
        this.name = name;
    }

    follow(user: User): void {
        // TODO: Add user to following, add this to user's followers
        // Guard against: self-follows, duplicates
        if (user === this) {
            console.log("You can't follow yourself");
            return;
        }
    
        // Guard against duplicate follows
        if (!this.following.includes(user)) {
            this.following.push(user);
            user.followers.push(this); // Fully valid TypeScript access
            console.log(this.name + " followed "  + user.getName());
            NotificationService.send(user, `${this.name} started following you!`);
        }
    }

    sendMessage(content: string, timestamp: string): void {
        // TODO: Create Message and add to messages list
        new Message(this, content, timestamp);
    }

    getName(): string { return this.name; }
    getFollowers(): User[] { return this.followers; }
    getFollowing(): User[] { return this.following; }
    getMessages(): Message[] { return this.messages; }
}


// const Ramesh = new User('Ramesh');
// const Pintu  = new User('Pintu');

// Ramesh.follow(Ramesh);
// Ramesh.follow(Pintu);

// Ramesh.sendMessage("Hii this is first message" , new Date().toLocaleString())
// Ramesh.sendMessage("Hii this is 2nd message" , new Date().toLocaleString())
// Ramesh.sendMessage("Hii this is 3rd message and let's see how it gets logged" , new Date().toLocaleString())

// const messagees =Ramesh.getMessages();

// messagees.forEach(m => console.log(m.getAuthor().getName() + " Sent a message- " , m.getContent() , m.getTimestamp()));

console.log("--- 1. Creating Users ---");
const alice = new User("Alice");
const bob = new User("Bob");
const charlie = new User("Charlie");

console.log("\n--- 2. Setting Up Follows & Testing Guards ---");
alice.follow(bob);     // Expected: Alice followed Bob
alice.follow(bob);     // Expected: Duplicate guard ignores this (No text printed)
alice.follow(alice);   // Expected: "You can't follow yourself"
bob.follow(charlie);   // Expected: Bob followed Charlie

console.log("\n--- 3. Verifying Relationship Syncing ---");
// Check Alice's lists
console.log(`Alice following count (Expected 1): ${alice.getFollowing().length}`); 
console.log(`Alice following name: ${alice.getFollowing()[0]?.getName()}`);

// Check Bob's lists (Should be following Charlie, and followed by Alice)
console.log(`Bob followers count (Expected 1): ${bob.getFollowers().length}`);
console.log(`Bob follower name: ${bob.getFollowers()[0]?.getName()}`);
console.log(`Bob following count (Expected 1): ${bob.getFollowing().length}`);
console.log(`Bob following name: ${bob.getFollowing()[0]?.getName()}`);

console.log("\n--- 4. Testing Message Creation ---");
alice.sendMessage("Hello world!", "2026-07-25 12:00");
bob.sendMessage("Hey Alice!", "2026-07-25 12:05");

console.log("\n--- 5. Verifying Message Syncing ---");
// Check if messages were automatically registered to the authors
console.log(`Alice messages count (Expected 1): ${alice.getMessages().length}`);
console.log(`Alice's last message: "${alice.getMessages()[0]?.getContent()}"`);

console.log(`Bob messages count (Expected 1): ${bob.getMessages().length}`);
console.log(`Bob's last message: "${bob.getMessages()[0]?.getContent()}"`);

NotificationService.getNotificationsFor(bob).forEach(n => {
    console.log(`[Notification for Bob]: ${n.message} at ${n.timestamp}`);
})

