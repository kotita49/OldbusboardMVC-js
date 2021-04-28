class Test{
	constructor(name, id) {
		this.name = name;
		this.id = id;
	}

	showTestData() {
		return this.name + ", id: " + this.id; 
	};

	editName(newName) {
		this.name = newName
	}
};

class Bus {
	constructor(line, direction, expected_departure_time){
		this.line = line;
		this.direction = direction;
		this.expected_departure_time = expected_departure_time
	}
	showBusdata(){
		return "Bus "+ this.line + " direction: " + this.direction + " departs at " + this.expected_departure_time;
	}
}

module.exports = Bus;
