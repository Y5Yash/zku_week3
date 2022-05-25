const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

try
{
	let content = fs.readFileSync("./contracts/verifier.sol", { encoding: 'utf-8' });
	let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
	fs.writeFileSync("./contracts/verifier.sol", bumped);
}
catch{}
finally{}

try
{
	let content2 = fs.readFileSync("./contracts/Minesweeper.sol", { encoding: 'utf-8' });
	let bumped2 = content2.replace(solidityRegex, 'pragma solidity ^0.8.0');
	fs.writeFileSync("./contracts/Minesweeper.sol", bumped2);
}
catch{}
finally{}
