/* Descargas de audiolibros: ZIP por materia + descarga individual.
   ZIP sin compresión adicional (MP3 ya está comprimido); no requiere servicios externos. */
(() => {
  'use strict';
  const encoder = new TextEncoder();
  const crcTable = new Uint32Array(256);
  for (let n=0;n<256;n++) {
    let c=n;
    for(let k=0;k<8;k++) c=(c&1) ? (0xEDB88320^(c>>>1)) : (c>>>1);
    crcTable[n]=c>>>0;
  }
  function crc32(bytes) {
    let c=0xFFFFFFFF;
    for(let i=0;i<bytes.length;i++) c=crcTable[(c^bytes[i])&255]^(c>>>8);
    return (c^0xFFFFFFFF)>>>0;
  }
  function put16(v,n,o) { v.setUint16(o,n,true); }
  function put32(v,n,o) { v.setUint32(o,n>>>0,true); }
  function cleanName(s) {
    return (s||'audio').replace(/[\\/:*?"<>|]/g,'_').replace(/[\u0000-\u001f]/g,'').trim();
  }
  function getCards() {
    if(typeof currentAudioSubject!=='function' || typeof selectedAudioCardsInOrder!=='function') return [];
    return selectedAudioCardsInOrder(currentAudioSubject()).filter(card => {
      const audio=card.querySelector('audio[src], audio source[src]');
      return audio && (audio.getAttribute('src') || audio.querySelector('source')?.getAttribute('src'));
    });
  }
  function srcFor(card) {
    const audio=card.querySelector('audio');
    return audio?.getAttribute('src') || audio?.querySelector('source[src]')?.getAttribute('src') || '';
  }
  function downloadBlob(blob,filename) {
    const url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }
  async function getFile(src) {
    const res=await fetch(new URL(src, document.baseURI).href,{credentials:'same-origin'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    return new Uint8Array(await res.arrayBuffer());
  }
  function zipStore(files) {
    const parts=[], central=[];
    let offset=0, centralSize=0;
    for(const file of files) {
      const name=encoder.encode(file.name);
      const bytes=file.bytes;
      const crc=crc32(bytes), size=bytes.byteLength;
      if(size>0xFFFFFFFF || offset+size>0xFFFFFFFF) throw new Error('El ZIP supera 4 GB.');
      const local=new Uint8Array(30+name.length), a=new DataView(local.buffer);
      put32(a,0x04034b50,0);put16(a,20,4);put16(a,0x0800,6);put16(a,0,8);
      put32(a,crc,14);put32(a,size,18);put32(a,size,22);put16(a,name.length,26);
      local.set(name,30);parts.push(local,bytes);
      const entry=new Uint8Array(46+name.length), v=new DataView(entry.buffer);
      put32(v,0x02014b50,0);put16(v,20,4);put16(v,20,6);put16(v,0x0800,8);
      put32(v,crc,16);put32(v,size,20);put32(v,size,24);put16(v,name.length,28);
      put32(v,offset,42);entry.set(name,46);central.push(entry);
      offset+=local.byteLength+size;centralSize+=entry.byteLength;
    }
    if(files.length>65535 || offset+centralSize>0xFFFFFFFF) throw new Error('Demasiados archivos para un ZIP.');
    const end=new Uint8Array(22), v=new DataView(end.buffer);
    put32(v,0x06054b50,0);put16(v,files.length,8);put16(v,files.length,10);
    put32(v,centralSize,12);put32(v,offset,16);
    return new Blob([...parts,...central,end],{type:'application/zip'});
  }
  function subjectName() {
    const names={tactico:'Tactico',ge:'Guerra_Electronica',mom:'MOM',malomi:'MALOMI',aspectos:'Aspectos_Tecnicos',disciplina:'Disciplina'};
    return names[typeof currentAudioSubject==='function' ? currentAudioSubject() : 'tactico']||'Audiolibros';
  }
  function setMessage(message) {
    const el=document.getElementById('zipDownloadStatus');
    if(el) el.textContent=message;
  }
  async function saveOne(card,button) {
    const src=srcFor(card);
    if(!src) return;
    button.disabled=true;
    try {
      const bytes=await getFile(src);
      const name=cleanName(decodeURIComponent(new URL(src,document.baseURI).pathname.split('/').pop()) || 'audio.mp3');
      downloadBlob(new Blob([bytes],{type:'audio/mpeg'}),name);
    } catch(err) {
      alert('No se pudo descargar este audio: '+err.message);
    } finally { button.disabled=false; }
  }
  function installIndividualButtons(){
    document.querySelectorAll('#audioScreen .audio-card').forEach(card=>{
      if(card.querySelector('.audio-download-one') || !srcFor(card)) return;
      const audio=card.querySelector('audio');
      if(!audio) return;
      const btn=document.createElement('button');
      btn.type='button';btn.className='audio-download-one';
      btn.textContent='↓ Descargar individual';
      btn.title='Descargar solamente este archivo MP3';
      btn.addEventListener('click',()=>saveOne(card,btn));
      audio.insertAdjacentElement('afterend',btn);
    });
  }
  async function saveZip(button) {
    const cards=getCards();
    if(!cards.length) {setMessage('Selecciona al menos un audio disponible de la materia.');return;}
    button.disabled=true;
    const files=[], failed=[], used=new Set();
    try {
      for(let i=0;i<cards.length;i++){
        const src=srcFor(cards[i]);
        setMessage('Preparando '+(i+1)+' de '+cards.length+' archivos…');
        try{
          const bytes=await getFile(src);
          let filename=cleanName(decodeURIComponent(new URL(src,document.baseURI).pathname.split('/').pop())||'audio_'+(i+1)+'.mp3');
          if(!/\.[a-z0-9]{2,5}$/i.test(filename)) filename+='.mp3';
          const original=filename;let j=2;
          while(used.has(filename.toLowerCase())){
            const dot=original.lastIndexOf('.');
            filename=original.slice(0,dot)+'_'+j++ +original.slice(dot);
          }
          used.add(filename.toLowerCase());
          files.push({name:filename,bytes});
        }catch(err){failed.push((cards[i].dataset.audioTitle||src)+': '+err.message);}
      }
      if(!files.length) throw new Error('No fue posible obtener los archivos seleccionados.');
      setMessage('Creando ZIP de '+files.length+' archivos…');
      const blob=zipStore(files);
      downloadBlob(blob,subjectName()+'_Audios_Seleccionados.zip');
      setMessage('ZIP descargado: '+files.length+' archivo(s).'+(failed.length?' No se pudieron incluir '+failed.length+'.':''));
      if(failed.length) console.warn('Audios omitidos en ZIP:',failed);
    }catch(err){
      setMessage('Error: '+err.message);
      alert('No se pudo generar el ZIP: '+err.message);
    }finally{button.disabled=false;}
  }
  function install() {
    const toolbar=document.querySelector('#audioScreen .audio-toolbar');
    if(!toolbar || document.getElementById('downloadSelectedZip')) return;
    const btn=document.createElement('button');
    btn.type='button';btn.id='downloadSelectedZip';btn.className='primary';
    btn.textContent='↓ Descargar seleccionados (ZIP)';
    btn.title='Descarga los audios marcados de la materia actual en un único archivo ZIP';
    btn.addEventListener('click',()=>saveZip(btn));
    toolbar.appendChild(btn);
    const status=document.createElement('div');
    status.id='zipDownloadStatus';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    status.style.cssText='font-size:12px;color:#64748b;grid-column:1/-1;';
    status.textContent='El ZIP incluirá únicamente los audios seleccionados y disponibles de esta materia.';
    toolbar.insertAdjacentElement('afterend',status);
    installIndividualButtons();
    const style=document.createElement('style');
    style.textContent='#downloadSelectedZip{white-space:normal}.audio-download-one{display:inline-block;margin-top:7px;padding:6px 10px;font-size:12px;background:#fff;color:#1f4f76;border:1px solid #b7cbdc;border-radius:8px;cursor:pointer}.audio-download-one:disabled,#downloadSelectedZip:disabled{opacity:.55;cursor:wait}@media(max-width:650px){#downloadSelectedZip{width:100%}}';
    document.head.appendChild(style);
    const obs=new MutationObserver(()=>installIndividualButtons());
    obs.observe(document.getElementById('audioScreen'),{subtree:true,childList:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
/* Acceso independiente al juego MOM. No altera reproductores ni descargas. */
(() => {
  function addGameButton() {
    if (document.getElementById('momGameNavButton')) return;
    const link = document.createElement('a');
    link.id = 'momGameNavButton';
    link.href = 'juego-mom.html';
    link.textContent = '🎮 Juego';
    link.title = 'Completa definiciones del MOM en tres modalidades';
    link.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 16px;border-radius:10px;background:#157658;color:white;font-weight:700;text-decoration:none;margin:8px;box-shadow:0 2px 7px #0002;z-index:5;';
    const nav = document.querySelector('header nav, .main-nav, .top-nav, .nav-tabs, .tabs, header, .app-header, #homeScreen, main');
    if (nav) nav.prepend(link); else document.body.prepend(link);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addGameButton, { once:true });
  else addGameButton();
})();
