// Calculadora Agrinho — script.js (vanilla JS)
const form = document.getElementById('calc-form');
const resultBox = document.getElementById('result');
const impactEl = document.getElementById('impact');
const prodPerHaEl = document.getElementById('prod-per-ha');
const exportCsvBtn = document.getElementById('export-csv');
const resetBtn = document.getElementById('reset-btn');
const copyLinkBtn = document.getElementById('copy-link');

function sanitizeNumber(v){
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function calcularImpacto({ area, prod, practices }){
  const prodPerHa = area > 0 ? prod / area : 0;

  const factors = {
    convencional: 1.0,
    sustentavel: 0.8,
    organico: 0.6
  };
  const factor = factors[practices] ?? 1.0;

  const penalty = Math.log10(Math.max(area, 1)) * 0.05;
  const impacto = Math.max(0, prod * factor * (1 - penalty));

  return {
    impacto: Number(impacto.toFixed(3)),
    prodPerHa: Number(prodPerHa.toFixed(3)),
    factor,
    penalty: Number(penalty.toFixed(4))
  };
}

function showResults(data){
  impactEl.textContent = `${data.impacto} (unidades)`;
  prodPerHaEl.textContent = `${data.prodPerHa} t/ha`;
  resultBox.classList.remove('hidden');
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const area = sanitizeNumber(form.area.value);
  const prod = sanitizeNumber(form.prod.value);
  const practices = form.practices.value;

  if(area <= 0 || prod <= 0 || !practices){
    alert('Preencha todos os campos com valores válidos.');
    return;
  }

  const resultado = calcularImpacto({ area, prod, practices });
  showResults(resultado);

  const params = new URLSearchParams({ area, prod, practices });
  history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
});

// Reset
resetBtn.addEventListener('click', ()=>{
  form.reset();
  resultBox.classList.add('hidden');
  history.replaceState(null, '', location.pathname);
});

// Export CSV
exportCsvBtn.addEventListener('click', ()=>{
  const area = sanitizeNumber(form.area.value);
  const prod = sanitizeNumber(form.prod.value);
  const practices = form.practices.value || '';
  const resultado = calcularImpacto({ area, prod, practices });
  const csv = [
    ['campo','valor'],
    ['area_ha', area],
    ['producao_t', prod],
    ['pratica', practices],
    ['impacto', resultado.impacto],
    ['prod_t_por_ha', resultado.prodPerHa]
  ].map(r => r.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8
