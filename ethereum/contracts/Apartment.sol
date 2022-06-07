// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract ApartmentFactory {
    address[] public deployedApartments;

    function createApartment(string[] memory images, string memory countryArg, string memory cityArg, string memory descriptionArg, uint priceForDayArg) public {
        address newApartment = address(new Apartment(msg.sender, images, countryArg, cityArg, descriptionArg, priceForDayArg));
        deployedApartments.push(newApartment);
    }

    function getDeployedApartments() public view returns (address[] memory) {
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
    mapping(uint => address) public dateAvailableForRent;
    mapping(address => uint) public tenantFirstDateRent;
    mapping(address => uint) public tenantBalance;

    constructor(address owner, string[] memory images, string memory countryArg, string memory cityArg, string memory descriptionArg, uint priceForDayArg){
        landlord = owner;
        apartmentImages = images;
        country = countryArg;
        city = cityArg;
        description = descriptionArg;
        priceForDay = priceForDayArg;
    }

    function rent(uint[] memory dates) public payable {
        require(msg.value == (dates.length * priceForDay));

        for (uint i=0; i < dates.length; i++) {
            dateAvailableForRent[dates[i]] = msg.sender;
        }

        tenantFirstDateRent[msg.sender] = dates[0];
        tenantBalance[msg.sender] = dates.length * priceForDay;
    }

    function getSummary() public view returns (
        string[] memory, string memory, string memory, string memory, uint
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
    function payForRent() public {
        (bool success, ) = landlord.call{value: tenantBalance[msg.sender]}('');
        require(success, "Call failed");
        tenantBalance[msg.sender] = 0;
    }

    // if tenant goes to apartment and see that somethings's wrong, he cancel reservation. Only possible until the first day of rent
    function cancelRent(uint date) public {
        require(tenantFirstDateRent[msg.sender] >= date);

        (bool success, ) = msg.sender.call{value: tenantBalance[msg.sender]}('');
        require(success, "Call failed");
        tenantBalance[msg.sender] = 0;
    }
}
