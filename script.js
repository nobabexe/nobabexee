const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: "!@#$%^&*()_+[]{}|;:,.<>?/~`-='"
};
const SIMILAR = new Set(['i', 'l', '1', 'L', '0', 'O', 'o']);

const length = document.getElementById('length');
const lengthVal = document.getElementById('lengthVal');
const passwordEl = document.getElementById('password');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const lower = document.getElementById('lower');
const upper = document.getElementById('upper');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const excludeSimilar = document.getElementById('excludeSimilar');
const strengthBar = document.getElementById('strengthBar');
const entropyEl = document.getElementById('entropy');

function buildCharset() {
  let cs = '';
  if (lower.checked) cs += SETS.lower;
  if (upper.checked) cs += SETS.upper;
  if (numbers.checked) cs += SETS.numbers;
  if (symbols.checked) cs += SETS.symbols;
  if (excludeSimilar.checked) cs = Array.from(cs).filter(ch => !SIMILAR.has(ch)).join('');
  return cs;
}

function generatePassword(len) {
  const cs = buildCharset();
  if (!cs.length) return '';
  let out = '';
  const randoms = new Uint32Array(len);
  window.crypto.getRandomValues(randoms);
  for (let i = 0; i < len; i++) {
    out += cs[randoms[i] % cs.length];
  }
  return out;
}

function estimateEntropy(password, charsetSize) {
  if (charsetSize <= 1) return 0;
  return (password.length * Math.log2(charsetSize)).toFixed(1);
}

function updateStrength(password) {
  const cs = buildCharset();
  const ent = estimateEntropy(password, cs.length);
  entropyEl.textContent = ent + ' bits';
  const pct = Math.min(100, Math.round((ent / 128) * 100));
  strengthBar.style.width = pct + '%';
  strengthBar.style.background =
    pct < 40
      ? 'linear-gradient(90deg,#ff5f6d,#ffc371)'
      : pct < 75
      ? 'linear-gradient(90deg,#ffb86b,#ffd56b)'
      : 'linear-gradient(90deg,#6ee7b7,#34d399)';
}

generateBtn.addEventListener('click', () => {
  const pwd = generatePassword(parseInt(length.value, 10));
  passwordEl.textContent = pwd || 'Enable at least one character set.';
  updateStrength(pwd);
});

copyBtn.addEventListener('click', async () => {
  const txt = passwordEl.textContent;
  if (!txt || txt.startsWith('Click')) return;
  await navigator.clipboard.writeText(txt);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
});

length.addEventListener('input', () => (lengthVal.textContent = length.value));
