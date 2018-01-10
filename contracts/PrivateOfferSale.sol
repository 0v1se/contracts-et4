pragma solidity ^0.4.0;

import "./Eticket4Sale.sol";

contract PrivateOfferSale is Eticket4Sale {
	function PrivateOfferSale(address _mintableToken, address _btcToken, uint256 _start, uint256 _end, uint256 _cap) Eticket4Sale(_mintableToken, _btcToken, _start, _end, _cap) {

	}

	function getBonus(uint256 sold) constant public returns (uint256) {
		return sold.mul(40).div(100);
	}
}
