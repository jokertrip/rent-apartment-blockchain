pragma solidity 0.8.4;

contract ApartmentFactory {
    address[] public deployedApartments;

    function createApartment(string[] images, string countryArg, string cityArg, string descriptionArg, uint priceForDayArg) public {
        address newApartment = new Apartment(msg.sender, images, countryArg, cityArg, descriptionArg, priceForDayArg);
        deployedApartments.push(newApartment);
    }

    function getDeployedApartments() public view returns (address[]) {
        return deployedApartments;
    }
}

contract Apartment {
    address public landlord;
    string[] public apartmentImages;
    string public country;
    string public city;
    string public description;
    uint public priceForDay;
    mapping(string => address) public dateAvailableForRent;
    mapping(address => string) public tenantFirstDateRent;
    mapping(address => uint) public tenantBalance;

    function Apartment(address owner, string[] images, string countryArg, string cityArg, string descriptionArg, uint priceForDayArg) public {
        landlord = owner;
        apartmentImages = images;
        country = countryArg;
        city = cityArg;
        description = descriptionArg;
        priceForDay = priceForDayArg;
    }

    function rent(string[] dates) public payable {
        require(msg.value == (dates.length * priceForDay));

        for (uint i=0; i < dates.length; i++) {
            dateAvailableForRent[dates[i]] = msg.sender;
        }
    }

    function getSummary() public view returns (
        string[], string, string, string, uint
    ) {
        return (
            apartmentImages,
            country,
            city,
            description,
            priceForDay
        );
    }

    // if tenant lived for whole period and everything is ok, money goes to landlord
    function payForRent() {
        landlord.transfer(tenantBalance[msg.sender]);
    }

    // if tenant goes to apartment and see that somethings's wrong, he cancel reservation. Only possible on first day of rent
    function cancelRent(string date) {
        require(tenantFirstDateRent[msg.sender] == date);

        msg.sender.transfer(tenantBalance[msg.sender]);
    }
}
