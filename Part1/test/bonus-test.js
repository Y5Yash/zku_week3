// [bonus] unit test for bonus.circom

const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const buildPoseidon = require("circomlibjs").buildPoseidon;

const assert = chai.assert;

describe("Testing Minesweeper", function ()
{
	let poseidon;
	let circuit;
	this.timeout(100000000);
	beforeEach(async function ()
	{
		// const circuit = await wasm_tester("contracts/circuits/bonus.circom");
		// await circuit.loadConstraints();
		// poseidon = await buildPoseidon();
		// F = poseidon.F;
	})

	it("Should return true for all boxes unrevealed", async () =>
	{
		// 1 1 1
		// 1 9 1
		// 1 1 1

		const circuit = await wasm_tester("contracts/circuits/bonus.circom");
		await circuit.loadConstraints();
		poseidon = await buildPoseidon();

		flatarrsalt = [1, 1, 1, 1, 9, 1, 1, 1, 1, 999];
		const solnHash = poseidon.F.toString(poseidon(flatarrsalt));
		const INPUT = {
			"privSolution" : [["1", "1", "1"], ["1", "9", "1"], ["1", "1", "1"]],
			"pubSolnHash" : solnHash,
			"privSalt" : "999",
			"pubQuery" : [["10", "10", "10"], ["10", "10", "10"], ["10", "10", "10"]]
		}

		// chai.expect(await circuit.calculateWitness(INPUT));
		let err = 0
		try
		{
			await circuit.calculateWitness(INPUT);
		}
		catch
		{
			err = 1;
		}
		assert(err==0, "Tested the circuit for correct input");
	});

	it("Should throw an error when the query is wrong", async () =>
	{
		// 1 1 1
		// 1 9 1
		// 1 1 1

		const circuit = await wasm_tester("contracts/circuits/bonus.circom");
		await circuit.loadConstraints();
		poseidon = await buildPoseidon();

		flatarrsalt = [1, 1, 1, 1, 9, 1, 1, 1, 1, 999];
		const solnHash = poseidon.F.toString(poseidon(flatarrsalt));
		const INPUT = {
			"privSolution" : [["1", "1", "1"], ["1", "9", "1"], ["1", "1", "1"]],
			"pubSolnHash" : solnHash,
			"privSalt" : "999",
			"pubQuery" : [["10", "10", "10"], ["2", "10", "10"], ["10", "10", "10"]]
		}

		let err = 0
		try
		{
			await circuit.calculateWitness(INPUT);
		}
		catch
		{
			err = 1;
		}
		assert(err==1, "Tested the circuit for wrong input");
	});

	it("Changing the solution hash, expecting an error", async () =>
	{
		// 1 1 1
		// 1 9 1
		// 1 1 1

		const circuit = await wasm_tester("contracts/circuits/bonus.circom");
		await circuit.loadConstraints();
		poseidon = await buildPoseidon();

		// flatarrsalt = [1, 1, 1, 1, 9, 1, 1, 1, 1, 999];
		// const solnHash = poseidon.F.toString(poseidon(flatarrsalt));
		const INPUT = {
			"privSolution" : [["1", "1", "1"], ["1", "9", "1"], ["1", "1", "1"]],
			"pubSolnHash" : "0",
			"privSalt" : "999",
			"pubQuery" : [["10", "10", "10"], ["1", "10", "10"], ["10", "10", "10"]]
		}

		let err = 0
		try
		{
			await circuit.calculateWitness(INPUT);
		}
		catch
		{
			err = 1;
		}
		assert(err==1, "Tested the circuit for wrong solutionhash");
	});
})