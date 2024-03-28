const blankBallotJSON = `{
    "active_ggos": [
        ".",
        "GGOs/states/Massachusetts",
        "GGOs/states/Massachusetts/GGOs/counties/Middlesex",
        "GGOs/states/Massachusetts/GGOs/towns/Concord",
        "GGOs/states/Massachusetts/GGOs/towns/Concord/GGOs/precincts/1"
    ],
    "ballot_filename": "000,001,002,003,004,ballot.json",
    "ballot_node": "GGOs/states/Massachusetts/GGOs/towns/Concord",
    "ballot_subdir": "GGOs/states/Massachusetts/GGOs/towns/Concord",
    "contests": [
        {
            "choices": [
                {
                    "name": "Circle Party Ticket",
                    "ticket_names": [
                        "Rey Skywalker",
                        "Obi-Wan Kenobi"
                    ]
                },
                {
                    "name": "Square Party Ticket",
                    "ticket_names": [
                        "Atticus Finch",
                        "Hermione Granger"
                    ]
                },
                {
                    "name": "Triangle Party Ticket",
                    "ticket_names": [
                        "Evelyn Quan Wang",
                        "Waymond Wang"
                    ]
                }
            ],
            "contest_name": "U.S. President",
            "contest_type": "ticket",
            "election_upstream_remote": "https://github.com/TrustTheVote-Project/VTP-mock-election.US.16",
            "ggo": "GGOs/states/Massachusetts",
            "max_selections": 1,
            "tally": "plurality",
            "ticket_titles": [
                "President",
                "Vice President"
            ],
            "uid": "0000",
            "win_by": "0.5"
        },
        {
            "choices": [
                {
                    "name": "Anthony Alpha",
                    "party": "Circle Party"
                },
                {
                    "name": "Betty Beta",
                    "party": "Dyad Party"
                },
                {
                    "name": "Gloria Gamma",
                    "party": "Triangle Party"
                },
                {
                    "name": "David Delta",
                    "party": "Square Party"
                },
                {
                    "name": "Emily Echo",
                    "party": "Pentagon Party"
                },
                {
                    "name": "Francis Foxtrot",
                    "party": "Hexagon Party"
                }
            ],
            "contest_name": "U.S. Senate",
            "contest_type": "candidate",
            "election_upstream_remote": "https://github.com/TrustTheVote-Project/VTP-mock-election.US.16",
            "ggo": "GGOs/states/Massachusetts",
            "max_selections": 6,
            "tally": "rcv",
            "uid": "0001",
            "win_by": "0.5"
        },
        {
            "choices": [
                {
                    "name": "Jean-Luc Picard"
                },
                {
                    "name": "Katniss Everdeen"
                },
                {
                    "name": "James T. Kirk"
                }
            ],
            "contest_name": "County Clerk",
            "contest_type": "candidate",
            "election_upstream_remote": "https://github.com/TrustTheVote-Project/VTP-mock-election.US.16",
            "ggo": "GGOs/states/Massachusetts/GGOs/counties/Middlesex",
            "max_selections": 1,
            "tally": "plurality",
            "uid": "0002",
            "win_by": "0.5"
        },
        {
            "choices": [
                {
                    "name": "Rebecca Welton"
                },
                {
                    "name": "Keeley Jones"
                }
            ],
            "contest_name": "Athletic Director",
            "contest_type": "candidate",
            "election_upstream_remote": "https://github.com/TrustTheVote-Project/VTP-mock-election.US.16",
            "ggo": "GGOs/states/Massachusetts/GGOs/towns/Concord/GGOs/precincts/1",
            "max_selections": 1,
            "tally": "plurality",
            "uid": "0004",
            "win_by": "0.5"
        },
        {
            "choices": [
                {
                    "name": "yes"
                },
                {
                    "name": "no"
                }
            ],
            "contest_name": "Question 1 - should the starting time of the annual town meeting be moved to 6:30 PM?",
            "contest_type": "question",
            "description": "Should the Town of Concord start the annual Town Meeting at 6:30 PM instead of 7:00 PM?",
            "election_upstream_remote": "https://github.com/TrustTheVote-Project/VTP-mock-election.US.16",
            "ggo": "GGOs/states/Massachusetts/GGOs/towns/Concord",
            "max_selections": 1,
            "tally": "plurality",
            "uid": "0003",
            "win_by": "2/3"
        }
    ]
}`;
