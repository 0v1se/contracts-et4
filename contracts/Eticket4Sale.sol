pragma solidity ^0.4.18;

import "@daonomic/util/contracts/OwnableImpl.sol";
import "@daonomic/sale/contracts/MintingSale.sol";
import "@daonomic/sale/contracts/CappedSale.sol";

contract Eticket4Sale is MintingSale, OwnableImpl, CappedSale {
    address public btcToken;

    uint256 public start;
    uint256 public end;

    uint256 public btcEthRate = 10 * 10**10;
    uint256 public constant ethEt4Rate = 1000 * 10**18;

    function Eticket4Sale(address _mintableToken, address _btcToken, uint256 _start, uint256 _end, uint256 _cap) MintingSale(_mintableToken) CappedSale(_cap) {
        btcToken = _btcToken;
        start = _start;
        end = _end;
        RateAdd(address(0));
        RateAdd(_btcToken);
    }

    function checkPurchaseValid(address buyer, uint256 sold, uint256 bonus) internal {
        super.checkPurchaseValid(buyer, sold, bonus);
        require(now > start && now < end);
    }

    function getRate(address _token) constant public returns (uint256) {
        if (_token == btcToken) {
            return btcEthRate * ethEt4Rate;
        } else if (_token == address(0)) {
            return ethEt4Rate;
        } else {
            return 0;
        }
    }

    function withdrawEth(address _to, uint256 _value) onlyOwner public {
        withdraw(address(0), _to, _value);
    }

    function withdrawBtc(bytes _to, uint256 _value) onlyOwner public {
        burnWithData(btcToken, _value, _to);
    }

    function transferTokenOwnership(address newOwner) onlyOwner public {
        OwnableImpl(token).transferOwnership(newOwner);
    }
}
