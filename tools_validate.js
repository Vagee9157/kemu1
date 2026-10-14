// 题库自检：node tools_validate.js
const fs=require('fs');const vm=require('vm');
const ctx={window:{},console};ctx.window=ctx;vm.createContext(ctx);
const src=['assets/data.js','assets/pics.js','assets/questions2.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n')+'\n;({QUESTIONS,SIGNS,CHAPTERS})';
const R=vm.runInContext(src,ctx);const Q=R.QUESTIONS,S=R.SIGNS,CH=new Set(R.CHAPTERS.map(c=>c.id));
const errs=[],seen=new Map();
Q.forEach((q,i)=>{
  const id=`#${i} ${q.q.slice(0,30)}`;
  if(!CH.has(q.ch))errs.push(`${id}: 章节 ${q.ch} 不存在`);
  if(!q.q||!q.exp)errs.push(`${id}: 题干或解析为空`);
  if(q.type==='judge'){if(typeof q.a!=='boolean')errs.push(`${id}: 判断题答案不是布尔`);}
  else if(q.type==='single'){
    if(!Array.isArray(q.opts)||q.opts.length!==4)errs.push(`${id}: 选项数 ${q.opts&&q.opts.length}`);
    else{ if(new Set(q.opts).size!==4)errs.push(`${id}: 选项重复 ${JSON.stringify(q.opts)}`);
      if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))errs.push(`${id}: 答案下标 ${q.a}`);}
  } else errs.push(`${id}: 未知题型 ${q.type}`);
  if(q.sign&&!S[q.sign])errs.push(`${id}: 图 ${q.sign} 不存在`);
  if(![0,1].includes(q.hot))errs.push(`${id}: hot=${q.hot}`);
  const k=q.q+'|'+(q.sign||'');if(seen.has(k))errs.push(`${id}: 与 #${seen.get(k)} 题干重复`);else seen.set(k,i);
});
const byCh={};Q.forEach(q=>{byCh[q.ch]=byCh[q.ch]||{n:0,hot:0,pic:0};byCh[q.ch].n++;if(q.hot)byCh[q.ch].hot++;if(q.sign)byCh[q.ch].pic++;});
console.log('总题数',Q.length,'高频',Q.filter(q=>q.hot).length,'看图',Q.filter(q=>q.sign).length);
console.table(byCh);
if(errs.length){console.log('问题',errs.length);errs.forEach(e=>console.log(' -',e));process.exit(1);}else console.log('全部通过');
