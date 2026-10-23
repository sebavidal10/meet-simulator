// Paleta de colores oficial de avatares de Google
const GOOGLE_AVATAR_COLORS = [
  '#1a73e8', // Blue
  '#d93025', // Red
  '#188038', // Green
  '#e37400', // Orange
  '#9334e6', // Purple
  '#007b83', // Teal
  '#c2185b', // Pink
  '#5c6bc0', // Indigo
  '#00897b', // Cyan-Teal
  '#6d4c41', // Brown
  '#7cb342', // Light Green
  '#f4511e'  // Deep Orange
];

// Estado inicial del simulador
const state = {
  meetingCode: 'abc-defg-hij',
  customTime: '', // Si está vacío, usa el reloj real del sistema
  searchQuery: '',
  activeDrawer: null, // 'panelPeople' | 'panelChat' | 'panelDetails' | 'panelActivities' | 'panelHost' | null
  localMicMuted: true,
  localCamMuted: true,
  localCaptions: false,
  localHandRaised: false,
  participants: [
    { id: '1', name: 'Sebastián Vidal', muted: false, speaking: true, handRaised: false, isHost: true },
    { id: '2', name: 'María Fernanda Gómez', muted: true, speaking: false, handRaised: false, isHost: false },
    { id: '3', name: 'Carlos Andrés Rodríguez', muted: true, speaking: false, handRaised: false, isHost: false },
    { id: '4', name: 'Lucía Martínez', muted: true, speaking: false, handRaised: false, isHost: false },
    { id: '5', name: 'Diego Alejandro Torres', muted: true, speaking: false, handRaised: false, isHost: false },
    { id: '6', name: 'Valentina Herrera', muted: true, speaking: false, handRaised: false, isHost: false }
  ]
};

// Referencias del DOM
const participantGrid = document.getElementById('participantGrid');
const stageContainer = document.getElementById('stageContainer');
const footerPeopleBadge = document.getElementById('footerPeopleBadge');
const drawerPeopleCount = document.getElementById('drawerPeopleCount');
const drawerPeopleList = document.getElementById('drawerPeopleList');
const searchPeopleInput = document.getElementById('searchPeopleInput');
const sideDrawer = document.getElementById('sideDrawer');
const meetingTimeEl = document.getElementById('meetingTime');
const meetingCodeEl = document.getElementById('meetingCode');
const detailsMeetingUrl = document.getElementById('detailsMeetingUrl');

// Botones de la barra inferior
const micGroup = document.getElementById('micGroup');
const micBtn = document.getElementById('micBtn');
const micIcon = document.getElementById('micIcon');
const camGroup = document.getElementById('camGroup');
const camBtn = document.getElementById('camBtn');
const camIcon = document.getElementById('camIcon');
const ccBtn = document.getElementById('ccBtn');
const reactionsBtn = document.getElementById('reactionsBtn');
const reactionsBar = document.getElementById('reactionsBar');
const presentBtn = document.getElementById('presentBtn');
const presentMenu = document.getElementById('presentMenu');
const handBtn = document.getElementById('handBtn');
const moreOptionsBtn = document.getElementById('moreOptionsBtn');
const moreOptionsMenu = document.getElementById('moreOptionsMenu');

// Formularios y Modal
const toggleAddPeopleBtn = document.getElementById('toggleAddPeopleBtn');
const addPersonForm = document.getElementById('addPersonForm');
const newPersonInput = document.getElementById('newPersonInput');
const bulkModalBackdrop = document.getElementById('bulkModalBackdrop');
const openBulkModalBtn = document.getElementById('openBulkModalBtn');
const openSettingsFromMenuBtn = document.getElementById('openSettingsFromMenuBtn');
const meetingInfoTrigger = document.getElementById('meetingInfoTrigger');
const closeBulkModalBtn = document.getElementById('closeBulkModalBtn');
const cancelBulkModalBtn = document.getElementById('cancelBulkModalBtn');
const saveBulkModalBtn = document.getElementById('saveBulkModalBtn');
const configCodeInput = document.getElementById('configCodeInput');
const configTimeInput = document.getElementById('configTimeInput');
const bulkParticipantsTextarea = document.getElementById('bulkParticipantsTextarea');

// =========================================
// UTILIDADES: INICIALES Y COLORES
// =========================================
function getInitials(fullName) {
  const clean = (fullName || '').trim().replace(/[*!]+$/, '').trim();
  if (!clean) return '?';
  const parts = clean.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name) {
  let hash = 0;
  const clean = (name || '').trim().toLowerCase();
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GOOGLE_AVATAR_COLORS.length;
  return GOOGLE_AVATAR_COLORS[index];
}

// =========================================
// ALGORITMO DE GRILLA DINÁMICA (ESTILO MEET)
// =========================================
function computeGridLayout(count) {
  if (count <= 1) return { cols: 1, rows: 1, avatarSize: 112, fontSize: 42 };
  if (count === 2) return { cols: 2, rows: 1, avatarSize: 100, fontSize: 38 };
  if (count <= 4) return { cols: 2, rows: 2, avatarSize: 88, fontSize: 32 };
  if (count <= 6) return { cols: 3, rows: 2, avatarSize: 80, fontSize: 28 };
  if (count <= 9) return { cols: 3, rows: 3, avatarSize: 72, fontSize: 26 };
  if (count <= 12) return { cols: 4, rows: 3, avatarSize: 64, fontSize: 23 };
  if (count <= 16) return { cols: 4, rows: 4, avatarSize: 58, fontSize: 20 };
  if (count <= 20) return { cols: 5, rows: 4, avatarSize: 52, fontSize: 18 };
  if (count <= 25) return { cols: 5, rows: 5, avatarSize: 48, fontSize: 16 };
  const cols = Math.ceil(Math.sqrt(count * 1.3));
  const rows = Math.ceil(count / cols);
  return { cols, rows, avatarSize: 44, fontSize: 15 };
}

// =========================================
// RENDERIZADO PRINCIPAL
// =========================================
function renderAll() {
  renderGrid();
  renderPeopleDrawer();
  renderFooterInfo();
  syncLocalControlsWithFirstParticipant();
}

function renderGrid() {
  const count = state.participants.length;
  const { cols, rows, avatarSize, fontSize } = computeGridLayout(count);

  participantGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  participantGrid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;

  // Si es 1 solo participante, limitar un poco el ancho máximo como en Meet
  if (count === 1) {
    participantGrid.style.maxWidth = '1120px';
    participantGrid.style.maxHeight = '760px';
  } else {
    participantGrid.style.maxWidth = '100%';
    participantGrid.style.maxHeight = '100%';
  }

  participantGrid.innerHTML = '';

  state.participants.forEach((p, idx) => {
    const tile = document.createElement('div');
    tile.className = `participant-tile${!p.muted && p.speaking ? ' is-speaking' : ''}`;
    tile.title = 'Clic: Alternar micrófono/hablando | Shift+Clic: Levantar mano';

    const initials = getInitials(p.name);
    const color = getAvatarColor(p.name);

    // Badge superior derecho (micrófono apagado o barras de voz)
    let topRightBadgeHTML = '';
    if (p.muted) {
      topRightBadgeHTML = `
        <div class="mic-status-badge" title="Micrófono desactivado">
          <span class="material-symbols-outlined">mic_off</span>
        </div>
      `;
    } else if (p.speaking) {
      topRightBadgeHTML = `
        <div class="mic-status-badge speaking-wave" title="Hablando">
          <div class="voice-bars">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
    }

    // Mano levantada en esquina inferior izquierda
    const handHTML = p.handRaised
      ? `<div class="hand-raised-pill"><span class="material-symbols-outlined">back_hand</span></div>`
      : '';

    tile.innerHTML = `
      <div class="tile-top-right">
        ${topRightBadgeHTML}
      </div>

      <div class="tile-avatar" style="width:${avatarSize}px; height:${avatarSize}px; font-size:${fontSize}px; background-color:${color};">
        ${initials}
      </div>

      <div class="tile-hover-overlay">
        <div class="tile-hover-pill">
          <span class="material-symbols-outlined">keep</span>
          <span class="material-symbols-outlined">${p.muted ? 'mic_off' : 'mic'}</span>
          <span class="material-symbols-outlined">more_vert</span>
        </div>
      </div>

      <div class="tile-bottom-left">
        ${handHTML}
        <span class="participant-name">${escapeHtml(p.name)}</span>
      </div>
    `;

    // Interacción al hacer clic sobre la tarjeta
    tile.addEventListener('click', (e) => {
      if (e.shiftKey) {
        p.handRaised = !p.handRaised;
        if (idx === 0) state.localHandRaised = p.handRaised;
      } else {
        if (p.muted) {
          p.muted = false;
          p.speaking = true;
        } else {
          p.muted = true;
          p.speaking = false;
        }
        if (idx === 0) state.localMicMuted = p.muted;
      }
      renderAll();
    });

    participantGrid.appendChild(tile);
  });
}

function renderPeopleDrawer() {
  const total = state.participants.length;
  footerPeopleBadge.textContent = total;
  drawerPeopleCount.textContent = total;

  const q = state.searchQuery.trim().toLowerCase();
  const filtered = state.participants.filter((p) => p.name.toLowerCase().includes(q));

  drawerPeopleList.innerHTML = '';

  filtered.forEach((p, index) => {
    const row = document.createElement('div');
    row.className = 'person-row';

    const initials = getInitials(p.name);
    const color = getAvatarColor(p.name);
    const isFirst = state.participants[0] && state.participants[0].id === p.id;

    let micStatusIcon = '';
    if (p.muted) {
      micStatusIcon = `<span class="material-symbols-outlined" style="font-size:20px; color:#5f6368;">mic_off</span>`;
    } else {
      micStatusIcon = `<span class="material-symbols-outlined" style="font-size:20px; color:#1a73e8;">mic</span>`;
    }

    row.innerHTML = `
      <div class="person-row-left">
        <div class="person-mini-avatar" style="background-color:${color};">${initials}</div>
        <div class="person-info">
          <div class="person-name-label">${escapeHtml(p.name)}${isFirst ? ' (Tú)' : ''}</div>
          ${p.isHost ? '<div class="person-role-sub">Organizador de la reunión</div>' : ''}
        </div>
      </div>
      <div class="person-row-right">
        <button class="person-icon-btn toggle-mic-row-btn" title="Alternar micrófono">
          ${micStatusIcon}
        </button>
        <button class="person-icon-btn delete-person-btn" title="Quitar participante">
          <span class="material-symbols-outlined" style="font-size:18px;">close</span>
        </button>
        <button class="person-icon-btn" title="Más acciones">
          <span class="material-symbols-outlined" style="font-size:20px;">more_vert</span>
        </button>
      </div>
    `;

    row.querySelector('.toggle-mic-row-btn').addEventListener('click', () => {
      p.muted = !p.muted;
      p.speaking = !p.muted;
      renderAll();
    });

    row.querySelector('.delete-person-btn').addEventListener('click', () => {
      if (state.participants.length <= 1) return;
      state.participants = state.participants.filter((item) => item.id !== p.id);
      renderAll();
    });

    drawerPeopleList.appendChild(row);
  });
}

function renderFooterInfo() {
  meetingCodeEl.textContent = state.meetingCode;
  document.title = `Meet - ${state.meetingCode}`;
  detailsMeetingUrl.textContent = `https://meet.google.com/${state.meetingCode}`;
  updateClockDisplay();
}

function syncLocalControlsWithFirstParticipant() {
  const first = state.participants[0];
  if (first) {
    state.localMicMuted = first.muted;
    state.localHandRaised = first.handRaised;
  }

  // Mic button visual state
  if (state.localMicMuted) {
    micGroup.classList.add('is-muted');
    micBtn.classList.add('is-muted');
    micIcon.textContent = 'mic_off';
  } else {
    micGroup.classList.remove('is-muted');
    micBtn.classList.remove('is-muted');
    micIcon.textContent = 'mic';
  }

  // Hand button visual state
  if (state.localHandRaised) {
    handBtn.classList.add('is-active');
  } else {
    handBtn.classList.remove('is-active');
  }
}

// =========================================
// RELOJ EN TIEMPO REAL O PERSONALIZADO
// =========================================
function updateClockDisplay() {
  if (state.customTime.trim()) {
    meetingTimeEl.textContent = state.customTime.trim();
    return;
  }
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  meetingTimeEl.textContent = `${hours}:${mins}`;
}
setInterval(updateClockDisplay, 10000);

// =========================================
// CONTROLES DE LA BARRA INFERIOR Y PANELES
// =========================================
micBtn.addEventListener('click', () => {
  state.localMicMuted = !state.localMicMuted;
  if (state.participants[0]) {
    state.participants[0].muted = state.localMicMuted;
    state.participants[0].speaking = !state.localMicMuted;
  }
  renderAll();
});

camBtn.addEventListener('click', () => {
  state.localCamMuted = !state.localCamMuted;
  if (state.localCamMuted) {
    camGroup.classList.add('is-muted');
    camBtn.classList.add('is-muted');
    camIcon.textContent = 'videocam_off';
  } else {
    camGroup.classList.remove('is-muted');
    camBtn.classList.remove('is-muted');
    camIcon.textContent = 'videocam';
  }
});

ccBtn.addEventListener('click', () => {
  state.localCaptions = !state.localCaptions;
  ccBtn.classList.toggle('is-active', state.localCaptions);
});

handBtn.addEventListener('click', () => {
  state.localHandRaised = !state.localHandRaised;
  if (state.participants[0]) {
    state.participants[0].handRaised = state.localHandRaised;
  }
  renderAll();
});

reactionsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isHidden = reactionsBar.classList.contains('hidden');
  closeAllPopups();
  if (isHidden) {
    reactionsBar.classList.remove('hidden');
    reactionsBtn.classList.add('is-active');
  }
});

document.querySelectorAll('.reaction-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const emoji = btn.getAttribute('data-emoji');
    spawnFloatingEmoji(emoji);
  });
});

function spawnFloatingEmoji(emoji) {
  const el = document.createElement('div');
  el.className = 'floating-emoji';
  el.textContent = emoji;
  el.style.left = `${36 + Math.random() * 120}px`;
  stageContainer.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

presentBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isHidden = presentMenu.classList.contains('hidden');
  closeAllPopups();
  if (isHidden) {
    presentMenu.classList.remove('hidden');
    presentBtn.classList.add('is-active');
  }
});

moreOptionsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isHidden = moreOptionsMenu.classList.contains('hidden');
  closeAllPopups();
  if (isHidden) {
    moreOptionsMenu.classList.remove('hidden');
    moreOptionsBtn.classList.add('is-active');
  }
});

function closeAllPopups() {
  moreOptionsMenu.classList.add('hidden');
  presentMenu.classList.add('hidden');
  reactionsBar.classList.add('hidden');
  moreOptionsBtn.classList.remove('is-active');
  presentBtn.classList.remove('is-active');
  reactionsBtn.classList.remove('is-active');
}

document.addEventListener('click', () => {
  closeAllPopups();
});

// Pantalla completa desde el menú de 3 puntos
document.getElementById('fullscreenMenuBtn').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
});

// =========================================
// DRAWER DERECHO (PERSONAS, CHAT, DETALLES...)
// =========================================
const sideToggleBtns = document.querySelectorAll('.side-toggle-btn');
const drawerPanels = document.querySelectorAll('.drawer-panel');

sideToggleBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetPanelId = btn.getAttribute('data-drawer');
    if (state.activeDrawer === targetPanelId) {
      closeDrawer();
    } else {
      openDrawer(targetPanelId);
    }
  });
});

document.querySelectorAll('[data-close-drawer]').forEach((btn) => {
  btn.addEventListener('click', closeDrawer);
});

function openDrawer(panelId) {
  state.activeDrawer = panelId;
  sideDrawer.classList.remove('hidden');

  drawerPanels.forEach((p) => {
    p.classList.toggle('hidden', p.id !== panelId);
  });

  sideToggleBtns.forEach((btn) => {
    btn.classList.toggle('is-active', btn.getAttribute('data-drawer') === panelId);
  });
}

function closeDrawer() {
  state.activeDrawer = null;
  sideDrawer.classList.add('hidden');
  sideToggleBtns.forEach((btn) => btn.classList.remove('is-active'));
}

// =========================================
// GESTIÓN DE PARTICIPANTES (INLINE Y MODAL)
// =========================================
toggleAddPeopleBtn.addEventListener('click', () => {
  addPersonForm.classList.toggle('hidden');
  if (!addPersonForm.classList.contains('hidden')) {
    newPersonInput.focus();
  }
});

addPersonForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const raw = newPersonInput.value.trim();
  if (!raw) return;

  // Permite añadir varios separados por coma
  const names = raw.split(',').map((s) => s.trim()).filter(Boolean);
  names.forEach((rawName) => {
    const parsed = parseParticipantLine(rawName, false);
    state.participants.push(parsed);
  });

  newPersonInput.value = '';
  renderAll();
});

searchPeopleInput.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  renderPeopleDrawer();
});

// Chat simulado por si el usuario escribe un mensaje para la captura
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessagesList = document.getElementById('chatMessagesList');

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  const sender = state.participants[0] ? state.participants[0].name : 'Tú';
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg-item';
  msgEl.innerHTML = `
    <div class="chat-msg-meta"><strong>${escapeHtml(sender)}</strong> ${timeStr}</div>
    <div class="chat-msg-text">${escapeHtml(text)}</div>
  `;
  chatMessagesList.appendChild(msgEl);
  chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
  chatInput.value = '';
});

// =========================================
// MODAL DE EDICIÓN MASIVA Y CONFIGURACIÓN
// =========================================
function openBulkModal() {
  configCodeInput.value = state.meetingCode;
  configTimeInput.value = state.customTime;

  const lines = state.participants.map((p) => {
    let suffix = '';
    if (!p.muted && p.speaking) suffix += ' *';
    if (p.handRaised) suffix += ' !';
    return `${p.name}${suffix}`;
  });
  bulkParticipantsTextarea.value = lines.join('\n');

  bulkModalBackdrop.classList.remove('hidden');
  bulkParticipantsTextarea.focus();
}

function closeBulkModal() {
  bulkModalBackdrop.classList.add('hidden');
}

function parseParticipantLine(line, isFirst) {
  let clean = line.trim();
  let speaking = false;
  let muted = true;
  let handRaised = false;

  // Detectar modificadores opcionales al final (* para micrófono activo/hablando, ! para mano levantada)
  while (clean.endsWith('*') || clean.endsWith('!')) {
    if (clean.endsWith('*')) {
      speaking = true;
      muted = false;
      clean = clean.slice(0, -1).trim();
    } else if (clean.endsWith('!')) {
      handRaised = true;
      clean = clean.slice(0, -1).trim();
    }
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: clean || 'Participante',
    muted,
    speaking,
    handRaised,
    isHost: Boolean(isFirst)
  };
}

openBulkModalBtn.addEventListener('click', openBulkModal);
openSettingsFromMenuBtn.addEventListener('click', openBulkModal);
meetingInfoTrigger.addEventListener('click', openBulkModal);
closeBulkModalBtn.addEventListener('click', closeBulkModal);
cancelBulkModalBtn.addEventListener('click', closeBulkModal);

saveBulkModalBtn.addEventListener('click', () => {
  const newCode = configCodeInput.value.trim() || 'abc-defg-hij';
  state.meetingCode = newCode;
  state.customTime = configTimeInput.value.trim();

  const rawLines = bulkParticipantsTextarea.value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (rawLines.length > 0) {
    state.participants = rawLines.map((line, idx) => parseParticipantLine(line, idx === 0));
  }

  closeBulkModal();
  renderAll();
});

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !bulkModalBackdrop.classList.contains('hidden')) {
    closeBulkModal();
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Inicializar pantalla
renderAll();
