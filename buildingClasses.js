
// I may add more functions in the future, but for now Mine, Storage and Power all use calculate
function Global() {
	this.calculate = function(level, constant, divisor) {
		if (level === 0) {
			return 0;
		}
		else {
			return Math.floor(Math.pow(constant, (1 + (level - 1) / divisor) ) );
		}
	}
}

var glob = new Global();

// This is the sort of thing I could turn into a module
/*
 * Many functions that don't incorporate name and/or level have them for abstraction purposes
 */
function Mine() {
	this.production = function(name, level) {
		return glob.calculate(level, 10, 10.0);
	}

	this.power = function(name, level) {
		return glob.calculate(level, 5, 7.0);
	}

	this.cost = function(name, level) {
		switch(name) {
			case 'crystal':
				// console.log(name, level)
				return {
					crystal: glob.calculate(level, 20, 8.7),
					steel: glob.calculate(level, 20, 8.7),
					titanium: glob.calculate(level, 20, 9.65),
					tritium: glob.calculate(level, 20, 10.1)
				}
				break;
			case 'steel':
				return {
					crystal: glob.calculate(level, 20, 8.7),
					steel: glob.calculate(level, 20, 9.65),
					titanium: glob.calculate(level, 20, 8.7),
					tritium: glob.calculate(level, 20, 10.1)
				}
				break;
			case 'titanium':
				return {
					crystal: glob.calculate(level, 20, 8.7),
					steel: glob.calculate(level, 20, 9.65),
					titanium: glob.calculate(level, 20, 8.7),
					tritium: glob.calculate(level, 20, 10.1)
				}
				break;
			case 'tritium':
				return {
					crystal: glob.calculate(level, 20, 10.1),
					steel: glob.calculate(level, 20, 9.65),
					titanium: glob.calculate(level, 20, 8.7),
					tritium: glob.calculate(level, 20, 8.7)
				}
				break;
			default:
				break;
		}
	}

	this.requirements = function(name) {
		return {}
	}
}

function Storage() {
	this.capacity = function(name, level) {
		return glob.calculate(level, 2000, 41.8);
	}

	this.power = function(name, level) {
		return 0;
	}

	this.cost = function(name, level) {
		switch(name) {
			case 'crystal':
				return {
					crystal: glob.calculate(level, 20, 8.5),
					steel: glob.calculate(level, 20, 8.7),
					titanium: 0,
					tritium: glob.calculate(level, 20, 8.7)
				}
				break;
			case 'steel':
				return {
					crystal: glob.calculate(level, 20, 8.7),
					steel: glob.calculate(level, 20, 9.5),
					titanium: glob.calculate(level, 20, 9.5),
					tritium: glob.calculate(level, 20, 8.7)
				}
				break;
			case 'titanium':
				return {
					crystal: glob.calculate(level, 20, 8.7),
					steel: glob.calculate(level, 20, 9.5),
					titanium: glob.calculate(level, 20, 9.5),
					tritium: glob.calculate(level, 20, 8.7)
				}
				break;
			case 'tritium':
				return {
					crystal: glob.calculate(level, 20, 8.7),
					steel: glob.calculate(level, 20, 8.7),
					titanium: 0,
					tritium: glob.calculate(level, 20, 8.5)
				}
				break;
			default:
				break;
		}
	}

	this.requirements = function(name) { // not called in that table helper function, so doesn't need to conform to abstraction
		return {}
	}
}

function Power() {
	this.production = function(name, level) {
		if(name === 'planetary_power_generator') {
			return glob.calculate(level, 50, 17.0);
		}
		else if (name === 'hydro_power_plant' || name === 'wind_power_plant' || name === 'thermal_power_plant') {
			return glob.calculate(level, 10, 9.1);
		}		
	}	

	this.power = function(name, level) {
		return 0;
	}

	this.cost = function(name, level) {
		switch(name) {
			case 'hydro_power_plant':
				return {
					crystal: glob.calculate(level, 20, 11.6),
					steel: glob.calculate(level, 20, 11.6),
					titanium: glob.calculate(level, 10, 9.7),
					tritium: glob.calculate(level, 20, 10.8)
				}
				break;
			case 'wind_power_plant':
				return {
					crystal: glob.calculate(level, 20, 11.6),
					steel: glob.calculate(level, 20, 11.6),
					titanium: glob.calculate(level, 20, 11.6),
					tritium: glob.calculate(level, 20, 11.6)
				}
				break;
			case 'thermal_power_plant':
				return {
					crystal: glob.calculate(level, 20, 11.6),
					steel: glob.calculate(level, 10, 9.7),
					titanium: glob.calculate(level, 10, 9.7),
					tritium: glob.calculate(level, 20, 11.6)
				}
				break;
			case 'planetary_power_generator':
				return {
					crystal: glob.calculate(level, 200, 23.5),
					steel: Math.floor(glob.calculate(level, 200, 23.5) / 2),
					titanium: Math.floor(glob.calculate(level, 200, 23.5) / 2),
					tritium: Math.floor(glob.calculate(level, 200, 23.5) / 2)
				}
				break;
			default:
				break;
		}
	}

	this.requirements = function(name) {
		return {}
	}
}

function IO() {
	this.output_multiplier = function(name, level) {
		if (level === 0) {
			return 0;
		} 
		else if (level < 21) {
			return 1 + 0.1 * (level - 1);
		}
		else {
			return 3.5;
		}
	}

	this.power = function(name, level) {
		return 0;
	}

	this.cost = function(name, level) {
		return {
			crystal: glob.calculate(level, 100, 46),
			steel: glob.calculate(level, 800, 44.5),
			titanium: glob.calculate(level, 200, 35),
			tritium: glob.calculate(level, 100, 46)
		}
	}

	// contains sum levels
	this.requirements = function(name) {
		switch(name) {
			case 'liquid_power_plant':
				return {
					mine: [['crystal', 20]] // aka sum of crystal mine levels must >= 20
				}
				break;
			case 'furnace_power_plant':
				return {
					mine: [['metal', 20]] // special case meaning sum of all steel + titanium >= 20
				}
				break;
			case 'nuclear_power_plant':
				return  {
					mine: [['tritium', 20]]
				}
				break;
			default:
				break;
		}
	}
}

function Economy() {
	this.traders = function(name, level) {
		return level;
	}

	this.power = function(name, level) {
		return 5 + level * 5; // this function is duplicated in Technology
	}

	this.cost = function(name, level) {
		return {
			crystal: glob.calculate(level, 200, 24.2),
			steel: glob.calculate(level, 200, 23.5),
			titanium: 0,
			tritium: glob.calculate(level, 200, 23.8)
		}
	}

	this.requirements = function(name) {
		return {
			fleet: [['fleet_base', 5]]
		}
	}
}

function Fleet() {
	// just for fleet_base
	this.fleets = function(name, level) {
		return level;
	}

	// just for customization_shipyard
	this.ship_rate_multiplier = function(name, level) {
		if (name === 'customization_shipyard') {
			if (level < 21) {
				return (100 - level) / 100.0; // 1 to 0.8
			}
			else {
				return 0.75;
			}
		}
		else {
			return 0;
		}
		
	}

	this.power = function(name, level) {
		if (name === 'fleet_base') {
			return glob.calculate(level, 10, 11.7);
		}
		// All shipyards have same requirements
		else {
			return glob.calculate(level, 10, 13.5);
		}
	}

	this.cost = function(name, level) {
		if (name === 'fleet_base') {
			return {
				crystal: glob.calculate(level, 300, 27.5),
				steel: Math.floor(glob.calculate(level, 300, 27.5) / 2),
				titanium: Math.floor(glob.calculate(level, 300, 27.5) / 2),
				tritium: glob.calculate(level, 300, 27.5)
			}
		}
		// All shipyards have same requirements
		else {
			return {
				crystal: glob.calculate(level, 200, 21.9),
				steel: glob.calculate(level, 200, 21.1),
				titanium: 0,
				tritium: glob.calculate(level, 200, 21.4)
			}
		}
	}

	this.requirements = function(name) {
		switch(name) {
			case 'fleet_base':
				return {}
				break;
			case 'neutral_shipyard':
				return {
					fleet: [['fleet_base', 1]]
				}
				break;
			case 'military_shipyard':
				return {
					fleet: [['fleet_base', 3]]
				}
				break;
			case 'customization_shipyard':
				return {
					economy: [['trade_center', 10]],
					fleet: [['neutral_shipyard', 5], ['military_shipyard', 5]]
				}
				break;
			default:
				break;
		}
	}
}

function Defense() {
	this.defense_rate_multiplier = function(name, level) { // think about moving this function into global for rates
		if (level < 21) {
			return (100 - level) / 100.0; // 1 to 0.8
		}
		else {
			return 0.75;
		}
	}

	this.power = function(name, level) {
		return level * 10;
	}

	this.cost = function(name, level) {
		return {
			crystal: glob.calculate(level, 300, 31.8),
			steel: glob.calculate(level, 200, 29.2),
			titanium: glob.calculate(level, 200, 29.2),
			tritium: glob.calculate(level, 200, 29.2)
		}
	}

	this.requirements = function(name) {
		return {}
	}
}

function Technology() {
	this.batch_size = function(name, level) { // This function is correct, but I don't know how much this matters if I don't take time into consideration
	// look into how Crank does timing. That may be a good implementation
		if (level === 0) {
			return 0;
		}
		else {
			return 5 + level * 5;
		}
	}

	this.power = function(name, level) {
		return level * 20;
	}

	this.cost = function(name, level) {
		return {
			crystal: glob.calculate(level, 1000, 37.4),
			steel: Math.floor(glob.calculate(level, 1000, 37.4) / 2),
			titanium: Math.floor(glob.calculate(level, 1000, 37.4) / 2),
			tritium: Math.floor(glob.calculate(level, 1000, 37.4) / 2)
		}
	}

	this.requirements = function(name) {
		return {
			mine: [['all', 15]] // meaning sum of all mines >= 15
		}
	}
}

var mine       = new Mine(),
	storage    = new Storage(),
	power      = new Power(),
	io         = new IO(),
	economy    = new Economy(),
	fleet      = new Fleet(),
	defense    = new Defense(),
	technology = new Technology();

