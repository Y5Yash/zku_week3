import {
  buildEddsaModule,
  decrypt,
  encrypt,
  genKeypair,
  genEcdhSharedKey,
  EdDSA
} from '../index';

// type Plaintext = bigint[];

describe('ECDH test', () => {
  let eddsa: EdDSA;
  beforeAll(async () => {
    eddsa = await buildEddsaModule();
	// jest.setTimeout(60000);
  }, 15000);
//   beforeEach(() => {
//     // jest.setTimeout(10000);
//   });

  it('should encrypt/decrypt text', async () => {
	// jest.setTimeout(60000);
    const { privKey: bobPrivKey, pubKey: bobPubKey } = genKeypair(eddsa);
    const { privKey: alicePrivKey, pubKey: alicePubKey } = genKeypair(eddsa);
    const ecdhSharedKey = await genEcdhSharedKey({
      eddsa,
      privKey: alicePrivKey,
      pubKey: bobPubKey,
    });

    const aliceMessage: bigint[] = [];
    for (let i = 0; i < 5; i++) {
      aliceMessage.push(BigInt(Math.floor(Math.random() * 50)));
    }
    // console.log('plaintext:', aliceMessage);
    // Alice encrypt with her private key and bob pubkey
    const ciphertext = await encrypt(aliceMessage, ecdhSharedKey);
	// console.log(ciphertext)

    // decrypting using bob's private key + alice pubkey
    const ecdhbobSharedKey = await genEcdhSharedKey({
      eddsa,
      privKey: bobPrivKey,
      pubKey: alicePubKey,
    });
	// console.log("here 2")
    const decryptedMessage = await decrypt(ciphertext, ecdhbobSharedKey);
	// console.log(decryptedMessage[2])
	// console.log(decryptedMessage[0]==aliceMessage[0])
	// console.log(aliceMessage)
    expect(decryptedMessage).toStrictEqual(aliceMessage);
	// console.log("the end")
  });

  it('should fail if decrypted with incorrect public key', async () => {
	// jest.setTimeout(60000);
    const { privKey: bobPrivKey, pubKey: bobPubKey } = genKeypair(eddsa);
    const { privKey: alicePrivKey } = genKeypair(eddsa);

    const ecdhSharedKey = await genEcdhSharedKey({
      eddsa,
      privKey: alicePrivKey,
      pubKey: bobPubKey,
    });

    const aliceMessage: bigint[] = [];
    for (let i = 0; i < 5; i++) {
      aliceMessage.push(BigInt(Math.floor(Math.random() * 50)));
    }
    //console.log('plaintext:', aliceMessage);
    // Alice encrypt with her private key and bob pubkey
    const ciphertext = await encrypt(aliceMessage, ecdhSharedKey);

    const maliciousPubKey = [eddsa.prv2pub(123n.toString())];
    const ecdhSharedIncorrectKey = await genEcdhSharedKey({
      eddsa,
      privKey: bobPrivKey,
      pubKey: maliciousPubKey,
    });

    const decryptedMessage = await decrypt(ciphertext, ecdhSharedIncorrectKey);
    expect(decryptedMessage).not.toEqual(aliceMessage);
	// console.log("done here")
  });
});