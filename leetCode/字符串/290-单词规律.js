/**
 * @param {string} pattern
 * @param {string} s
 * @return {boolean}
 */

//方法：哈希map
var wordPattern = function (pattern, s) {
  const a = s.split(' ');
  if (pattern.length != a.length) {
    return false;
  }
  const hp = new Map();
  const hs = new Map();
  for (let i = 0; i < a.length; i++) {
    let p = pattern[i], s = a[i];
    if (hp.has(p)) {
      if (hp.get(p) !== s) {
        return false;
      } else {
        hp.set(p, s);
      }
    }
    if (hs.has(s)) {
      if (hs.get(s) != p) {
        return false;
      } else {
        hs.set(s, p);
      }
    }
  }
  return true;
};