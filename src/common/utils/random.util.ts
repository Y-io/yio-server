import { nanoid, customAlphabet } from 'nanoid';

/**
 * 生成32位随机字符串
 *
 * @param pool 随机字符池，默认：ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
 *
 * @param length 随机字符长度，默认：32
 */
export async function genRandomStr(pool?: string, length?: number) {
  if (pool && !length) {
    return nanoid(32);
  }
  if (!pool && length) {
    return customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')(length);
  }
  if (pool && length) {
    return nanoid(length);
  }
  return customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')(32);
}
