import ParkingFloor from "./Floor";
import ParkingSpot from "./Spot";
import AbstractVehicle from "./Vehicle";

class ParkingLot {
  private static instance: ParkingLot;
  private floors: ParkingFloor[]
  name : string;
  protected carSpotMap: Record<string,ParkingSpot> 

  private constructor(name: string){
    this.name = name
    this.floors = []
    this.carSpotMap = {}
  }

  static getInstance(name: string = "Default"): ParkingLot{
    if(!ParkingLot.instance){
      this.instance = new ParkingLot(name)
      console.log('ParkingLot instance created with name:', name)
    }else{
      console.log('ParkingLot instance already exists with name:', this.instance.name)
    }
    return ParkingLot.instance
  }

  parkCar(vehicle: AbstractVehicle): void{
    for(let floor of this.floors){
      const availableSpot = floor.findAvailableSpot(vehicle)
      if(availableSpot){
        availableSpot.parkCar(vehicle)
        this.carSpotMap[vehicle.getNumber()] = availableSpot
        console.log('Car parked:', `${vehicle.getNumber()} parked on ${availableSpot.spotName}`)
        return 
      }
    }
  }

  unparkCar(vehicle: AbstractVehicle){
    const spot = this.carSpotMap[vehicle.getNumber()] 
    if(!spot){
      console.log('Car not found:', `${vehicle.getNumber()} is not Parked.`)
      throw new Error(`${vehicle.getNumber()} is not Parked.`)
    }
    spot.unparkCar()
    console.log('Car unparked:', `${vehicle.getNumber()} unparked from ${spot.spotName}`)
    delete this.carSpotMap[vehicle.getNumber()];
  }

  spotAvailability(){
    for(let floor of this.floors){
      const availability = floor.reportAvailability()
      console.log('Spot availability:', `${floor.floor} : `, availability)
    }
  }

  addFloor(floor : ParkingFloor){
    this.floors.push(floor)
  }
}

export default ParkingLot