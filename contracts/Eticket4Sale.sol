pragma solidity ^0.4.18;

import "@daonomic/util/contracts/Pausable.sol";
import "@daonomic/util/contracts/OwnableImpl.sol";
import "@daonomic/sale/contracts/MintingSale.sol";
import "@daonomic/sale/contracts/CappedSale.sol";
import "@daonomic/sale/contracts/PeriodSale.sol";

contract Eticket4Sale is MintingSale, PeriodSale, OwnableImpl, CappedSale {
    address public btcToken;

    uint256 public btcEthRate = 10 * 10**10;
    uint256 public constant ethEt4Rate = 1000 * 10**18;

    function Eticket4Sale(
        address _mintableToken,
        address _btcToken,
        uint256 _start,
        uint256 _end,
        uint256 _cap)
    MintingSale(_mintableToken)
    PeriodSale(_start, _end)
    CappedSale(_cap) {
        btcToken = _btcToken;
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

    event BtcEthRateChange(uint256 btcEthRate);

    function setBtcEthRate(uint256 _btcEthRate) onlyOwner public {
        btcEthRate = _btcEthRate;
        BtcEthRateChange(_btcEthRate);
    }

    function withdrawBtc(bytes _to, uint256 _value) onlyOwner public {
        burnWithData(btcToken, _value, _to);
    }

    function transferTokenOwnership(address newOwner) onlyOwner public {
        OwnableImpl(token).transferOwnership(newOwner);
    }

    function pauseToken() onlyOwner public {
        Pausable(token).pause();
    }

    function unpauseToken() onlyOwner public {
        Pausable(token).unpause();
    }

    function transferWithBonus(address beneficiary, uint256 amount) onlyOwner public {
        uint256 bonus = getBonus(amount);
        doPurchase(beneficiary, amount, bonus);
        Purchase(beneficiary, address(1), 0, amount, bonus);
        onPurchase(beneficiary, address(1), 0, amount, bonus);
    }

    function transfer(address beneficiary, uint256 amount) onlyOwner public {
        doPurchase(beneficiary, amount, 0);
        Purchase(beneficiary, address(1), 0, amount, 0);
        onPurchase(beneficiary, address(1), 0, amount, 0);
    }
}
