/*
 * In the interest of not overcomplicating this endeavor from the outset, I'm going to start small and gradually increase complexity
 */

var resources = {
	crystal: 1000,
	steel: 1000,
	titanium: 500,
	tritium: 1000
}

var resourceTypes = ["crystal", "steel", "titanium", "tritium"];

/* these are per minute */
var resourceRates = {
	crystal: undefined,
	steel: undefined,
	titanium: undefined,
	tritium: undefined
}

 

function init() {
	updateResources();
}

init();

window.setInterval(gameLoop, 100);

function gameLoop() {
	updateResources();

}

function updateResources() {
	var r;
	for (var i = 0; i < resourceTypes.length; i++) {
		r = resourceTypes[i];
		// update resourceRates
		resourceRates[r] = mineData.production[mineData.mineLevels[r]-1];

		// update resources
		resources[r] += (resourceRates[r] / 600.0); // resources are per minute and loop runs every 1/10 second
		updateResourceUI(r);
	}
}

function updateResourceUI(resource) {
	$('.'+resource+'-count').html(Math.floor(resources[resource]));
	$('.'+resource+'-rate').html(Math.floor(resourceRates[resource]));
	$('.'+resource+'-level').html(mineData.mineLevels[resource]);
}

// currently this just handles mine upgrading. I'll need to abstract this later on
$('button').click(function() {
	var resource = $(this).attr('id').split('-')[0];
	var nextLevel = mineData.mineLevels[resource]; // not +1 because we need to correct for index starting at 0
	if (nextLevel <= 21) {
		if (canUpgradeMine(resource, nextLevel)) {
			upgradeMine(resource, nextLevel);
			// nextLevel++;
			// showPrices(resource, nextLevel);
		}
	}
});
// }).mouseenter(function() {
// 	var resource = $(this).attr('id').split('-')[0];
// 	var nextLevel = mineData.mineLevels[resource];
// 	if (nextLevel <= 21) {
// 		showPrices(resource, nextLevel);
// 	}
// }).mouseleave(function() {
// 	$('.count-decrease').html('');
// 	$('.rate-increase').html('');
// });

// this is mining-specific
function showPrices(resource, nextLevel) {
	var r;
	for (var i = 0; i < resourceTypes.length; i++) {
		r = resourceTypes[i];
		// show price and affordability
		$('.'+r+'-count-decrease').html('-'+mineCosts[resource][r][nextLevel]);
		console.log(mineCosts[resource][r][nextLevel])
		if (resources[r] < mineCosts[resource][r][nextLevel]) $('.'+r+'-count-decrease').css('color','red');
		else $('.'+r+'-count-decrease').css('color','green');
	}
	// show improvement
	var difference = mineData.production[nextLevel] - mineData.production[nextLevel-1];
	$('.'+resource+'-rate-increase').html('+'+difference);
}

function canUpgradeMine(resource, nextLevel) {
	var r;
	for (var i = 0; i < resourceTypes.length; i++) {
		r = resourceTypes[i];
		if (resources[r] < mineCosts[resource][r][nextLevel]) return false;
	}
	return true;
}

function upgradeMine(resource, nextLevel) {
	mineData.mineLevels[resource]++;
	var r;
	for (var i = 0; i < resourceTypes.length; i++) {
		r = resourceTypes[i];
		resources[r] -= mineCosts[resource][r][nextLevel];
	}
}


/*
 * To Do
 *  - Fix formatting problems due to price indicators
 *
 */