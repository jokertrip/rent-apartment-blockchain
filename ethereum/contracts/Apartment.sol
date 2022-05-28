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
    mapping(string => address) public dateAvailableForRent;
    mapping(address => string) public tenantFirstDateRent;
    mapping(address => uint) public tenantBalance;

    constructor(address owner, string[] memory images, string memory countryArg, string memory cityArg, string memory descriptionArg, uint priceForDayArg){
        landlord = owner;
        apartmentImages = images;
        country = countryArg;
        city = cityArg;
        description = descriptionArg;
        priceForDay = priceForDayArg;
    }

    function rent(string[] memory dates) public payable {
        require(msg.value == (dates.length * priceForDay));

        for (uint i=0; i < dates.length; i++) {
            dateAvailableForRent[dates[i]] = msg.sender;
        }
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
        payable(landlord).transfer(tenantBalance[msg.sender]);
    }

    // if tenant goes to apartment and see that somethings's wrong, he cancel reservation. Only possible on first day of rent
    function cancelRent(string memory date) public {
        require(keccak256(abi.encodePacked(tenantFirstDateRent[msg.sender])) == keccak256(abi.encodePacked(date)));

        payable(msg.sender).transfer(tenantBalance[msg.sender]);
    }
}
