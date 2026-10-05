const CACHE_NAME = 'promocion-2027-shell-v5';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './audio-fix.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// Compatibilidad para rutas de audio antiguas que quedaron dentro del index.
// Así no es necesario regenerar ni volver a subir ningún MP3.
const AUDIO_ALIASES = {
  'audios_tactico/S1_01_CPEUM.mp3': 'S1_01_CPEUM_bases_constitucionales_para_seguridad_y_guerra.mp3',
  'audios_tactico/S1_02_LOAPF.mp3': 'S1_02_LOAPF_funciones_de_la_SEDENA.mp3',
  'audios_tactico/S1_03_LOEFAM.mp3': 'S1_03_LOEFAM_organizacion_mando_Armas_Servicios_y_Reservas.mp3',
  'audios_tactico/S1_04_LPCNP.mp3': 'S1_04_LPCNP_conservacion_de_la_neutralidad.mp3',
  'audios_tactico/S1_05_Ley_de_Seguridad_Nacional.mp3': 'S1_05_Ley_de_Seguridad_Nacional_concepto_y_amenazas.mp3',
  'audios_tactico/S1_06_LPEAM.mp3': 'S1_06_LPEAM_seguridad_y_soberania_del_espacio_aereo.mp3',
  'audios_tactico/S1_07_LFAFE.mp3': 'S1_07_LFAFE_armas_exclusivas_y_control_en_caso_de_guerra.mp3',
  'audios_tactico/S1_08_Ley_de_Expropiacion.mp3': 'S1_08_Ley_de_Expropiacion_utilidad_publica_y_defensa.mp3',
  'audios_tactico/S1_09_Ley_de_Aviacion_Civil_Requisa.mp3': 'S1_09_Ley_de_Aviacion_Civil_articulo_83_requisa.mp3',
  'audios_tactico/S1_10_Codigo_Penal_Federal.mp3': 'S1_10_Codigo_Penal_Federal_delitos_relevantes_para_el_ambito_militar.mp3',
  'audios_tactico/S1_11_Codigo_de_Justicia_Militar.mp3': 'S1_11_Codigo_de_Justicia_Militar_disciplina_militar_y_fuero_de_guerra.mp3',
  'audios_tactico/S1_12_Derecho_Internacional_Humanitario.mp3': 'S1_12_Derecho_Internacional_Humanitario_finalidad_y_marco_internacional.mp3',
  'audios_tactico/S1_13_Carta_de_las_Naciones_Unidas.mp3': 'S1_13_Carta_de_las_Naciones_Unidas_paz_soberania_y_uso_de_la_fuerza.mp3',
  'audios_tactico/S1_14_Declaracion_Universal_Derechos_Humanos.mp3': 'S1_14_Declaracion_Universal_de_los_Derechos_Humanos.mp3',
  'audios_tactico/S1_15_PIDCP.mp3': 'S1_15_Pacto_Internacional_de_Derechos_Civiles_y_Politicos.mp3',
  'audios_tactico/S1_16_PIDESC.mp3': 'S1_16_Pacto_Internacional_de_Derechos_Economicos_Sociales_y_Culturales.mp3',
  'audios_tactico/S1_17_Convencion_Americana_DH.mp3': 'S1_17_Convencion_Americana_sobre_Derechos_Humanos.mp3',
  'audios_tactico/S1_18_Carta_OEA.mp3': 'S1_18_Carta_de_la_OEA_soberania_paz_y_legitima_defensa.mp3',
  'audios_tactico/S1_19_Convenios_de_Ginebra_1949.mp3': 'S1_19_Convenios_de_Ginebra_de_1949.mp3',
  'audios_tactico/S1_20_Protocolos_Adicionales_Ginebra.mp3': 'S1_20_Protocolos_Adicionales_a_los_Convenios_de_Ginebra.mp3',
  'audios_tactico/S1_21_Derecho_de_La_Haya.mp3': 'audios_tactico/S1_21_Derechos_de_La_Haya_metodos_y_medios_de_combate.mp3',
  'audios_tactico/S1_22_Reglamento_La_Haya_1907.mp3': 'audios_tactico/S1_22_Reglamento_de_La_Haya_de_1907_sobre_guerra_terrestre.mp3',
  'audios_tactico/S1_23_Estatuto_de_Roma_CPI.mp3': 'audios_tactico/S1_23_Estatuto_de_Roma_y_Corte_Penal_Internacional.mp3',
  'audios_tactico/S1_24_Derecho_Operacional_ASJOPER.mp3': 'audios_tactico/S1_24_Derecho_Operacional_ASJOPER_y_marco_juridico_integrado.mp3',
  'audios_tactico/S1_25_Marco_Te_rico_fuentes_doctrinales_y_adaptaci_n.mp3': 'audios_tactico/S1_25_Marco_Teorico_fuentes_doctrinales_y_adaptacion.mp3',
  'audios_tactico/S1_26_Pensamiento_Cr_tico.mp3': 'audios_tactico/S1_26_Pensamiento_Critico.mp3',
  'audios_tactico/S1_30_Arte_Militar_EATOL_Dise_o_Operacional_y_Centro_de_Gravedad.mp3': 'audios_tactico/S1_30_Arte_Militar_EATOL_Diseno_Operacional_y_Centro_de_Gravedad.mp3',
  'audios_tactico/S1_31_Niveles_de_conducci_n_de_las_Operaciones_Militares.mp3': 'audios_tactico/S1_31_Niveles_de_conduccion_de_las_Operaciones_Militares.mp3',
  'audios_tactico/S1_32_Nivel_Estrat_gico.mp3': 'audios_tactico/S1_32_Nivel_Estrategico.mp3',
  'audios_tactico/S1_34_Nivel_T_ctico.mp3': 'audios_tactico/S1_34_Nivel_Tactico.mp3',
  'audios_tactico/S1_35_Relaci_n_entre_los_niveles_Estrat_gico_Operacional_y_T_ctico.mp3': 'audios_tactico/S1_35_Relacion_entre_los_niveles_Estrategico_Operacional_y_Tactico.mp3',
  'audios_tactico/S1_38_Unidad_de_objetivo_y_continuidad_en_la_acci_n.mp3': 'audios_tactico/S1_38_Unidad_de_objetivo_y_continuidad_en_la_accion.mp3',
  'audios_tactico/S1_39_Concentraci_n_y_econom_a_de_fuerzas.mp3': 'audios_tactico/S1_39_Concentracion_y_economia_de_fuerzas.mp3',
  'audios_tactico/S1_42_Coordinaci_n_y_cooperaci_n.mp3': 'audios_tactico/S1_42_Coordinacion_y_cooperacion.mp3',
  'audios_tactico/S1_46_Restricci_n.mp3': 'audios_tactico/S1_46_Restriccion.mp3',
  'audios_tactico/S1_49_Variables_de_la_Misi_n_METT_TC.mp3': 'audios_tactico/S1_49_Variables_de_la_Mision_METT_TC.mp3',
  'audios_tactico/S1_50_Funciones_T_cticas_o_funciones_de_combate.mp3': 'audios_tactico/S1_50_Funciones_Tacticas_o_funciones_de_combate.mp3',
  'audios_tactico/S1_51_Situaciones_T_cticas.mp3': 'audios_tactico/S1_51_Situaciones_Tacticas.mp3',
  'audios_tactico/S1_53_Dominios_del_Entorno_Operacional_P1.mp3': 'audios_tactico/S1_53a_Dominios_del_Entorno_Operacional_Parte_1.mp3',
  'audios_tactico/S1_53_Dominios_del_Entorno_Operacional_P2.mp3': 'audios_tactico/S1_53b_Dominios_del_Entorno_Operacional_Parte_2.mp3',
  'audios_tactico/S1_54_Dimensiones_F_sica_Informativa_y_Humana.mp3': 'audios_tactico/S1_54_Dimensiones_Fisica_Informativa_y_Humana.mp3',
  'audios_tactico/S1_56_Clasificaci_n_de_las_Operaciones_Militares.mp3': 'audios_tactico/S1_56_Clasificacion_de_las_Operaciones_Militares.mp3',
  'audios_tactico/S1_57_Conceptos_b_sicos_de_planeamiento_militar.mp3': 'audios_tactico/S1_57_Conceptos_basicos_de_planeamiento_militar.mp3',
  'audios_tactico/S1_58_Niveles_de_planeamiento_Estrat_gico_Operacional_y_T_ctico.mp3': 'audios_tactico/S1_58_Niveles_de_planeamiento_Estrategico_Operacional_y_Tactico.mp3',
  'audios_tactico/S2_13_Caracteristicas_posibilidades_y_limitaciones_del_Servicio.mp3': 'audios_tactico/S2_13_Caracteristicas_posibilidades_y_limitaciones.mp3',
  'audios_tactico/S3_06_Generalidades_ambientes_operacionales_especificos.mp3': 'audios_tactico/S3_06_Generalidades_de_ambientes_operacionales_especificos.mp3'
};

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});


async function injectAudioFix(response) {
  if (!response) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  const text = await response.text();
  if (text.includes('audio-fix.js')) {
    return new Response(text, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }

  const injected = text.includes('</body>')
    ? text.replace('</body>', '<script src="./audio-fix.js"></script></body>')
    : text + '<script src="./audio-fix.js"></script>';

  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(injected, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const scopeUrl = new URL(self.registration.scope);
  let relativePath = url.pathname;

  if (relativePath.startsWith(scopeUrl.pathname)) {
    relativePath = relativePath.slice(scopeUrl.pathname.length);
  } else {
    relativePath = relativePath.replace(/^\/+/, '');
  }

  const mappedAudio = AUDIO_ALIASES[decodeURIComponent(relativePath)];
  if (mappedAudio) {
    const target = new URL(mappedAudio, self.registration.scope);
    event.respondWith(fetch(new Request(target.href, req)));
    return;
  }

  // Do not pre-cache or retain the large audio library automatically.
  // Audio streams continue to come from GitHub when the user plays them.
  if (/\.(mp3|m4a|wav|ogg)(\?.*)?$/i.test(url.pathname)) return;

  // Navigation/app shell: cached response immediately, refresh cache in background.
  if (req.mode === 'navigate' || url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req, {ignoreSearch:true});
      const networkPromise = fetch(req).then(response => {
        if (response && response.ok && response.type === 'basic') {
          cache.put(req, response.clone());
        }
        return response;
      }).catch(() => null);

      if (cached) {
        event.waitUntil(networkPromise);
        return injectAudioFix(cached.clone());
      }
      const network = await networkPromise;
      if (network) return injectAudioFix(network.clone());
      const fallback = await cache.match('./index.html');
      return fallback ? injectAudioFix(fallback.clone()) : Response.error();
    })());
  }
});
