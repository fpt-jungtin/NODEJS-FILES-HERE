const numberFormatter = (value) => {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const moneyFormatter = (value) => {
	return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

module.exports = {
	numberFormatter: numberFormatter,
	moneyFormatter: moneyFormatter,
};
