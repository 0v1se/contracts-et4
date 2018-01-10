pragma solidity ^0.4.18;


import "@daonomic/util/contracts/Pausable.sol";
import "@daonomic/util/contracts/OwnableImpl.sol";
import "@daonomic/tokens/contracts/MintableTokenImpl.sol";


contract Eticket4Token is Pausable, OwnableImpl, MintableTokenImpl {
    string public constant name = "Eticket4";
    string public constant symbol = "ET4";
    uint8 public constant decimals = 18;

    function transfer(address _to, uint256 _value) public whenNotPaused returns (bool) {
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public whenNotPaused returns (bool) {
        return super.transferFrom(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public whenNotPaused returns (bool) {
        return super.approve(_spender, _value);
    }

    function increaseApproval(address _spender, uint _addedValue) public whenNotPaused returns (bool success) {
        return super.increaseApproval(_spender, _addedValue);
    }

    function decreaseApproval(address _spender, uint _subtractedValue) public whenNotPaused returns (bool success) {
        return super.decreaseApproval(_spender, _subtractedValue);
    }
}
