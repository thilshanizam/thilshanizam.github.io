
export const events = [
    {
        id: "community_cleanup",
        title: "A Neglected Public Park",
        description:
            "Residents are complaining about a neglected park. " +
            "A community organization needs volunteers.",

        choices: [
            {
                text: "Organize a cleanup campaign",
                effects: {
                    money: -10,
                    reputation: 8,
                    influence: 3
                },
                outcome:
                    "Your leadership earns respect in the community."
            },
            {
                text: "Donate money to the campaign",
                effects: {
                    money: -20,
                    reputation: 4,
                    influence: 1
                },
                outcome:
                    "Residents appreciate your financial support."
            },
            {
                text: "Focus on your regular job",
                effects: {
                    money: 15,
                    reputation: 0,
                    influence: 0
                },
                outcome:
                    "You earn extra income but miss a public opportunity."
            }
        ]
    },

    {
        id: "political_meeting",
        title: "An Invitation to a Political Meeting",
        description:
            "A local political group invites you to discuss " +
            "the future of your town.",

        choices: [
            {
                text: "Attend and deliver a speech",
                effects: {
                    money: -5,
                    reputation: 6,
                    influence: 8
                },
                outcome:
                    "Your speech attracts attention from political leaders."
            },
            {
                text: "Attend and build connections",
                effects: {
                    money: -5,
                    reputation: 2,
                    influence: 5
                },
                outcome:
                    "You meet people who may help your political career."
            },
            {
                text: "Decline and continue working",
                effects: {
                    money: 15,
                    reputation: 0,
                    influence: 0
                },
                outcome:
                    "You improve your finances but miss the meeting."
            }
        ]
    },

    {
        id: "youth_leadership",
        title: "A Youth Leadership Opportunity",
        description:
            "A youth association is looking for someone " +
            "to coordinate its community activities.",

        choices: [
            {
                text: "Apply for the leadership position",
                effects: {
                    money: -10,
                    reputation: 7,
                    influence: 10
                },
                outcome:
                    "You gain valuable leadership experience."
            },
            {
                text: "Support another candidate",
                effects: {
                    money: 0,
                    reputation: 3,
                    influence: 4
                },
                outcome:
                    "You develop a relationship with a future ally."
            },
            {
                text: "Concentrate on earning money",
                effects: {
                    money: 25,
                    reputation: 0,
                    influence: 0
                },
                outcome:
                    "You strengthen your financial position."
            }
        ]
    }
];
