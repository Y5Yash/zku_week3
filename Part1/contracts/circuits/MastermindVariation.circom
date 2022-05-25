pragma circom 2.0.0;

// [assignment] implement a variation of mastermind from https://en.wikipedia.org/wiki/Mastermind_(board_game)#Variation as a circuit

// This mastermind variation is named as bagels on wikipedia. It has 10 colours and 3 holes.
// original intent was to make Royal Mastermind but how hit and blow work wasn't very clear (do we indicate if only the colour hit/blowed? etc.)
// Assuming that any two holes can't have the same colour.

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template MastermindVariation() {

	signal input pubGuessA;
	signal input pubGuessB;
	signal input pubGuessC;
	signal input pubNumHit;
	signal input pubNumBlow;
	signal input pubSolnHash;

	signal input privSolnA;
	signal input privSolnB;
	signal input privSolnC;
	signal input privSalt;

	signal output solnHashOut;

	component lessThan[6];
	component equalGuess[3];
	component equalSoln[3];

	var guess[3] = [pubGuessA, pubGuessB, pubGuessC]; // putting signals in array to loop over
	var soln[3] = [privSolnA, privSolnB, privSolnC]; // same as above

	var id = 0;
	for (var i = 0; i<3; i++) // constraining the guess and solution space to 10 colours.
	{
		lessThan[i] = LessThan(4);
		lessThan[i].in[0] <== guess[i];
		lessThan[i].in[1] <== 10;
		lessThan[i].out === 1;
		lessThan[i+3] = LessThan(4);
		lessThan[i+3].in[0] <== soln[i];
		lessThan[i+3].in[1] <== 10;
		lessThan[i+3].out === 1;
		for (var j = i+1; j < 3; j++) // constraining that no 2 holes should have the same colour.
		{
			equalGuess[id] = IsEqual();
			equalGuess[id].in[0] <== guess[i];
			equalGuess[id].in[1] <== guess[j];
			equalGuess[id].out === 0;
			equalSoln[id] = IsEqual();
			equalSoln[id].in[0] <== soln[i];
			equalSoln[id].in[1] <== soln[j];
			equalSoln[id].out === 0;
			id++;
		}
	}

	// count the number of hits and blows.
	var hit = 0;
	var blow = 0;
	component equalHB[9];

	for (var i = 0; i < 3; i++)
	{
		for (var j = 0; j < 3; j++)
		{
			equalHB[3*i + j] = IsEqual();
			equalHB[3*i + j].in[0] <== soln[i];
			equalHB[3*i + j].in[1] <== guess[j];
			if (i==j) hit += equalHB[3*i + j].out;
			else blow += equalHB[3*i + j].out;
		}
	}

    // Create a constraint around the number of hit
    component equalHit = IsEqual();
    equalHit.in[0] <== pubNumHit;
    equalHit.in[1] <== hit;
    equalHit.out === 1;
    
    // Create a constraint around the number of blow
    component equalBlow = IsEqual();
    equalBlow.in[0] <== pubNumBlow;
    equalBlow.in[1] <== blow;
    equalBlow.out === 1;

    // Verify that the hash of the private solution matches pubSolnHash
    component poseidon = Poseidon(4);
    poseidon.inputs[0] <== privSalt;
    poseidon.inputs[1] <== privSolnA;
    poseidon.inputs[2] <== privSolnB;
    poseidon.inputs[3] <== privSolnC;

    solnHashOut <== poseidon.out;
    pubSolnHash === solnHashOut;
}

component main {public [pubGuessA, pubGuessB, pubGuessC, pubNumHit, pubNumBlow, pubSolnHash]} = MastermindVariation();