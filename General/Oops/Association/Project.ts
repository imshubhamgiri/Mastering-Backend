class Room{
    constructor(
        private number: string,
        private floor: number
    ) {}

    getNumber(): string { return this.number; }
    getFloor(): number { return this.floor; }
}


class Appointment{
    constructor(
        private doctor: Doctor,
        private patient: Patient,
        private room: Room,
        private time: string
    ) {
         doctor.addAppointment(this);
         patient.addApointment(this);
    }

    getDoctor() : Doctor{
        return this.doctor;
    }
    getPatient(): Patient { return this.patient; }
    getRoom(): Room { return this.room; }
    getTime(): string { return this.time; }
}



class Doctor{
    private appointments: Appointment[] = [];

    constructor(
        private name: string,
        private specialization: string
    ) {}

    addAppointment(appt: Appointment): void {
        this.appointments.push(appt);
    }

    getPatients(): Patient[] {
        const seen = new Set<Patient>();
        return this.appointments
            .map(a => a.getPatient())
            .filter(p => { if (seen.has(p)) return false; seen.add(p); return true; });
    }

    getName(): string { return this.name; }
    getSpecialization(): string { return this.specialization; }
    getAppointments(): Appointment[] { return this.appointments; }


}

class Patient{
    private name:string;
    private appointments: Appointment[] = [];
    constructor(name:string){
        this.name = name;
    }

    addApointment(apointment:Appointment){
        if(!this.appointments.includes(apointment)){
            this.appointments.push(apointment);
        }
    }

    getDoctors(): Doctor[] {
        const seen = new Set<Doctor>();
        return this.appointments
            .map(a => a.getDoctor())
            .filter(d => { if (seen.has(d)) return false; seen.add(d); return true; });
    }

    getName(): string { return this.name; }
    getAppointments(): Appointment[] { return this.appointments; }
}


const drSmith = new Doctor("Dr. Smith", "Cardiology");
const drPatel = new Doctor("Dr. Patel", "Neurology");

const alice = new Patient("Alice");
const bob = new Patient("Bob");

const room101 = new Room("101", 1);
const room205 = new Room("205", 2);

new Appointment(drSmith, alice, room101, "9:00 AM");
new Appointment(drSmith, bob, room101, "10:00 AM");
new Appointment(drPatel, alice, room205, "2:00 PM");

console.log(`${drSmith.getName()}'s patients:`);
for (const p of drSmith.getPatients()) {
    console.log(`  - ${p.getName()}`);
}

console.log(`${alice.getName()}'s doctors:`);
for (const d of alice.getDoctors()) {
    console.log(`  - ${d.getName()} (${d.getSpecialization()})`);
}

console.log(`${drSmith.getName()}'s schedule:`);
for (const a of drSmith.getAppointments()) {
    console.log(`  - ${a.getTime()} with ${a.getPatient().getName()} in Room ${a.getRoom().getNumber()}`);
}