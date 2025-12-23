function log2(x){ return Math.log(x)/Math.log(2); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }

function renderMath(){
  if (window.renderMathInElement){
    renderMathInElement(document.body, {
      delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "$", right: "$", display: false},
      ]
    });
  }
  document.querySelectorAll(".formula").forEach(el=>{
    const tex = el.getAttribute("data-tex");
    if(!tex) return;
    el.innerHTML = "";
    katex.render(tex, el, {throwOnError:false});
  });
}

/** -------- Stern–Brocot finite tree (depth-limited) --------
 * We generate nodes by mediants between bounds (L=a/b, R=c/d).
 */
function buildSB(depth){
  const root = {a:1,b:2, L:{a:0,b:1}, R:{a:1,b:1}, depth:1, path:""};
  function rec(node){
    if(node.depth >= depth) return;
    // left child is mediant(L, node)
    const LL = node.L;
    const lc = {a: LL.a + node.a, b: LL.b + node.b, L: LL, R:{a:node.a,b:node.b}, depth: node.depth+1, path: node.path+"L"};
    // right child is mediant(node, R)
    const RR = node.R;
    const rc = {a: node.a + RR.a, b: node.b + RR.b, L:{a:node.a,b:node.b}, R: RR, depth: node.depth+1, path: node.path+"R"};
    node.left = lc; node.right = rc;
    rec(lc); rec(rc);
  }
  rec(root);
  return root;
}

function layoutTree(root){
  // simple tidy layout for small depth
  const nodes = [];
  function walk(n, xMin, xMax, y){
    const x = (xMin + xMax)/2;
    nodes.push({...n, x, y});
    if(n.left) walk(n.left, xMin, x, y+1);
    if(n.right) walk(n.right, x, xMax, y+1);
  }
  walk(root, 0, 1, 0);
  return nodes;
}

function drawTree(depth){
  const svg = d3.select("#treeSvg");
  svg.selectAll("*").remove();

  const root = buildSB(depth);
  const nodes = layoutTree(root);
  const W=900,H=360, pad=20;

  const byPath = new Map(nodes.map(d=>[d.path,d]));

  // links
  const links = [];
  nodes.forEach(n=>{
    if(n.left) links.push([n.path, n.left.path]);
    if(n.right) links.push([n.path, n.right.path]);
  });

  svg.selectAll("line.link")
    .data(links)
    .enter().append("line")
    .attr("x1", d=> pad + byPath.get(d[0]).x*(W-2*pad))
    .attr("y1", d=> pad + byPath.get(d[0]).y*(H-2*pad)/(depth))
    .attr("x2", d=> pad + byPath.get(d[1]).x*(W-2*pad))
    .attr("y2", d=> pad + byPath.get(d[1]).y*(H-2*pad)/(depth))
    .attr("stroke","rgba(125,211,252,0.20)");

  // nodes
  const g = svg.selectAll("g.node")
    .data(nodes)
    .enter().append("g")
    .attr("transform", d=>{
      const x = pad + d.x*(W-2*pad);
      const y = pad + d.y*(H-2*pad)/(depth);
      return `translate(${x},${y})`;
    });

  g.append("circle")
    .attr("r", 14)
    .attr("fill","rgba(255,255,255,0.04)")
    .attr("stroke","rgba(125,211,252,0.35)");

  g.append("text")
    .attr("text-anchor","middle")
    .attr("dy", 4)
    .attr("font-size", 11)
    .attr("fill","rgba(231,238,248,0.92)")
    .text(d=>`${d.a}/${d.b}`);
}

/** -------- Continued fraction of a/b (Euclid) -------- */
function continuedFraction(a,b){
  // returns [a0,a1,...]; for 0<a<b, a0=0
  const res = [];
  while(b !== 0){
    const q = Math.floor(a/b);
    res.push(q);
    const r = a % b;
    a = b; b = r;
  }
  return res;
}

/** map CF [0;a1,a2,...,ak] => run-length blocks [a1,a2,...,ak-1, ak-1] */
function cfToBlocks(cf){
  if(cf.length === 0) return [];
  if(cf[0] !== 0) {
    // still handle
  }
  const tail = cf.slice(1);
  if(tail.length === 0) return [];
  const blocks = tail.slice();
  blocks[blocks.length-1] = Math.max(1, blocks[blocks.length-1]-1);
  return blocks;
}

function G(x){ return 2*Math.floor(log2(x)) + 1; }

function updateCFUI(){
  const raw = document.getElementById("fracInput").value.trim();
  const m = raw.match(/^(\d+)\s*\/\s*(\d+)$/);
  const note = document.getElementById("cfNote");
  if(!m){
    note.textContent = "형식: a/b (예: 9/14)";
    return;
  }
  const a = parseInt(m[1],10), b = parseInt(m[2],10);
  if(!(a>0 && b>0 && a<b)){
    note.textContent = "조건: 0 < a < b";
    return;
  }

  const cf = continuedFraction(a,b);
  const blocks = cfToBlocks(cf);

  const blocksText = blocks.map((x,i)=>`${i%2===0?"L":"R"}^${x}`).join(" ");
  const qCounts = blocks.map(x=>G(x));
  const total = qCounts.reduce((s,v)=>s+v,0);

  note.innerHTML = `
    <div><b>continued fraction</b>: [${cf.join("; ").replace("0;","0; ")}]</div>
    <div><b>compressed blocks</b>: ${blocksText || "(empty)"}</div>
    <div><b>block queries</b>: [${qCounts.join(", ")}], total ≈ ${total} (G(x)=2⌊log₂x⌋+1)</div>
  `;

  drawBlockChart(blocks, qCounts);
  updateQueryBreakdown(blocks, qCounts);
}

function updateQueryBreakdown(blocks, qCounts){
  const el = document.getElementById("queryBreakdown");
  if(blocks.length===0){
    el.textContent = "블록이 비어있습니다(입력을 확인).";
    return;
  }
  const total = qCounts.reduce((s,v)=>s+v,0);
  const maxBlock = Math.max(...blocks);
  el.innerHTML = `
    블록 수: ${blocks.length}<br/>
    최대 블록 길이: ${maxBlock}<br/>
    총 쿼리(블록 상한 합): <b>${total}</b><br/>
    (논문은 각 블록을 exponential+binary search로 찾아 이 상한을 얻습니다.) :contentReference[oaicite:31]{index=31}
  `;
}

function drawBlockChart(blocks, qCounts){
  const svg = d3.select("#blockChart");
  svg.selectAll("*").remove();
  const W=640,H=220,m={l:44,r:16,t:14,b:34};

  const data = blocks.map((x,i)=>({i:i+1, x, q:qCounts[i]}));
  const x = d3.scaleBand().domain(data.map(d=>d.i)).range([m.l, W-m.r]).padding(0.25);
  const y = d3.scaleLinear().domain([0, d3.max(data,d=>d.q)||1]).nice().range([H-m.b, m.t]);

  svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x", d=>x(d.i))
    .attr("y", d=>y(d.q))
    .attr("width", x.bandwidth())
    .attr("height", d=>y(0)-y(d.q))
    .attr("fill","rgba(125,211,252,0.35)")
    .attr("stroke","rgba(125,211,252,0.55)");

  svg.append("g")
    .attr("transform",`translate(0,${H-m.b})`)
    .call(d3.axisBottom(x).tickFormat(d=>`b${d}`))
    .selectAll("text").attr("fill","rgba(155,176,200,0.9)");
  svg.append("g")
    .attr("transform",`translate(${m.l},0)`)
    .call(d3.axisLeft(y).ticks(5))
    .selectAll("text").attr("fill","rgba(155,176,200,0.9)");
  svg.selectAll(".domain,.tick line").attr("stroke","rgba(31,42,58,1)");
}

/** -------- Bounds compare (2.5849 vs 2.4189) -------- */
function updateBounds(){
  const n = +document.getElementById("nScale").value;
  document.getElementById("nScaleVal").textContent = n.toLocaleString();
  const ub = 2.5849 * log2(n);
  const lb = 2.4189 * log2(n);
  document.getElementById("boundCompare").innerHTML = `
    log₂ n = ${log2(n).toFixed(4)}<br/>
    상한(2.5849·log₂n) ≈ <b>${ub.toFixed(2)}</b><br/>
    하한(2.4189·log₂n) ≈ <b>${lb.toFixed(2)}</b><br/>
    (논문: 상한은 Theorem 1, 하한은 (L^8R)^k 구성에서 도출) :contentReference[oaicite:32]{index=32}
  `;
}

/** -------- Experiments chart (KM vs CSB) -------- */
function drawExpChart(metric){
  const svg = d3.select("#expChart");
  svg.selectAll("*").remove();
  const W=720,H=260,m={l:54,r:16,t:16,b:36};

  const data = window.EXP_DATA.map(d=>({
    x: d.nPow,
    km: metric==="time" ? d.km_time : (metric==="avg" ? d.km_avg : d.km_max),
    csb: metric==="time" ? d.csb_time : (metric==="avg" ? d.csb_avg : d.csb_max),
  }));

  const x = d3.scaleLinear().domain(d3.extent(data,d=>d.x)).range([m.l, W-m.r]);
  const y = d3.scaleLinear()
    .domain([0, d3.max(data,d=>Math.max(d.km,d.csb))||1]).nice()
    .range([H-m.b, m.t]);

  const line = (key)=>d3.line().x(d=>x(d.x)).y(d=>y(d[key]));

  svg.append("path").attr("d", line("km")(data))
    .attr("fill","none").attr("stroke","rgba(231,238,248,0.65)").attr("stroke-width",2);
  svg.append("path").attr("d", line("csb")(data))
    .attr("fill","none").attr("stroke","rgba(125,211,252,0.75)").attr("stroke-width",2);

  svg.append("g")
    .attr("transform",`translate(0,${H-m.b})`)
    .call(d3.axisBottom(x).ticks(8).tickFormat(d=>`10^${d}`))
    .selectAll("text").attr("fill","rgba(155,176,200,0.9)");
  svg.append("g")
    .attr("transform",`translate(${m.l},0)`)
    .call(d3.axisLeft(y).ticks(5))
    .selectAll("text").attr("fill","rgba(155,176,200,0.9)");
  svg.selectAll(".domain,.tick line").attr("stroke","rgba(31,42,58,1)");

  // legend
  svg.append("text").attr("x", W-170).attr("y", 28).attr("fill","rgba(231,238,248,0.8)").attr("font-size",12).text("KM");
  svg.append("line").attr("x1", W-210).attr("x2", W-180).attr("y1", 24).attr("y2", 24).attr("stroke","rgba(231,238,248,0.65)").attr("stroke-width",2);

  svg.append("text").attr("x", W-170).attr("y", 48).attr("fill","rgba(125,211,252,0.9)").attr("font-size",12).text("Compressed SB");
  svg.append("line").attr("x1", W-210).attr("x2", W-180).attr("y1", 44).attr("y2", 44).attr("stroke","rgba(125,211,252,0.75)").attr("stroke-width",2);
}

/** -------- Approx table lookup -------- */
function initApproxUI(){
  const deltaSel = document.getElementById("deltaSel");
  window.APPROX.forEach(row=>{
    const opt = document.createElement("option");
    opt.value = row.delta;
    opt.textContent = `δ = ${row.delta}`;
    deltaSel.appendChild(opt);
  });
  deltaSel.value = "1e-6";
}

function updateApproxNote(){
  const delta = document.getElementById("deltaSel").value;
  const c = document.getElementById("constSel").value;
  const row = window.APPROX.find(r=>r.delta===delta);
  const val = row ? row[c] : "(not found)";
  document.getElementById("approxNote").innerHTML = `
    선택한 δ에서 논문 표 3의 근사값: <b>${val}</b><br/>
    (미지의 real을 비교 쿼리로만 다루는 변형을 제시하고, π/e/√2/√5로 평가) :contentReference[oaicite:33]{index=33}
  `;
}

/** -------- Images note: you need to save screenshots as assets -------- */
function initImagesNote(){
  // 안내만: 실제 파일은 레포에서 준비
}

function init(){
  renderMath();

  // tree
  const depth = document.getElementById("depth");
  const depthVal = document.getElementById("depthVal");
  const redraw = ()=>{
    depthVal.textContent = depth.value;
    drawTree(+depth.value);
  };
  depth.addEventListener("input", redraw);
  redraw();

  // cf
  document.getElementById("parseFracBtn").addEventListener("click", updateCFUI);
  updateCFUI();

  // bounds
  const nScale = document.getElementById("nScale");
  const nScaleVal = document.getElementById("nScaleVal");
  nScaleVal.textContent = nScale.value;
  nScale.addEventListener("input", updateBounds);
  updateBounds();

  // experiments
  const metricSel = document.getElementById("metricSel");
  metricSel.addEventListener("change", ()=>drawExpChart(metricSel.value));
  drawExpChart(metricSel.value);

  // approx
  initApproxUI();
  document.getElementById("deltaSel").addEventListener("change", updateApproxNote);
  document.getElementById("constSel").addEventListener("change", updateApproxNote);
  updateApproxNote();
}
window.addEventListener("DOMContentLoaded", init);
