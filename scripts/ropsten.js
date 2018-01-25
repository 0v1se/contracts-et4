var token = Eticket4Token.at("0x13f8c4cafd191cfe9a879058a027ee8bee459764");
token.transferOwnership("0x44a72aeb7dac73c4b72f89d6855de063949627f3");

PrivateOfferSale.new("0x13f8c4cafd191cfe9a879058a027ee8bee459764", "0x5cbef5849c3b4d86f6830784fd3f879a2d2e61c7", 1515581326, 1615581326, "3000000000000000000000000");
var sale = PrivateOfferSale.at("0x44a72aeb7dac73c4b72f89d6855de063949627f3");

