// Eksempeldata for opgaver, som naboer kan gå sammen om.
export const opportunities = [
    {
        id: '1',
        title: 'Vinduespudsning på villavejen',
        location: 'Solvænget',
        deadline: 'Frist om 5 dage',
        status: 'Åben for bud',
        participatingHouses: ['Solvænget 4', 'Solvænget 8', 'Solvænget 12', 'Solvænget 18'],
    },
    {
        id: '2',
        title: 'Maling af facader',
        location: 'Birkevej',
        deadline: 'Frist om 9 dage',
        status: 'Åben for bud',
        participatingHouses: ['Birkevej 3', 'Birkevej 11', 'Birkevej 20'],
    },
    {
        id: '3',
        title: 'Hækklipning før sommer',
        location: 'Engtoften',
        deadline: 'Frist om 12 dage',
        status: 'Afventer flere naboer',
        participatingHouses: ['Engtoften 2', 'Engtoften 7', 'Engtoften 15', 'Engtoften 21', 'Engtoften 26'],
    },
];
