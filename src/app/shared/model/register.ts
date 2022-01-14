// Lead //

export interface Register {
    Company: string,
    Street: string,
    PostalCode: string,
    City: string,
    Salutation: string,
    FirstName: string,
    MiddleName: string,
    LastName: string,
    Email: string,
    MobilePhone: string,  // Optional input
    Phone: string,        // Optional input
    Country: string,      // TS => Nederland
    RecordTypeId: string, // TS => 0122o0000007iZ9AAI
    Status: string        // TS => Nieuw
}