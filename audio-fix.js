(() => {
  const TARGETS = [
    'S3_04_Radiocomunicacion_durante_los_desplazamientos.mp3',
    'S3_05_Medios_alambricos_durante_los_desplazamientos.mp3'
  ];

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  let ctx = null;
  const connected = new WeakSet();

  function isTarget(audio) {
    const src = audio.currentSrc || audio.getAttribute('src') || '';
    return TARGETS.some(name => src.includes(name));
  }

  function connect(audio) {
    if (!isTarget(audio) || connected.has(audio)) return;

    try {
      if (!ctx) ctx = new AudioCtx();

      const source = ctx.createMediaElementSource(audio);
      const compressor = ctx.createDynamicsCompressor();
      const makeup = ctx.createGain();

      compressor.threshold.value = -38;
      compressor.knee.value = 24;
      compressor.ratio.value = 6;
      compressor.attack.value = 0.008;
      compressor.release.value = 0.32;
      makeup.gain.value = 1.55;

      source.connect(compressor);
      compressor.connect(makeup);
      makeup.connect(ctx.destination);
      connected.add(audio);

      audio.addEventListener('play', () => {
        if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
      });
    } catch (err) {
      console.warn('No se pudo aplicar la nivelación de audio:', err);
    }
  }

  function scan(root = document) {
    root.querySelectorAll?.('audio').forEach(connect);
  }

  function start() {
    scan();
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches?.('audio')) connect(node);
          scan(node);
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();