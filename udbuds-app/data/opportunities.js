// Eksempeldata for opgaver, som naboer kan gå sammen om.
export const opportunities = [
    {
        id: '1',
        title: 'Vinduespudsning på villavejen',
        location: 'Solvænget',
        deadline: 'Frist om 5 dage',
        status: 'Åben for bud',
        expectedCost: 2400,
        isUserParticipating: true,
        offers: [
            {
                company: 'LokalRude ApS',
                originalPrice: 2800,
                discountedPrice: 2400,
                description: 'Indeholder pudsning af ekstra høje vinduer samt indvendige og udvendige vinduer.',
            },
            {
                company: 'KlarRude Service',
                originalPrice: 3100,
                discountedPrice: 2600,
                description: 'Indeholder indvendig og udvendig pudsning af alle standardvinduer.',
            },
        ],
        participatingNeighbors: ['Nabo 1', 'Nabo 2', 'Nabo 3', 'Nabo 4'],
    },
    {
        id: '2',
        title: 'Maling af facader',
        location: 'Birkevej',
        deadline: 'Frist om 9 dage',
        status: 'Åben for bud',
        expectedCost: 6800,
        isUserParticipating: false,
        participatingNeighbors: ['Nabo 1', 'Nabo 2', 'Nabo 3'],
    },
    {
        id: '3',
        title: 'Hækklipning før sommer',
        location: 'Engtoften',
        deadline: 'Frist om 12 dage',
        status: 'Afventer flere naboer',
        expectedCost: 1800,
        isUserParticipating: false,
        participatingNeighbors: ['Nabo 1', 'Nabo 2', 'Nabo 3', 'Nabo 4', 'Nabo 5'],
    },
];
