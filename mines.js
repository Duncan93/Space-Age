
/* 
 * Production and energy consumption are the same, but prices are different
 * These follow a level-indexing from 1 - 21 (-1)
 * I forget what formula I used to calculate the various resource costs
 * For now I'm going to not have anything take time to complete
 */
var mineData = {
	crystalMine: {
		production: [10, 14, 20, 28, 38, 50, 64, 80, 98, 122, 152, 188, 230, 278, 334, 398, 470, 550, 638, 736, 900],
		energy: [5, 8, 12, 17, 23, 30, 38, 47, 57, 70, 86, 105, 127, 153, 183, 217, 255, 297, 343, 399, 500],
		cost: {
			crystal: [0, 20, 50, 125, 310, 403, 517, 666, 860, 1110, 1437, 1862, 2414, 3132, 4065, 5278, 6855, 8906, 11571, 15036, 19540],
			steel: [0, 20, 50, 125, 310, 403, 517, 666, 860, 1110, 1437, 1862, 2414, 3132, 4065, 5278, 6855, 8906, 11571, 15036, 19540],
			titanium: [0, 10, 35, 85, 210, 273, 348, 446, 573, 740, 955, 1234, 1598, 2071, 2686, 3486, 3486, 4525, 5877, 7633, 9917],
			tritium: [0, 10, 25, 55, 135, 169, 213, 270, 345, 442, 568, 732, 946, 1224, 1584, 2052, 2662, 3454, 4484, 5822, 7563]
		}
	},
	steelMine: {
		production: [10, 14, 20, 28, 38, 50, 64, 80, 98, 122, 152, 188, 230, 278, 334, 398, 470, 550, 638, 736, 900],
		energy: [5, 8, 12, 17, 23, 30, 38, 47, 57, 70, 86, 105, 127, 153, 183, 217, 255, 297, 343, 399, 500],
		cost: {
			crystal: [0, 20, 50, 125, 310, 403, 517, 666, 860, 1110, 1437, 1862, 2414, 3132, 4065, 5278, 6855, 8906, 11571, 15036, 19540],
			steel: [0, 20, 50, 125, 310, 403, 517, 666, 860, 1110, 1437, 1862, 2414, 3132, 4065, 5278, 6855, 8906, 11571, 15036, 19540],
			titanium: [0, 10, 35, 85, 210, 273, 348, 446, 573, 740, 955, 1234, 1598, 2071, 2686, 3486, 3486, 4525, 5877, 7633, 9917],
			tritium: [0, 10, 25, 55, 135, 169, 213, 270, 345, 442, 568, 732, 946, 1224, 1584, 2052, 2662, 3454, 4484, 5822, 7563]
		}
	},
	titaniumMine: {
		production: [10, 14, 20, 28, 38, 50, 64, 80, 98, 122, 152, 188, 230, 278, 334, 398, 470, 550, 638, 736, 900],
		energy: [5, 8, 12, 17, 23, 30, 38, 47, 57, 70, 86, 105, 127, 153, 183, 217, 255, 297, 343, 399, 500],
		cost: {
			crystal: [0, 20, 50, 125, 310, 403, 517, 666, 860, 1110, 1437, 1862, 2414, 3132, 4065, 5278, 6855, 8906, 11571, 15036, 19540],
			steel: [0, 10, 35, 85, 210, 273, 348, 446, 573, 740, 955, 1234, 1598, 2071, 2686, 3486, 3486, 4525, 5877, 7633, 9917],
			titanium: [0, 20, 50, 125, 310, 403, 517, 666, 860, 1110, 1437, 1862, 2414, 3132, 4065, 5278, 6855, 8906, 11571, 15036, 19540],
			tritium: [0, 10, 25, 55, 135, 169, 213, 270, 345, 442, 568, 732, 946, 1224, 1584, 2052, 2662, 3454, 4484, 5822, 7563]
		}
	},
	tritiumMine: {
		production: [10, 14, 20, 28, 38, 50, 64, 80, 98, 122, 152, 188, 230, 278, 334, 398, 470, 550, 638, 736, 900],
		energy: [5, 8, 12, 17, 23, 30, 38, 47, 57, 70, 86, 105, 127, 153, 183, 217, 255, 297, 343, 399, 500],
		cost: {
			crystal: [0, 10, 25, 55, 135, 169, 213, 270, 345, 442, 568, 732, 946, 1224, 1584, 2052, 2662, 3454, 4484, 5822, 7563],
			steel: [0, 10, 35, 85, 210, 273, 348, 446, 573, 740, 955, 1234, 1598, 2071, 2686, 3486, 3486, 4525, 5877, 7633, 9917],
			titanium: [0, 20, 50, 125, 310, 403, 517, 666, 860, 1110, 1437, 1862, 2414, 3132, 4065, 5278, 6855, 8906, 11571, 15036, 19540],
			tritium: [0, 20, 50, 125, 310, 403, 517, 666, 860, 1110, 1437, 1862, 2414, 3132, 4065, 5278, 6855, 8906, 11571, 15036, 19540]
		}
	}
}