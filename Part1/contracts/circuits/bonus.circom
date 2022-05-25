// [bonus] implement an example game from part d
// Minesweeper implementation in circom. The grid is of size x * y and numbers 0-8 are used to indicate the no. of mines around the tile.
// 9 denotes a mine. 10 denotes unrevealed tile.
pragma circom 2.0.0;


include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/gates.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template Minesweeper(x,y)
{
	// Public inputs
	signal input pubQuery[x][y];
	signal input pubSolnHash;

	// Private inputs
	signal input privSolution[x][y];
	signal input privSalt;

	// Output
	signal output isCorrect;

	// Components required
	component equalToSol[x][y];
	component unrevealed[x][y];
	component or[x][y];
	component and;
	component poseidon;

	and = MultiAND(x*y);
	poseidon = Poseidon(x*y+1);

	for (var i = 0; i < x; i++)
	{
		for (var j = 0; j < y; j++)
		{
			equalToSol[i][j] = IsEqual();
			equalToSol[i][j].in[0] <== privSolution[i][j];
			equalToSol[i][j].in[1] <== pubQuery[i][j];
			
			unrevealed[i][j] = IsEqual();
			unrevealed[i][j].in[0] <== 10;
			unrevealed[i][j].in[1] <== pubQuery[i][j];

			or[i][j] = OR();
			or[i][j].a <== equalToSol[i][j].out;
			or[i][j].b <== unrevealed[i][j].out;

			and.in[i*y+j] <== or[i][j].out;
			poseidon.inputs[i*y+j] <== privSolution[i][j];
		}
	}
	poseidon.inputs[x*y] <== privSalt;

	poseidon.out === pubSolnHash;
	isCorrect <== and.out;
	isCorrect === 1;

}

component main {public [pubQuery, pubSolnHash]} = Minesweeper(3,3);