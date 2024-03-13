import { createPrivateKey, createPublicKey } from 'node:crypto';

export function createJwtKeyPair(key: string) {
  const jwtPrivateKey = createPrivateKey({
    key: Buffer.from(key),
    format: 'pem',
    type: 'sec1',
  })
    .export({
      format: 'pem',
      type: 'pkcs8',
    })
    .toString('utf8');

  const jwtPublicKey = createPublicKey({
    key: Buffer.from(key),
    format: 'pem',
    type: 'spki',
  })
    .export({
      format: 'pem',
      type: 'spki',
    })
    .toString('utf8');
  return { jwtPrivateKey, jwtPublicKey };
}
