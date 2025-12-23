// Table 1 (n <= 10^25) — 일부 샘플 (논문 표 1에서 발췌) :contentReference[oaicite:28]{index=28}
window.TABLE1 = [
  {nPow: 1,  km_max: 8,   km_avg: 5.5,   km_time: 1.52e-5, csb_max: 7,   csb_avg: 3.5,   csb_time: 2.29e-5},
  {nPow: 2,  km_max: 15,  km_avg: 13.2,  km_time: 2.80e-5, csb_max: 15,  csb_avg: 8.5,   csb_time: 4.42e-5},
  {nPow: 3,  km_max: 21,  km_avg: 20.7,  km_time: 4.19e-5, csb_max: 23,  csb_avg: 15.1,  csb_time: 6.93e-5},
  {nPow: 4,  km_max: 28,  km_avg: 27.6,  km_time: 5.63e-5, csb_max: 29,  csb_avg: 21.8,  csb_time: 9.57e-5},
  {nPow: 10, km_max: 68,  km_avg: 67.5,  km_time: 2.71e-4, csb_max: 72,  csb_avg: 62.3,  csb_time: 3.78e-4},
  {nPow: 15, km_max: 101, km_avg: 100.8, km_time: 5.22e-4, csb_max: 110, csb_avg: 96.4,  csb_time: 6.85e-4},
  {nPow: 25, km_max: 168, km_avg: 167.1, km_time: 1.08e-3, csb_max: 176, csb_avg: 164.3, csb_time: 1.45e-3},
];

// Table 2 (10^26..10^50) — 일부 샘플 :contentReference[oaicite:29]{index=29}
window.TABLE2 = [
  {nPow: 26, km_max: 174, km_avg: 173.8, km_time: 1.12e-3, csb_max: 185, csb_avg: 171.3, csb_time: 1.52e-3},
  {nPow: 30, km_max: 201, km_avg: 200.4, km_time: 1.40e-3, csb_max: 213, csb_avg: 198.4, csb_time: 1.90e-3},
  {nPow: 35, km_max: 234, km_avg: 233.6, km_time: 1.71e-3, csb_max: 247, csb_avg: 232.5, csb_time: 2.35e-3},
  {nPow: 40, km_max: 267, km_avg: 266.8, km_time: 2.13e-3, csb_max: 282, csb_avg: 265.9, csb_time: 2.93e-3},
  {nPow: 45, km_max: 300, km_avg: 300.0, km_time: 2.50e-3, csb_max: 316, csb_avg: 300.5, csb_time: 3.47e-3},
  {nPow: 50, km_max: 334, km_avg: 333.3, km_time: 2.97e-3, csb_max: 351, csb_avg: 334.0, csb_time: 4.10e-3},
];

window.EXP_DATA = window.TABLE1.concat(window.TABLE2);

// Table 3 — δ별 근사 결과(논문 표 3 그대로) :contentReference[oaicite:30]{index=30}
window.APPROX = [
  {delta:"1e-1",  pi:"16/5",              e:"8/3",               sqrt2:"3/2",                sqrt5:"7/3"},
  {delta:"1e-2",  pi:"22/7",              e:"19/7",              sqrt2:"17/12",              sqrt5:"29/13"},
  {delta:"1e-3",  pi:"201/64",            e:"87/32",             sqrt2:"41/29",              sqrt5:"38/17"},
  {delta:"1e-4",  pi:"333/106",           e:"193/71",            sqrt2:"99/70",              sqrt5:"161/72"},
  {delta:"1e-5",  pi:"355/113",           e:"1071/394",          sqrt2:"577/408",            sqrt5:"682/305"},
  {delta:"1e-6",  pi:"355/113",           e:"2721/1001",         sqrt2:"1393/985",           sqrt5:"2207/987"},
  {delta:"1e-7",  pi:"75948/24175",       e:"15062/5541",        sqrt2:"3363/2378",          sqrt5:"9349/4181"},
  {delta:"1e-8",  pi:"100798/32085",      e:"23225/8544",        sqrt2:"19601/13860",        sqrt5:"12238/5473"},
  {delta:"1e-9",  pi:"103993/33102",      e:"49171/18089",       sqrt2:"47321/33461",        sqrt5:"51841/23184"},
  {delta:"1e-10", pi:"312689/99532",      e:"419314/154257",     sqrt2:"114243/80782",       sqrt5:"219602/98209"},
  {delta:"1e-11", pi:"833719/265381",     e:"1084483/398959",    sqrt2:"275807/195025",      sqrt5:"710647/317811"},
  {delta:"1e-12", pi:"4272943/1360120",   e:"1084483/398959",    sqrt2:"1607521/1136689",    sqrt5:"3010349/1346269"},
  {delta:"1e-13", pi:"5419351/1725033",   e:"12496140/4597073",  sqrt2:"3880899/2744210",    sqrt5:"3940598/1762289"},
  {delta:"1e-14", pi:"58466453/18610450", e:"28245729/10391023", sqrt2:"9369319/6625109",    sqrt5:"16692641/7465176"},
  {delta:"1e-15", pi:"80143857/25510582", e:"28245729/10391023", sqrt2:"54608393/38613965",  sqrt5:"70711162/31622993"},
];
