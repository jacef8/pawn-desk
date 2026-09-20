/* A QR code, drawn on the desk screen, so a phone can be switched on by
 * pointing at it instead of typing a Railway address and a token on a phone
 * keyboard. Byte mode, error level M, versions 1-10 - far more than the two
 * short lines this carries.
 *
 * Written out rather than pulled from a CDN: this page works with no signal,
 * and a script tag to somebody else's server is one more thing that can be
 * down, changed, or watching. Every matrix it produces was compared module
 * by module against the reference encoder before it shipped.
 */
(function(g){
  /* ---- GF(256) for Reed-Solomon ---- */
  const EXP=new Uint8Array(512), LOG=new Uint8Array(256);
  for(let i=0,x=1;i<255;i++){ EXP[i]=x; LOG[x]=i; x<<=1; if(x&256)x^=0x11d; }
  for(let i=255;i<512;i++)EXP[i]=EXP[i-255];
  const mul=(a,b)=>(a&&b)?EXP[LOG[a]+LOG[b]]:0;
  function rsPoly(n){ let p=[1];
    for(let i=0;i<n;i++){ const q=[...p,0];
      for(let j=0;j<p.length;j++)q[j+1]^=mul(p[j],EXP[i]);
      p=q; }
    return p; }
  function rsEnc(data,n){ const gen=rsPoly(n), res=new Array(n).fill(0);
    for(const d of data){ const f=d^res[0]; res.shift(); res.push(0);
      if(f)for(let i=0;i<n;i++)res[i]^=mul(gen[i+1],f); }
    return res; }

  /* Per version, error level M: [total codewords, ec per block, blocks
     group1, data per block g1, blocks g2, data per block g2] */
  const V={
   1:[26,10,1,16,0,0],   2:[44,16,1,28,0,0],   3:[70,26,1,44,0,0],
   4:[100,18,2,32,0,0],  5:[134,24,2,43,0,0],  6:[172,16,4,27,0,0],
   7:[196,18,4,31,0,0],  8:[242,22,2,38,2,39], 9:[292,22,3,36,2,37],
   10:[346,26,4,43,1,44]};
  const ALIGN={1:[],2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34],
               7:[6,22,38],8:[6,24,42],9:[6,26,46],10:[6,28,50]};

  const dataCap=v=>{ const [,ec,b1,d1,b2,d2]=V[v]; return b1*d1+b2*d2; };

  function encode(text){
    const bytes=[]; for(const ch of unescape(encodeURIComponent(text)))bytes.push(ch.charCodeAt(0));
    let ver=0;
    for(let v=1;v<=10;v++){ const need=4+(v<10?8:16)+bytes.length*8;
      if(need<=dataCap(v)*8){ ver=v; break; } }
    if(!ver)throw new Error("too long for a QR this size");

    /* ---- bit stream ---- */
    const bits=[];
    const put=(val,len)=>{ for(let i=len-1;i>=0;i--)bits.push((val>>i)&1); };
    put(4,4);                                   /* byte mode */
    put(bytes.length, ver<10?8:16);
    bytes.forEach(b=>put(b,8));
    const cap=dataCap(ver)*8;
    for(let i=0;i<4&&bits.length<cap;i++)bits.push(0);   /* terminator */
    while(bits.length%8)bits.push(0);
    const pad=[0xEC,0x11]; let p=0;
    const dc=[]; for(let i=0;i<bits.length;i+=8){ let b=0; for(let j=0;j<8;j++)b=(b<<1)|bits[i+j]; dc.push(b); }
    while(dc.length<dataCap(ver))dc.push(pad[p++%2]);

    /* ---- split into blocks, error-correct, interleave ---- */
    const [,ecLen,b1,d1,b2,d2]=V[ver];
    const blocks=[], ecs=[]; let at=0;
    for(let i=0;i<b1;i++){ const b=dc.slice(at,at+d1); at+=d1; blocks.push(b); ecs.push(rsEnc(b,ecLen)); }
    for(let i=0;i<b2;i++){ const b=dc.slice(at,at+d2); at+=d2; blocks.push(b); ecs.push(rsEnc(b,ecLen)); }
    const out=[], maxD=Math.max(d1,d2||0);
    for(let i=0;i<maxD;i++)blocks.forEach(b=>{ if(i<b.length)out.push(b[i]); });
    for(let i=0;i<ecLen;i++)ecs.forEach(b=>out.push(b[i]));

    /* ---- lay it out ---- */
    const n=17+ver*4;
    const m=Array.from({length:n},()=>new Array(n).fill(null));
    const set=(r,c,v)=>{ if(r>=0&&r<n&&c>=0&&c<n)m[r][c]=v; };
    const finder=(r,c)=>{ for(let i=-1;i<=7;i++)for(let j=-1;j<=7;j++){
      const rr=r+i, cc=c+j; if(rr<0||rr>=n||cc<0||cc>=n)continue;
      const on=(i>=0&&i<=6&&(j===0||j===6))||(j>=0&&j<=6&&(i===0||i===6))||(i>=2&&i<=4&&j>=2&&j<=4);
      set(rr,cc,on?1:0); }; };
    finder(0,0); finder(0,n-7); finder(n-7,0);
    for(const a of ALIGN[ver])for(const b of ALIGN[ver]){
      if((a<8&&b<8)||(a<8&&b>n-9)||(a>n-9&&b<8))continue;
      for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++)
        set(a+i,b+j,(Math.abs(i)===2||Math.abs(j)===2||(i===0&&j===0))?1:0); }
    for(let i=8;i<n-8;i++){ if(m[6][i]===null)set(6,i,i%2?0:1); if(m[i][6]===null)set(i,6,i%2?0:1); }
    set(n-8,8,1);                                /* dark module */
    /* Version 7 and up carry their version number twice, in a 6x3 block by
       each of the far finders. Leaving it out is invisible on small codes
       and breaks every larger one. */
    if(ver>=7){ const vb=verBits(ver);
      for(let i=0;i<18;i++){ const b=(vb>>i)&1;
        set(Math.floor(i/3), n-11+(i%3), b);
        set(n-11+(i%3), Math.floor(i/3), b); } }
    /* format-info squares are reserved now, written after masking */
    const fmtCells=[];
    for(let i=0;i<=5;i++)fmtCells.push([8,i],[i,8]);
    fmtCells.push([8,7],[8,8],[7,8],[8,n-8],[8,n-7],[8,n-6],[8,n-5],[8,n-4],[8,n-3],[8,n-2],[8,n-1],
                  [n-1,8],[n-2,8],[n-3,8],[n-4,8],[n-5,8],[n-6,8],[n-7,8]);
    fmtCells.forEach(([r,c])=>{ if(m[r][c]===null)m[r][c]="F"; });

    /* ---- data, up the zigzag ---- */
    let bi=0, up=true;
    const bitAt=k=>(out[k>>3]>>(7-(k&7)))&1;
    for(let c=n-1;c>0;c-=2){ if(c===6)c--;
      for(let k=0;k<n;k++){ const r=up?n-1-k:k;
        for(const cc of [c,c-1]) if(m[r][cc]===null){
          m[r][cc]=bi<out.length*8?bitAt(bi):0; bi++; } }
      up=!up; }

    /* ---- pick the mask the standard's way: lowest penalty ---- */
    const MASK=[ (r,c)=>(r+c)%2===0, (r,c)=>r%2===0, (r,c)=>c%3===0,
                 (r,c)=>(r+c)%3===0, (r,c)=>(((r/2)|0)+((c/3)|0))%2===0,
                 (r,c)=>((r*c)%2)+((r*c)%3)===0, (r,c)=>((((r*c)%2)+((r*c)%3))%2)===0,
                 (r,c)=>((((r+c)%2)+((r*c)%3))%2)===0 ];
    const FMT=[0x5412,0x5125,0x5E7C,0x5B4B,0x45F9,0x40CE,0x4F97,0x4AA0]; /* level M, masks 0-7 */
    let best=null;
    const force=(typeof g.QR_FORCE_MASK==="number")?g.QR_FORCE_MASK:-1;
    for(let mk=0;mk<8;mk++){
      if(force>=0&&mk!==force)continue;
      const t=m.map(row=>row.slice());
      for(let r=0;r<n;r++)for(let c=0;c<n;c++)
        if(t[r][c]!=="F"&&!isFunction(r,c,ver,n)&&MASK[mk](r,c))t[r][c]^=1;
      const f=FMT[mk];
      for(let i=0;i<15;i++){ const bit=(f>>(14-i))&1;
        if(i<6)          { t[8][i]=bit;    t[n-1-i][8]=bit; }
        else if(i===6)   { t[8][7]=bit;    t[n-1-i][8]=bit; }
        else if(i===7)   { t[8][8]=bit;    t[8][n-8]=bit; }
        else if(i===8)   { t[7][8]=bit;    t[8][n-8+1]=bit; }
        else             { t[14-i][8]=bit; t[8][n-15+i]=bit; } }
      const pen=penalty(t,n);
      if(!best||pen<best.pen)best={pen,t};
    }
    return best.t.map(r=>r.map(v=>v===1?1:0));

    function isFunction(r,c,ver,n){
      if(r<9&&c<9)return true;
      if(r<9&&c>=n-8)return true;
      if(r>=n-8&&c<9)return true;
      if(r===6||c===6)return true;
      if(ver>=7){ if(r<6&&c>=n-11&&c<n-8)return true;
                  if(c<6&&r>=n-11&&r<n-8)return true; }
      for(const a of ALIGN[ver])for(const b of ALIGN[ver]){
        if((a<8&&b<8)||(a<8&&b>n-9)||(a>n-9&&b<8))continue;
        if(Math.abs(r-a)<=2&&Math.abs(c-b)<=2)return true; }
      return false; }
  }

  /* 6 bits of version, 12 of BCH(18,6), generator 0x1F25. */
  function verBits(v){ let d=v<<12;
    for(let i=17;i>=12;i--) if((d>>i)&1) d^=0x1F25<<(i-12);
    return (v<<12)|d; }

  function penalty(t,n){
    let p=0;
    const at=(r,c)=>t[r][c]===1?1:0;
    for(let r=0;r<n;r++){ let run=1;
      for(let c=1;c<n;c++){ if(at(r,c)===at(r,c-1))run++; else { if(run>=5)p+=run-2; run=1; } }
      if(run>=5)p+=run-2; }
    for(let c=0;c<n;c++){ let run=1;
      for(let r=1;r<n;r++){ if(at(r,c)===at(r-1,c))run++; else { if(run>=5)p+=run-2; run=1; } }
      if(run>=5)p+=run-2; }
    for(let r=0;r<n-1;r++)for(let c=0;c<n-1;c++){
      const v=at(r,c); if(v===at(r,c+1)&&v===at(r+1,c)&&v===at(r+1,c+1))p+=3; }
    const PAT=[1,0,1,1,1,0,1,0,0,0,0], PAT2=[0,0,0,0,1,0,1,1,1,0,1];
    const hit=a=>{ let k=0;
      for(let i=0;i+11<=a.length;i++){
        if(PAT.every((v,j)=>a[i+j]===v))k++;
        if(PAT2.every((v,j)=>a[i+j]===v))k++; }
      return k; };
    for(let r=0;r<n;r++)p+=40*hit(t[r].map(v=>v===1?1:0));
    for(let c=0;c<n;c++)p+=40*hit(t.map(row=>row[c]===1?1:0));
    let dark=0; for(let r=0;r<n;r++)for(let c=0;c<n;c++)dark+=at(r,c);
    p+=10*Math.floor(Math.abs(dark*100/(n*n)-50)/5);
    return p; }

  /* An <svg> string, because it stays sharp at any size and needs no canvas. */
  g.qrSVG=function(text,px){
    const m=encode(text), n=m.length, q=4, side=n+q*2, s=(px||220)/side;
    let d="";
    for(let r=0;r<n;r++)for(let c=0;c<n;c++)
      if(m[r][c])d+="M"+((c+q)*s)+" "+((r+q)*s)+"h"+s+"v"+s+"h"+(-s)+"z";
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+(px||220)+'" height="'+(px||220)+
           '" viewBox="0 0 '+(px||220)+' '+(px||220)+'" shape-rendering="crispEdges">'+
           '<rect width="100%" height="100%" fill="#fff"/><path fill="#000" d="'+d+'"/></svg>'; };
  g.qrMatrix=encode;
})(typeof window!=="undefined"?window:globalThis);
