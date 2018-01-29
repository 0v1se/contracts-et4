pragma solidity ^0.4.0;

import "./Eticket4Sale.sol";

contract PreSale is Eticket4Sale {
	function PreSale(address _mintableToken, address _btcToken, uint256 _start, uint256 _end, uint256 _cap) Eticket4Sale(_mintableToken, _btcToken, _start, _end, _cap) {

	}

	function getBonus(uint256 sold) constant public returns (uint256) {
		uint256 diffDays = (now - start) / 86400;
		if (diffDays < 2) {
			return sold.mul(40).div(100);
		} else {
			return getTimeBonus(sold, diffDays) + getAmountBonus(sold);
		}
	}

	function getTimeBonus(uint256 sold, uint256 diffDays) internal returns (uint256) {
		uint256 interval = (diffDays - 2) / 5;
		if (interval == 0) {
			return sold.mul(15).div(100);
		} else if (interval == 1) {
			return sold.mul(12).div(100);
		} else if (interval == 2 || interval == 3) {
			return sold.mul(10).div(100);
		} else {
			return sold.mul(8).div(100);
		}
	}

	function getAmountBonus(uint256 sold) internal returns (uint256) {
		if (sold > 20000 * 10**18) {
			return sold.mul(30).div(100);
		} else if (sold > 15000 * 10**18) {
			return sold.mul(25).div(100);
		} else if (sold > 10000 * 10**18) {
			return sold.mul(20).div(100);
		} else if (sold > 5000 * 10**18) {
			return sold.mul(15).div(100);
		} else if (sold > 1000 * 10**18) {
			return sold.mul(10).div(100);
		} else {
			return 0;
		}
	}
}
