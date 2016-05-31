
/*
 * The class that contains all DOM modifications
 */
function UI() {

}

/*
 * Extension of String.prototype that capitalizes the first letter of a string, or splits and capitalizes a string
 *
 * return String
 */
String.prototype.capitalize = function() {
	// won't look good for io, so hardcode that
	if (this[0] === 'i' && this[1] === 'o') {
		return 'Input-Output';
	}

	var stringArray,
		returnString = '',
		i;

	// check if snake_case
	if (this.indexOf('_') > -1) {
		stringArray = this.split('_');
	}
	else {
		stringArray = [this]
	}

	for (i = 0; i < stringArray.length; i++) {
		returnString += stringArray[i].charAt(0).toUpperCase() + stringArray[i].slice(1);

		if (i < stringArray.length - 1) {
			returnString += ' ';
		}
	}
    return returnString;
}

/*
 * Generates a table for a specific building category
 *
 * Type      Parameter   Description
 * String    category    The building category for the table
 * [String]  attributes  Additional table columns specific to the building type
 *
 * return $
 */
UI.prototype.generateBuildingTable = function(category, attributes) {
	// clear active-wrapper, rebuild if power or io
	if (category !== 'io') {
		$('#active-wrapper').empty();
	}
	else {
		$('.table[data-category="io"]').remove();
	}
	// $('.table[data-category="'+category+'"]').remove();

	var $table,
		$headerRow,
		i,
		attribute,
		$tbody,
		name,
		instances,
		level,
		$row;

	$table = $('<table class="table" data-category="'+category+'">\
						<thead>\
							<tr>\
								<th>'+category.capitalize()+'</th>\
								<th>Level</th>\
								<th>Crystal</th>\
					            <th>Steel</th>\
					            <th>Titanium</th>\
					            <th>Tritium</th>\
					            <th>Power</th>\
							</tr>\
						</thead>\
						<tbody>\
						</tbody>\
					</table>');

	// generate unique headers
	$headerRow = $table.find('tr');

	for (i = 0; i < attributes.length; i++) {
		attribute = attributes[i].capitalize();
		if (attribute === 'Production' || attribute === 'Capacity') {
			attribute = 'Current ' + attribute;
		}

		$headerRow.append('<th>'+attribute+'</th>');
	}

	// generate header placeholder for upgrade, buy and delete buttons
	$headerRow.append('<th></th>');

	// generate body
	$tbody = $table.find('tbody');

	for (name in planet.buildings[category]) {
		if (!planet.buildings[category].hasOwnProperty(name)) continue;

		// loop through building instances
		instances = planet.buildings[category][name];

		if (instances.length > 0) {
			for (i = 0; i < instances.length; i++) {
				level = instances[i];

				$row = this.generateBuildingRow(category, name, attributes, level, i);

				$tbody.append($row);
			}
		} 
		else {
			// create row that can be bought
			$row = this.generateBuildingRow(category, name, attributes, 0, -1);

			$tbody.append($row);
		}	
	}
	$('#active-wrapper').append($table);
	// build io table if category was power (since power eliminates it)
	if (category === 'power') {
		this.generateBuildingTable('io', ['output_multiplier', 'difference']);
	}	
}

/*
 * Helper function for UI.addAttributeColumnsToRow that reduces repeated multiplier code
 *
 * Type      Parameter      Description
 * String    category       The building category for the table
 * String    name           The name of the building
 * Float     value          The value that needs to be *= by a multiplier
 *
 * return float
 */
UI.prototype.multiplyValue = function(category, name, value) {
	if (category === 'mine') {
		value = Math.floor(value * planet.mine_rate_multipliers[name]);
	}
	else if (category === 'power') {
		value = Math.floor(value * planet.power_multipliers[name]);
	}

	return value;
}

/*
 * Helper function for UI.addAttributeColumnsToRow that adds a non-difference attribute column (<td> element) to a row and returns it
 *
 * Type      Parameter      Description
 * String    category       The building category for the table
 * String    name           The name of the building
 * [String]  attribute      Table column specific to the building type
 * Object    buildingClass  The specific class of the building
 * Int       level          The building's current level
 * $         $row           The previously constructed row for the <td> elements to be appended to
 *
 * return $
 */
UI.prototype.notDifferenceColumn = function(category, name, attribute, buildingClass, level, $row) {
	var attributeValue;

	// show what attribute value is for current level
	if (name === 'customization_shipyard') {
		attributeValue = planet.ship_rate_multiplier;
	}
	else if (name === 'defense_factory') {
		attributeValue = planet.defense_rate_multiplier;
	}
	else if (category === 'io') { // io can't work with traditional multiplyValue call since multiplier already incorporates it
		attributeValue = buildingClass[attribute](name, level);

		if (level > 1) {
			// divide by existing portion of planet.io_multipliers[name]
			attributeValue /= buildingClass[attribute](name, level - 1);
		}
		// round multiplied version	
		attributeValue = Math.round(attributeValue * planet.io_multipliers[name] * 10) / 10.0;
	}
	else {
		attributeValue = buildingClass[attribute](name, level); // e.g. power.production('wind_power_plant', 2)

		attributeValue = this.multiplyValue(category, name, attributeValue);
	}

	$row.append('<td>'+attributeValue+'</td>');

	return $row;
}

/*
 * Helper function for UI.addAttributeColumnsToRow that adds a difference attribute column (<td> element) to a row and returns it
 *
 * Type      Parameter      Description
 * String    category       The building category for the table
 * String    name           The name of the building
 * [String]  attribute      Table column specific to the building type
 * Object    buildingClass  The specific class of the building
 * Int       level          The building's current level
 * $         $row           The previously constructed row for the <td> elements to be appended to
 *
 * return $
 */
UI.prototype.differenceColumn = function(category, name, attribute, buildingClass, level, $row) {
	var difference,
		sign = '+'
		nextLevel = level + 1;

	if (name === 'customization_shipyard' || name === 'defense_factory') {
		sign = '';
	}

	if (nextLevel > 21) {
		$row.append('<td>--</td>');
	}
	else {
		if (name === 'customization_shipyard' || name === 'defense_factory') {
			level < 20 ? difference = -0.01 : difference = -0.05; // hardcoded because abstraction adds too much logic
		} 
		else {
			difference = buildingClass[attribute](name, nextLevel) - buildingClass[attribute](name, level);

			if (category === 'io') {
				if (level > 1) { // can't do every time because dividing by 0 = Infinity
					// divide by existing portion of planet.io_multipliers[name]
					difference /= buildingClass[attribute](name, level);
				}

				// round multiplied version	
				difference = Math.round(difference * planet.io_multipliers[name] * 10) / 10.0;
			}
			else {
				difference = this.multiplyValue(category, name, difference);
			}
		}

		$row.append('<td class="increase">'+sign+difference+'</td>');
	}

	return $row;
}

/*
 * Helper function for UI.generateBuildingTable that adds attribute columns (<td> elements) to a row and returns it
 *
 * Type      Parameter      Description
 * String    category       The building category for the table
 * String    name           The name of the building
 * [String]  attributes     Additional table columns specific to the building type
 * Object    buildingClass  The specific class of the building
 * Int       level          The building's current level
 * $         $row           The previously constructed row for the <td> elements to be appended to
 *
 * return $
 */
UI.prototype.addAttributeColumnsToRow = function(category, name, attributes, buildingClass, level, $row) {
	var nextLevel = level + 1,
		i,
		attribute,
		prevAttribute;

	for (i = 0; i < attributes.length; i++) {
		attribute = attributes[i];
		
		if (i > 0) {
			prevAttribute = attributes[i - 1];
		}

		if (attribute !== 'difference') {
			$row = this.notDifferenceColumn(category, name, attribute, buildingClass, level, $row);
		} 
		else {
			$row = this.differenceColumn(category, name, prevAttribute, buildingClass, level, $row);
		}
	}

	return $row;
}

/*
 * Helper function for UI.generateBuildingTable that builds a <td> element containing buttons and
 * returns a row appended with it.
 *
 * Type      Parameter   Description
 * String    category    The building category for the table
 * String    name        The name of the building
 * [String]  attributes  Additional table columns specific to the building type
 * Int       level       The building's current level
 * Int       instance    The index of the building's level in Planet.buildings[category][name]
 * $         $row        The previously constructed row for the <td> element to be appended to
 *
 * return $
 */
UI.prototype.addButtonColumnToRow = function(category, name, attributes, level, instance, $row) {
	var $buttonTd = $('<td></td>'),
		$upgradeButton,
		revert,
		$deleteButton;

	$buttonTd.attr({
		'data-category': category, 
		'data-name': name, 
		'data-level': level, 
		'data-instance': instance, 
		'data-attributes': attributes
	});

	if (level > 0) {

		// add upgrade button
		$upgradeButton = $('<button class="upgrade-button">Upgrade</button>');

		// if (planet.canUpgradeBuilding(category, name, level)) {
		// 	$upgradeButton.css('color','green');
		// }
		// else {
		// 	$upgradeButton.css('color','red');
		// }

		$buttonTd.append($upgradeButton);
	}
	// Big string of conditionals to allow both buildings with and without existing instances be have the chance of a buy button
	// The last part of the conditional checks for all other building types
	if (category === 'mine' || 
		(category === 'power' && name !== 'planetary_power_generator') || 
		category === 'storage' || 
		planet.buildings[category][name].length === 0) { 

		// add buy button
		$buyButton = $('<button class="buy-button">Buy</button>');

		// if (planet.canBuyBuilding(category, name)) {
		// 	$buyButton.css('color','green');
		// }
		// else {
		// 	$buyButton.css('color','red');
		// }

		$buttonTd.append($buyButton);
	}
	// extra conditions to save users from themselves (planet.deleteBuilding has built-in protections as well)
	revert = ((category === 'mine' || category === 'storage') && 
					planet.buildings[category][name].length === 1 && 
					level === 1) || 
					(name === 'planetary_power_generator' && level === 1);

	if (!revert && level > 0) {
		// add delete button
		$deleteButton = $('<button class="delete-button">Delete</button>');

		$buttonTd.append($deleteButton);
	}

	$row.append($buttonTd);

	return $row;
}

/*
 * Helper function for UI.generateBuildingTable that builds and returns a row of data
 *
 * Type      Parameter   Description
 * String    category    The building category for the table
 * String    name        The name of the building
 * [String]  attributes  Additional table columns specific to the building type
 * Int       level       The building's current level
 * Int       instance    The index of the building's level in Planet.buildings[category][name]
 *
 * return $
 */
UI.prototype.generateBuildingRow = function(category, name, attributes, level, instance) {
	var buildingClass = planet.pickBuildingClass(category), 
		powerCost, 
		resourceCost,
		nextLevel,
		$row;

	nextLevel = level + 1;
	// determine costs
	powerCost = buildingClass.power(name, nextLevel);

	resourceCost = buildingClass.cost(name, nextLevel);

	if (nextLevel <= 21) {
		$row = $('<tr>\
			<td>'+name.capitalize()+'</td>\
			<td>'+level+'</td>\
			<td>'+Math.floor(resourceCost.crystal)+'</td>\
			<td>'+Math.floor(resourceCost.steel)+'</td>\
			<td>'+Math.floor(resourceCost.titanium)+'</td>\
			<td>'+Math.floor(resourceCost.tritium)+'</td>\
			<td>'+Math.floor(powerCost)+'</td>\
		</tr>');
	} 
	else {
		$row = $('<tr>\
			<td>'+name.capitalize()+'</td>\
			<td>'+level+'</td>\
			<td>--</td>\
			<td>--</td>\
			<td>--</td>\
			<td>--</td>\
			<td>'+Math.floor(powerCost)+'</td>\
		</tr>');
	}

	$row = this.addAttributeColumnsToRow(category, name, attributes, buildingClass, level, $row)

	$row = this.addButtonColumnToRow(category, name, attributes, level, instance, $row);
	return $row;
}

/*
 * Generates the table that contains resource information
 * 
 * Return void;
 */
UI.prototype.generateResourceTable = function() {
	// delete existing one
	// $('#active-wrapper').empty();
	// console.log($('#active-wrapper'))
	$('.table[data-category="resources"]').remove();

	var $table,
		$tbody,
		$row,
		r;

	$table = $('<table class="table" data-category="resources">\
						<thead>\
							<tr>\
								<th>Resource</th>\
								<th>Count</th>\
								<th>Storage</th>\
					            <th>Rate / min</th>\
					            <th>Multiplier</th>\
							</tr>\
						</thead>\
						<tbody>\
						</tbody>\
					</table>');

	$tbody = $table.find('tbody');

	for (r in planet.resources) {
		if (!planet.resources.hasOwnProperty(r)) continue;
		// append resource information to row
		$row = $('<tr data-resource="'+r+'">\
					<td>'+r.capitalize()+'</td>\
					<td class="count">'+Math.floor(planet.resources[r])+'</td>\
					<td class="storage">'+Math.floor(planet.storage[r])+'</td>\
					<td class="rate">'+Math.floor(planet.mine_rates[r])+'</td>\
					<td class="multiplier">'+planet.mine_rate_multipliers[r]+'</td>\
				</tr>');

		$tbody.append($row);
	}

	// Add a special row for power
	$row = $('<tr data-resource="power">\
				<td>Power</td>\
				<td class="count">'+planet.power+'</td>\
				<td class="storage">--</td>\
				<td class="rate">--</td>\
				<td class="multiplier">--</td>\
			</tr>');

	$tbody.append($row);

	$('#resources-wrapper').append($table); // I should stick this in a .row
}

// I'm being lazy and just redrawing tables on click
// Rationale: it's less work that figuring out how to insert rows upon buy
UI.prototype.updateBuildingInformation = function() {
	// update all of that
}

/*
 * Repopulates resource amounts, storage and multipliers without requiring a full redraw of the table
 *
 * Type    Parameter  Description
 * String  resource   The particular resource that will be updated
 * String  attribute  A class that indicates which cell will change
 * 
 * Return void;
 */
UI.prototype.updateResourceRow = function(resource, attribute) {
	var $td = $('tr[data-resource="'+resource+'"] td.'+attribute),
		value;

	if (resource === 'power') {
		value = planet.power;
	}
	else {
		switch(attribute) {
			case 'count':
				value = planet.resources[resource];
				break;
			case 'storage':
				value = planet.storage[resource];
				break;
			case 'rate':
				value = planet.mine_rates[resource];
				// console.log(value);
				break;
			case 'multiplier':
				value = planet.mine_rate_multipliers[resource];
				break;
			default: 
				break;
		}
	}

	// set cell value
	$td.text(Math.floor(value));
}

/*
 * Changes upgrade and buy button styles based on resource / power availability
 * 
 * Return void;
 */
UI.prototype.updateButtonStyle = function() {
	var $buyButtons = $('.buy-button'),
		i,
		bb,
		data,
		j,
		ub,
		$upgradeButtons = $('.upgrade-button');

	for (i = 0; i < $buyButtons.length; i++) {
		bb = $($buyButtons[i]);

		data = bb.parent().data();

		if (planet.canBuyBuilding(data.category, data.name)) {
			bb.css('color','green');
		}
		else {
			bb.css('color','red');
		}
	}

	for (j = 0; j < $upgradeButtons.length; j++) {
		ub = $($upgradeButtons[j]);

		data = ub.parent().data();

		if (planet.canUpgradeBuilding(data.category, data.name, data.level)) {
			ub.css('color','green');
		}
		else {
			ub.css('color','red');
		}
	}
}

/*
 * Houses UI changes that need to be made every interval
 * 
 * Return void;
 */
UI.prototype.visualLoop = function() {
	var i;
	// update all resource counts
	for (i = 0; i < planet.resource_types.length; i++) {
		this.updateResourceRow(planet.resource_types[i], 'count');
	}
	this.updateResourceRow('power', 'count');
	this.updateButtonStyle();
}