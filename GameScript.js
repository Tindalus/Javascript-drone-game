
// AppearTarget()
function AddTarget() {
    const body = document.body
    const div = document.createElement('div')
    body.querySelector(".grid").append(div)
    div.setAttribute("id","target")
    div.innerText = "◻"
}



// create drone at port i
function AddDrone(i,j) {
    const body = document.body
    const div = document.createElement('div')
    body.querySelector("#port"+i).append(div)
    div.setAttribute("id","drone"+j)
    div.style.gridRow = body.querySelector("#port"+i).style.gridRow
    div.style.gridColumn = body.querySelector("#port"+i).style.gridColumn
    div.style.position = "absolute"
    div.dataset.moving = false
    div.dataset.motherport = "#port"+i


    let Drone = {position: [Number(div.style.gridRow)-1,Number(div.style.gridColumn)-1], target: [0,0], motherport: "#port"+i, id:"#drone"+j, idle: true, targetName: null}
    div.innerText = ""
    div.style.fontSize = "2rem"
    div.style.margin = "auto"
    return Drone
}


//drone movement
function MoveDrone(Drone,Name) {
    if (Drone.target[0]-Drone.position[0] > 0 && Drone.target[0] == Drone.position[0]) {document.querySelector(Name).style.gridRow = Number(document.querySelector(Name).style.gridRow)+1}
    if (Drone.target[0]-Drone.position[0] < 0 && Drone.target[0] == Drone.position[0]) {document.querySelector(Name).style.gridRow = Number(document.querySelector(Name).style.gridRow)-1}
    if (Drone.target[1]-Drone.position[1] > 0 && Drone.target[1] == Drone.position[1]) {document.querySelector(Name).style.gridColumn = Number(document.querySelector(Name).style.gridColumn)+1}
    if (Drone.target[1]-Drone.position[1] < 0 && Drone.target[1] == Drone.position[1]) {document.querySelector(Name).style.gridColumn = Number(document.querySelector(Name).style.gridColumn)-1}
}

// roboports 
const DroneAmount = 20
let Drones = []
// let PortCoords = [[5,5],[5,15],[15,5],[15,15]]
let PortCoords = [[10,10],[10,30],[30,10],[30,30]]
for (let i = 0; i < 4; i++) {
    //spawning ports
    const div = document.createElement('div')
    document.body.querySelector(".grid").append(div)
    div.setAttribute("id","port"+i)
    div.innerText = "O"

    //setting their coords and visuals
    document.querySelector("#port"+i).style.gridRow = PortCoords[i][0]
    document.querySelector("#port"+i).style.gridColumn = PortCoords[i][1]
    document.querySelector("#port"+i).style.margin = "auto"
    document.querySelector("#port"+i).style.fontSize = "2.5rem"

    //setting port's drones properties
    document.querySelector("#port"+i).dataset.freeDrones = 5

    //Drones loop
    for (let j = 0; j < DroneAmount/4; j++) {
        let Drone = AddDrone(i,j)
        Drones.push(Drone)
    }
}



let Targets = []
let TargetsNames = []
const TargetAmount = Math.floor(Math.random() * DroneAmount)
//random targets creation loop
for (let i = 0; i <TargetAmount; i++) {
    AddTarget() // spawn target
    document.querySelector("#target").setAttribute("id","target"+i) //give target a number

    //randomize spawn location
    let rowrandom = Math.floor(Math.random() * 40)
    let colrandow = Math.floor(Math.random() * 40)
    let TargetCoord = [rowrandom,colrandow]
    //check for duplicates and port spawns
    for (let j = 0; j < Targets.length; j++) {
        if (Targets[j][0] == TargetCoord[0]){
            if (Targets[j][1] == TargetCoord[1]){
                document.querySelector("#target"+i).remove()
                i-=1; continue;
            }
        }
    }

    Targets.push(TargetCoord) // storing targets coordinates
    TargetsNames.push("#target"+i)

    // assigning coordinates to targets and setting visuals for them
    document.querySelector("#target"+i).style.gridRow = rowrandom+1
    document.querySelector("#target"+i).style.gridColumn = colrandow+1
    document.querySelector("#target"+i).style.margin = "auto"
    document.querySelector("#target"+i).style.fontSize = "2rem"

}
//deleting targets that spawned on ports
for (let k = 0; k < Targets.length; k++) {
    for (let m=0; m < PortCoords.length; m++) {
        if (Targets[k][0]+1 == PortCoords[m][0]){
            if (Targets[k][1]+1 == PortCoords[m][1]){document.querySelector("#target"+k).remove()}
        }
    }
}
let MinTargetDistance = 0
let ClosestPort = 0
for (let i = 0; i < Targets.length; i++) {//i targets loop
    //finding closest port to target
    let TargetDistances = []
    for (let j = 0; j < 4; j++) { //ports loop
            TargetDistances.push(Math.sqrt((Math.abs(document.querySelector("#port"+j).style.gridRow - Targets[i][0]))**2+(Math.abs(document.querySelector("#port"+j).style.gridColumn - Targets[i][1]))**2))
    }
    MinTargetDistance = Math.min(...TargetDistances)
    for (let j = 0; j<4; j++) {
        if(TargetDistances[j] == MinTargetDistance) {ClosestPort = "#port"+j}
    }
    
    //assign target
    if (document.querySelector(ClosestPort).dataset.freeDrones > 0){ //checking if closest port has free drones
        for (let j = 0; j < Drones.length; j++) { //finding available drone at that port
            if (Drones[j].motherport == ClosestPort && Drones[j].idle == true) {
                Drones[j].target = Targets[i]//assigning target to it
                Drones[j].targetName = TargetsNames[i]
                Drones[j].idle = false//changing its status
                document.querySelector(ClosestPort).dataset.freeDrones -= 1
                break
            } 
        }
    } else { //if it doesn't have free drone we select another one
        for (let j = 0; j < 4; j++) {
            if (document.querySelector("#port"+j).dataset.freeDrones > 0) { 
                ClosestPort = "#port"+j
                break
            }
        }
        for (let j = 0; j < Drones.length; j++) {//assigning target to it
            if (Drones[j].motherport == ClosestPort && Drones[j].idle == true) {
                Drones[j].target = Targets[i]
                Drones[j].targetName = TargetsNames[i]
                Drones[j].idle = false//changing its status
                break
            }
        }
    }
}

const ReleasedDronesIds = []
// releasing drones frome ports
for (let i = 0; i < Drones.length; i++) {
    if (Drones[i].idle == false) {
        if (document.querySelector(Drones[i].motherport).querySelector(Drones[i].id).dataset.moving == "false") {
            document.querySelector(Drones[i].motherport).querySelector(Drones[i].id).id = "WorkingDrone"+i
            document.querySelector(Drones[i].motherport).querySelector("#WorkingDrone"+i).dataset.moving = true
            document.querySelector(".grid").append(document.querySelector(Drones[i].motherport).querySelector("#WorkingDrone"+i))
            ReleasedDronesIds.push(i)
        }
    }
}



//Movement
function myMove() {
    let id = null
    let TargetCount = Targets.length
    clearInterval(id);
    id = setInterval(frame, 100);
    function frame() {
    if (TargetCount == 0) {
        clearInterval(id);
    } else {
        for (let i = 0; i < ReleasedDronesIds.length; i++) {
            document.querySelector(".grid").querySelector("#WorkingDrone"+ReleasedDronesIds[i]).innerText = "X"


            //movement to targer
            if (Drones[ReleasedDronesIds[i]].target[0] != Number(Drones[ReleasedDronesIds[i]].position[0])) {
                if (Drones[ReleasedDronesIds[i]].target[0]-Number(Drones[ReleasedDronesIds[i]].position[0]) > 0) {
                    document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridRow = Number(document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridRow)+1
                    Drones[ReleasedDronesIds[i]].position[0] = Number(Drones[ReleasedDronesIds[i]].position[0])+1
                }
                if (Drones[ReleasedDronesIds[i]].target[0]-Number(Drones[ReleasedDronesIds[i]].position[0]) < 0) {
                    document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridRow = Number(document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridRow)-1
                    Drones[ReleasedDronesIds[i]].position[0] = Number(Drones[ReleasedDronesIds[i]].position[0])-1
                }
            } else {document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridRow = Number(document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridRow)}
            if (Drones[ReleasedDronesIds[i]].target[1] != Number(Drones[ReleasedDronesIds[i]].position[1])) {
                if (Drones[ReleasedDronesIds[i]].target[1]-Number(Drones[ReleasedDronesIds[i]].position[1]) > 0) {
                    document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridColumn = Number(document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridColumn)+1
                    Drones[ReleasedDronesIds[i]].position[1] = Number(Drones[ReleasedDronesIds[i]].position[1])+1
                }
                if (Drones[ReleasedDronesIds[i]].target[1]-Number(Drones[ReleasedDronesIds[i]].position[1]) < 0) {
                    document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridColumn = Number(document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridColumn)-1
                    Drones[ReleasedDronesIds[i]].position[1] = Number(Drones[ReleasedDronesIds[i]].position[1])-1
                }
            } else {document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridColumn = Number(document.querySelector("#WorkingDrone"+ReleasedDronesIds[i]).style.gridColumn)}
            
            //aquiring the target
            if (Drones[ReleasedDronesIds[i]].target[1] == Number(Drones[ReleasedDronesIds[i]].position[1]) && Drones[ReleasedDronesIds[i]].target[0] == Number(Drones[ReleasedDronesIds[i]].position[0])) {
                //getting drone back inside the port
                if (PortCoords[Drones[ReleasedDronesIds[i]].motherport.charAt(5)][0] == Number(Drones[ReleasedDronesIds[i]].position[0])+1 && PortCoords[Drones[ReleasedDronesIds[i]].motherport.charAt(5)][1] == Number(Drones[ReleasedDronesIds[i]].position[1])+1) {
                    document.querySelector(".grid").querySelector("#WorkingDrone"+ReleasedDronesIds[i]).innerText = ""
                    document.querySelector(Drones[ReleasedDronesIds[i]].motherport).append(document.querySelector(".grid").querySelector("#WorkingDrone"+ReleasedDronesIds[i]))
                    Drones[ReleasedDronesIds[i]].idle = true
                }
                Drones[ReleasedDronesIds[i]].target[0] = PortCoords[Drones[ReleasedDronesIds[i]].motherport.charAt(5)][0]-1 //sending this drone back
                Drones[ReleasedDronesIds[i]].target[1] = PortCoords[Drones[ReleasedDronesIds[i]].motherport.charAt(5)][1]-1 //sending this drone back
                if (Drones[ReleasedDronesIds[i]].idle == false) {document.querySelector(Drones[ReleasedDronesIds[i]].targetName).remove()}
                
            }
        }
    }
    }
}
myMove()
console.log(Drones)