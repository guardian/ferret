type BasicRealEstate = {
    id?: String;
    address: String;
}

type BasicPerson = {
    name: String;
    nationality: String;
    birthdate: String;
    properties: BasicRealEstate[];
}

type BasicCompany = {
    id: String;
    name: String;
}

type BasicLink = {
    from: String;
    to: String;
    type: String;
}

type BasicBundle = {
    description: String;
    companies: BasicCompany[];
    people: BasicPerson[];
    realEstate: BasicRealEstate[];
    links: BasicLink[];
}

