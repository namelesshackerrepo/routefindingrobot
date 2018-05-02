//every package has to be picked up and delivered some other place
//once every packaged has been picked up and delivered, the program is finished

const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall",
  "Seth's House-Cabin"
];

function buildGraph(roads) {
  let graph = Object.create(null);
  function addPath(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of roads.map(road => road.split("-"))) {
    addPath(from, to);
    addPath(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);

//helper functions
function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

//robot types
//this is a robot that randomly picks its next destination
function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}

//a class to keep track of 2 states
  //1.  - where the robot currently is
  //2.  - a parcels array that holds parcels 
class VillageState {
  constructor(place, parcels) {
    //current location
    this.place = place;
    //array of object tupals, {place: "Bob's House", address: "Cabin"} first is pick up, second is delivery
    this.parcels = parcels;
  }
  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels.map(p => {
        //if p.place is not where we currently are, then there is no package to pick up, so we just leave it alone
        if (p.place != this.place) return p;
        //else we pick that shit up, and change its place to be the next place where headed, since we are just now going to carry it around with us until we find its spot to be delivered
        return {place: destination, address: p.address};
        //the filter is getting rid of packages that are ready to be delivered
      }).filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}

//function added to the state class to produce random parcels for testing 
//our robot's route system
VillageState.random = function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    //address is a delivery
    let address = randomPick(Object.keys(roadGraph));
    //place is a pick up
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({place, address});
  }
  return new VillageState("Post Office", parcels);
};

//function to run the robot
function runRobot(state, robot, memory) {
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}

runRobot(VillageState.random(), randomRobot, []);
