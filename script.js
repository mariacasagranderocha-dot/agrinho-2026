// script.js — versão aprimorada para Agrinho 2026

const form = document.getElementById('calc-form');
const resultBox = document.getElementById('result');
const impactEl = document.getElementById('impact');
const prodPerHaEl = document.getElementById('prod-per-ha');
const factorEl = document.getElementById('factor');
const exportCsvBtn = document.getElementById('export-csv');
const resetBtn = document.getElementById('reset-btn');
const copyLinkBtn = document.getElementById('copy-link');
const downloadPdfBtn = document.getElementById('download-pdf');

// helper: converte string para número (aceita vírgula)
function sanitizeNumber(v){
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

// função de cálculo (ajuste conforme sua fórmula real)
function calcularImpacto({ area, prod, practices }){
  const prodPerHa = area > 0 ? prod / area : 0;

  // fatores exemplo — ajuste conforme metodologia
  const factors = {
    convencional: 1.0,
    sustentavel: 0.78,
    organico: 0.62
  };
  const factor = factors[practices] ?? 1.0;

  // penalidade/ajuste por escala (exemplo)
  const penalty = Math.log10(Math.max(area, 1)) * 0.04; // cresce levemente com área

  // cálculo de impacto: produção * fator ajustado pela penalidade
  const impactoRaw = prod * factor * (1 - penalty);
  const impacto = Math.max(0, impactoRaw);

  // score combinado para cores/avaliação
  const score = Math.max(0, Math.min(100, (prodPerHa * factor) * 10));

  return {
    impacto: Number(impacto.toFixed(3)),
    prodPerHa: Number(prodPerHa.toFixed(3)),
    factor: Number(factor.toFixed(2)),
    penalty: Number(penalty.toFixed(4)),
    score: Number(score.toFixed(1))
  };
}

// animação simples: fade-in com transform
function showResultAnimation(node){
  node.style.opacity = 0;
  node.style.transform = 'translateY(6px)';
  node.classList.remove('hidden');
  requestAnimationFrame(() => {
    node.style.transition = 'opacity 360ms ease, transform 360ms ease';
    node.style.opacity = 1;
    node.style.transform = 'translateY(0)';
  });
}

// mostrar resultados na UI
function showResults(data){
  impactEl.textContent = `${data.impacto} unidades`;
  prodPerHaEl.textContent = `${data.prodPerHa} t/ha`;
  factorEl.textContent = `${data.factor}`;
  showResultAnimation(resultBox);
  drawMiniChart(data.prodPerHa, data.score);
}

// histórico local (mantém últimos 12 cálculos)
function pushHistory(entry){
  try{
    const key = 'agrinho_history_v2';
    const hist = JSON.parse(localStorage.getItem(key) || '[]');
    hist.unshift(entry);
    localStorage.setItem(key, JSON.stringify(hist.slice(0,12)));
  }catch(e){
    // ignore
  }
}

// cria URL compartilhável com parâmetros (sem expor dados sensíveis)
function buildShareUrl({ area, prod, practices, notes }){
  const p = new URLSearchParams();
  if(area) p.set('area', area);
  if(prod) p.set('prod', prod);
  if(practices) p.set('practices', practices);
  if(notes) p.set('notes', notes.slice(0,120));
  return `${location.origin}${location.pathname}?${p.toString()}`;
}

// copiar link para clipboard com feedback simples
async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    copyLinkBtn.textContent = 'Link copiado!';
    setTimeout(()=> copyLinkBtn.textContent = 'Copiar link', 1800);
  }catch(e){
    alert('Não foi possível copiar. Use Ctrl+C para copiar o link manualmente.');
  }
}

// criar CSV simples e iniciar download
function downloadCSV(objInputs, resultado){
  const rows = [
    ['campo','valor'],
    ['area_ha', objInputs.area],
    ['producao_t', objInputs.prod],
    ['pratica', objInputs.practices],
    ['notas', objInputs.notes || ''],
    ['impacto', resultado.impacto],
    ['prod_t_por_ha', resultado.prodPerHa],
    ['factor', resultado.factor],
    ['penalty', resultado.penalty]
  ];
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agrinho_resultado_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// criar resumo simples (.txt) e baixar
function downloadSummaryText(objInputs, resultado){
  const lines = [
    'Resumo Agrinho 2026',
    `Data: ${new Date().toLocaleString()}`,
    '',
    'Entradas:',
    `- Área (ha): ${objInputs.area}`,
    `- Produção (t): ${objInputs.prod}`,
    `- Prática: ${objInputs.practices}`,
    `- Observações: ${objInputs.notes || '-'}`,
    '',
    'Resultados:',
    `- Impacto estimado: ${resultado.impacto}`,
    `- Produtividade (t/ha): ${resultado.prodPerHa}`,
    `- Fator prática: ${resultado.factor}`,
    `- Penalidade: ${resultado.penalty}`,
    '',
    'Observação: fórmula de exemplo — ajuste conforme metodologia.'
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  downloadPdfBtn.href = url;
  // o atributo download já está no elemento; clique automático opcional:
  // downloadPdfBtn.click();
}

// mini-gráfico em canvas (gera visual simples de produtividade vs score)
function drawMiniChart(prodPerHa, score){
  // cria canvas dinâmico se não existir
  let canvas = document.getElementById('mini-chart');
  if(!canvas){
    canvas = document.createElement('canvas');
    canvas.id = 'mini-chart';
    canvas.width = 320;
    canvas.height = 80;
    canvas.style.width = '100%';
    canvas.style.height = '80px';
    const container = document.querySelector('.result-cards') || resultBox;
    container.appendChild(canvas);
  }
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0,0,w,h);

  // background grade
  ctx.fillStyle = '#f8faf8';
  ctx.fillRect(0,0,w,h);

  // escala de produtividade (0..max)
  const maxProd = Math.max(1, prodPerHa * 1.8);
  const px = Math.min(w - 20, Math.round((prodPerHa / maxProd) * (w - 40))) + 10;
  const barH = 26;

  // barra de produtividade
  ctx.fillStyle = '#0b7a3f';
  ctx.fillRect(10, 12, px, barH);
  // sombra suave
  ctx.fillStyle = 'rgba(11,122,63,0.12)';
  ctx.fillRect(10 + px, 12, Math.max(0, (w-20)-px), barH);

  // texto
  ctx.fillStyle = '#053018';
  ctx.font = '14px Inter, system-ui, Arial';
  ctx.fillText(`${prodPerHa} t/ha`, 12, 56);

  // score pequeno
  const scoreX = w - 60;
  ctx.fillStyle = '#fff';
  ctx.fillRect(scoreX - 6, 8, 56, 28);
  ctx.fillStyle = '#2a7cff';
  ctx.font = 'bold 13px Inter, system-ui, Arial';
  ctx.fillText(`${score}%`, scoreX + 6, 28);
}

// ao submeter o formulário
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const area = sanitizeNumber(form.area.value);
  const prod = sanitizeNumber(form.prod.value);
  const practices = form.practices.value;
  const notes = (form.notes && form.notes.value) ? form.notes.value.trim() : '';

  // validações
  if (!practices || area <= 0 || prod <= 0) {
    // foco no primeiro campo inválido
    if (!practices) form.practices.focus();
    else if (area <= 0) form.area.focus();
    else form.prod.focus();
    alert('Por favor preencha todos os campos obrigatórios com valores válidos.');
    return;
  }

  const inputs = { area, prod, practices, notes };
  const resultado = calcularImpacto(inputs);
  showResults(resultado);

  // salvar histórico
  pushHistory({ when: new Date().toISOString(), inputs, resultado });

  // preparar downloads e link
  downloadSummaryText(inputs, resultado);

  // atualizar URL (sem sensitive info além de parâmetros públicos)
  const shareUrl = buildShareUrl(inputs);
  history.replaceState(null, '', shareUrl);
});

// reset/limpar
resetBtn.addEventListener('click', () => {
  form.reset();
  resultBox.classList.add('hidden');
  // remove mini-chart se existir
  const c = document.getElementById('mini-chart');
  if(c) c.remove();
  history.replaceState(null, '', location.pathname);
});

// exportar CSV
exportCsvBtn.addEventListener('click', () => {
  const area = sanitizeNumber(form.area.value);
  const prod = sanitizeNumber(form.prod.value);
  const practices = form.practices.value || '';
  const notes = form.notes.value || '';
  if(area <= 0 || prod <= 0 || !practices){
    alert('Preencha os campos antes de exportar.');
    return;
  }
  const resultado = calcularImpacto({ area, prod, practices });
  downloadCSV({ area, prod, practices, notes }, resultado);
});

//
