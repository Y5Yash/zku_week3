//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected

const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;

// const F1Field = require("ffjavascript").F1Field;
// const Scalar = require("ffjavascript").Scalar;
// const p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
// const Fr = new F1Field(p);

const assert = chai.assert;

const buildPoseidon = require("circomlibjs").buildPoseidon;

describe("Testing MastermindVariation.circom", function ()
{
	let poseidon;
	this.timeout(100000000);

	it("Should return true for correct inputs", async () => 
	{
		const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
		await circuit.loadConstraints();

		poseidon = await buildPoseidon();
		F = poseidon.F;
		const res2 = F.toString(poseidon([12345, 1, 2, 3]));
		// const solnHash = 
		const INPUT = {
			"pubGuessA": "0",
			"pubGuessB": "5",
			"pubGuessC": "9",
			"pubNumHit": "0",
			"pubNumBlow": "0",
			"pubSolnHash": res2,
			"privSolnA" : "1",
			"privSolnB" : "2",
			"privSolnC" : "3",
			"privSalt" : "12345"
		}
		// console.log(res2);

		chai.expect(await circuit.calculateWitness(INPUT));
		// assert.isNotOk(await circuit.calculateWitness(INPUT));
	});

	it("Should return true for correct inputs", async () => 
	{
		const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
		await circuit.loadConstraints();

		poseidon = await buildPoseidon();
		F = poseidon.F;
		const res2 = F.toString(poseidon([420, 1, 2, 3]));
		// const solnHash = 
		const INPUT = {
			"pubGuessA": "1",
			"pubGuessB": "2",
			"pubGuessC": "3",
			"pubNumHit": "3",
			"pubNumBlow": "0",
			"pubSolnHash": res2,
			"privSolnA" : "1",
			"privSolnB" : "2",
			"privSolnC" : "3",
			"privSalt" : "420"
		}
		// console.log(res2);

		chai.expect(await circuit.calculateWitness(INPUT));
		// assert.isNotOk(await circuit.calculateWitness(INPUT));
	});

	it("Should return an error for wrong inputs", async () => 
	{
		const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
		await circuit.loadConstraints();

		poseidon = await buildPoseidon();
		F = poseidon.F;
		const res2 = F.toString(poseidon([999, 1, 2, 3]));
		// const solnHash = 
		const INPUT = {
			"pubGuessA": "1",
			"pubGuessB": "5",
			"pubGuessC": "2",
			"pubNumHit": "1",
			"pubNumBlow": "10",
			"pubSolnHash": res2,
			"privSolnA" : "1",
			"privSolnB" : "2",
			"privSolnC" : "3",
			"privSalt" : "999"
		}
		// console.log(res2);

		// chai.expect(await circuit.calculateWitness(INPUT));
		// assert.isNotOk(await circuit.calculateWitness(INPUT));
		let eval = 0
		try
		{
			await circuit.calculateWitness(INPUT);
		}
		catch (e)
		{
			//pass
			eval = 1;
		}
		assert(eval==1, "The circuit runs for wrong inputs. This shouldn't be possible.");
	});
});