
// Many to Many Association 
class User{
     private name:string;
     private groups : Group[]  = [];

     constructor(name:string){
        this.name = name
     }

     addGroup(group: Group){
        if(!this.groups.includes(group)){
            this.groups.push(group)
            group.addUser(this);
        }
     }

     getName(): string { return this.name; }
     getGroups(): Group[] { return this.groups; }
}

class Group{
    private name:string;
    private users : User[]  = []

    constructor(name:string){
        this.name = name
     }

    addUser(user: User){
        if(!this.users.includes(user)){
            this.users.push(user)
            user.addGroup(this);
        }
    }

    getName(): string { return this.name; }
    getUsers(): User[] { return this.users; }
}


const bob = new User("bob");
const alice = new User("alice");
const mike = new User("mike");


const reddit = new Group("reddit");
const Wp = new Group("wp");
const Fb = new Group("Fb");

bob.addGroup(reddit);
bob.addGroup(Wp);
bob.addGroup(Fb);


console.log(bob.getGroups())
console.log(reddit.getUsers())
// reddit.addUser(bob);

