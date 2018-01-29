pragma solidity ^0.4.0;

import "@daonomic/util/contracts/OwnableImpl.sol";
import "./Eticket4Token.sol";

contract TokenHolder is OwnableImpl {
	Eticket4Token public token;

	function TokenHolder(address _token) {
		token = Eticket4Token(_token);
	}

	function transfer(address beneficiary, uint256 amount) onlyOwner public {
		token.transfer(beneficiary, amount);
	}

	function burn(uint256 amount) onlyOwner public {
		token.burn(amount);
	}
}
