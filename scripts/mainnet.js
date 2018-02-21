Eticket4Token.new();
var token = Eticket4Token.at("0x80238d9451f86dcf12bff21af9e8deadcf915bff");

TokenHolder.new("0x80238d9451f86dcf12bff21af9e8deadcf915bff");


var token = Eticket4Token.at("0x80238d9451f86dcf12bff21af9e8deadcf915bff");
token.mint("0x831244b8cce737b9844fcb13ec04e2bccc5a6e4a", "7000000000000000000000");//bounty
token.mint("0x060dd5c6655de52ec8016cd39aae85a0ad8ae695", "1200000000000000000000000");//advisers
token.mint("0xf3c0265c247ca4c1004ba1df54ecd67fe31ff4f4", "3000000000000000000000000");//mining
token.mint("0x47bdedbb82bb8aebeb5f0e9b93cca1e3fc453740", "2100000000000000000000000");//Reserve Fund
token.mint("0xa54a7d890c5f7621c75de8a62011ebaebc1b2106", "6000000000000000000000000");//Team


PreSale.new("0x80238d9451f86dcf12bff21af9e8deadcf915bff", "0xf876c67ce21a03a848dbae562d583296ee5a8449", 1517270400, 1519257600, "800000000000000000000000");

token.transferOwnership("0x7acbc0b5c51027dc659a19f257bb3e462309b626");


OwnableImpl.at("0xb88a04948549be0193f7dafd4afa10a58dd1cfff").transferOwnership("0x949891b107719290fFf1396911fC43Ce527ed31a");
OwnableImpl.at("0x060dd5c6655de52ec8016cd39aae85a0ad8ae695").transferOwnership("0x949891b107719290fFf1396911fC43Ce527ed31a");
OwnableImpl.at("0xf3c0265c247ca4c1004ba1df54ecd67fe31ff4f4").transferOwnership("0x949891b107719290fFf1396911fC43Ce527ed31a");
OwnableImpl.at("0x47bdedbb82bb8aebeb5f0e9b93cca1e3fc453740").transferOwnership("0x949891b107719290fFf1396911fC43Ce527ed31a");
OwnableImpl.at("0xa54a7d890c5f7621c75de8a62011ebaebc1b2106").transferOwnership("0x949891b107719290fFf1396911fC43Ce527ed31a");
OwnableImpl.at("0x7acbc0b5c51027dc659a19f257bb3e462309b626").transferOwnership("0x949891b107719290fFf1396911fC43Ce527ed31a");

