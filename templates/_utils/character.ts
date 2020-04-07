export function calculateModifier(value: number): number {
	let modifier = 0;
	if (value === 1) {
		modifier = -5;
	} else if (value === 2 || value === 3) {
		modifier = -4;
	} else if (value === 4 || value === 5) {
		modifier = -3;
	} else if (value === 6 || value === 7) {
		modifier = -2;
	} else if (value === 8 || value === 9) {
		modifier = -1;
	} else if (value === 10 || value === 11) {
		modifier = 0;
	} else if (value === 12 || value === 13) {
		modifier = 1;
	} else if (value === 14 || value === 15) {
		modifier = 2;
	} else if (value === 16 || value === 17) {
		modifier = 3;
	} else if (value === 18 || value === 19) {
		modifier = 4;
	} else if (value === 20 || value === 21) {
		modifier = 5;
	} else if (value === 22 || value === 23) {
		modifier = 6;
	} else if (value === 24 || value === 25) {
		modifier = 7;
	} else if (value === 26 || value === 27) {
		modifier = 8;
	} else if (value === 28 || value === 28) {
		modifier = 9;
	} else if (value === 29 || value === 30) {
		modifier = 10;
	}
	return modifier;
}
