
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>3D Pro Dice - Hey Ceminay</title>
    <style>
        :root {
            --bg-color: #f0f2f5; 
            --dice-color: #00ff88;
            --glass: rgba(255, 255, 255, 0.45);
            --ios-border: rgba(255, 255, 255, 0.3);
            --sel-dice-glow: #00ff88;
            --sel-bg-glow: #aaa;
        }

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; outline: none; }

        body {
            margin: 0;
            background-color: var(--bg-color);
            font-family: -apple-system, system-ui, sans-serif;
            height: 100vh;
            overflow: hidden;
            transition: background 0.8s ease;
        }

        .main-container {
            display: flex;
            width: 200%;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.6, 0.01, 0.1, 1);
        }

        .section {
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center; /* ZARLARI DİKEYDE TAM MERKEZE ALAN KOD */
            padding: 20px;
        }

        /* --- 3D ZAR MEKANİZMASI --- */
        #dice-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: +30%;
        }

        .scene {
            width: 100px;
            height: 100px;
            perspective: 1000px;
        }

        .cube {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transform: rotateX(-20deg) rotateY(20deg);
            transition: transform 1.3s cubic-bezier(0.15, 0.85, 0.35, 1.2);
        }

        .cube__face {
            position: absolute;
            width: 100px;
            height: 100px;
            background: var(--dice-color);
            border: 1px solid rgba(255,255,255,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 35px;
            font-weight: bold;
            color: white;
            border-radius: 20px;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.1), 0 0 8px var(--dice-color);
        }

        .face-1 { transform: rotateY(0deg) translateZ(50px); }
        .face-2 { transform: rotateY(180deg) translateZ(50px); }
        .face-3 { transform: rotateY(90deg) translateZ(50px); }
        .face-4 { transform: rotateY(-90deg) translateZ(50px); }
        .face-5 { transform: rotateX(90deg) translateZ(50px); }
        .face-6 { transform: rotateX(-90deg) translateZ(50px); }

        /* --- AYARLAR PANELI --- */
        .settings-card {
            background: var(--glass);
            backdrop-filter: blur(30px) saturate(190%);
            -webkit-backdrop-filter: blur(30px) saturate(190%);
            border: 1px solid var(--ios-border);
            border-radius: 30px;
            width: 100%;
            max-width: 380px;
            padding: 20px;
        }

        .settings-group {
            background: rgba(255, 255, 255, 0.25);
            border-radius: 12px;
            margin-bottom: 12px;
            overflow: hidden;
        }

        .setting-row {
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 0.5px solid rgba(0,0,0,0.05);
            font-size: 14px;
        }

        .color-grid { display: flex; gap: 10px; padding: 5px 0; }
        .color-dot { width: 26px; height: 26px; border-radius: 50%; border: 2.5px solid white; cursor: pointer; transition: 0.3s; }
        
        .dice-dot.selected { transform: scale(1.2); box-shadow: 0 0 12px var(--sel-dice-glow); animation: glow-dice 1.5s infinite alternate; }
        .bg-dot.selected { transform: scale(1.2); box-shadow: 0 0 12px var(--sel-bg-glow); animation: glow-bg 1.5s infinite alternate; }

        @keyframes glow-dice { from { box-shadow: 0 0 2px var(--sel-dice-glow); } to { box-shadow: 0 0 15px var(--sel-dice-glow); } }
        @keyframes glow-bg { from { box-shadow: 0 0 2px var(--sel-bg-glow); } to { box-shadow: 0 0 15px var(--sel-bg-glow); } }

        /* --- ALT BAR --- */
        .nav-container {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 240px;
            height: 60px;
            background: var(--glass);
            backdrop-filter: blur(25px);
            border-radius: 30px;
            display: flex;
            border: 1px solid var(--ios-border);
            padding: 5px;
            z-index: 1000;
        }

        .nav-indicator {
            position: absolute;
            height: 50px;
            width: 110px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 25px;
            transition: transform 0.4s cubic-bezier(0.6, 0.01, 0.1, 1);
        }

        .nav-item { flex: 1; text-align: center; font-weight: 700; color: rgba(0,0,0,0.3); cursor: pointer; z-index: 1002; line-height: 50px; }
        .nav-item.active { color: #000; }

        select { background: none; border: none; font-weight: 600; font-family: inherit; }
        input[type="range"] { accent-color: #007aff; }
    </style>
</head>
<body onclick="handleGlobalClick(event)">

    <div class="main-container" id="slider">
        <div class="section">
            <div id="dice-wrapper"></div>
        </div>

        <div class="section">
            <div class="settings-card" onclick="event.stopPropagation()">
                <h3 id="txt-settings" style="margin: 0 0 15px 5px;">Ayarlar</h3>
                
                <div class="settings-group">
                    <div class="setting-row">
                        <span id="txt-dice-count">Zar Sayısı</span>
                        <select id="count" onchange="initDices()">
                            <option value="1">1</option><option value="2" selected>2</option><option value="3">3</option>
                        </select>
                    </div>
                    <div class="setting-row">
                        <span id="txt-lang">Dil</span>
                        <select id="lang-select" onchange="changeLang()">
                            <option value="tr">Türkçe</option><option value="en">English</option><option value="de">Deutsch</option><option value="fr">Français</option><option value="es">Español</option>
                        </select>
                    </div>
                </div>

                <div class="settings-group">
                    <div class="setting-row"><span id="txt-volume">Ses Seviyesi</span><input type="range" style="width: 80px;"></div>
                    <div class="setting-row"><span id="txt-vibration">Titreşim</span><input type="checkbox" id="vibrate-toggle" checked></div>
                </div>

                <div class="settings-group">
                    <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:8px;">
                        <span id="txt-dice-color">Zar Rengi (Neon)</span>
                        <div class="color-grid" id="diceColors">
                            <div class="color-dot dice-dot selected" style="background:#00ff88" onclick="setDiceCol('#00ff88', this)"></div>
                            <div class="color-dot dice-dot" style="background:#00d9ff" onclick="setDiceCol('#00d9ff', this)"></div>
                            <div class="color-dot dice-dot" style="background:#ff0077" onclick="setDiceCol('#ff0077', this)"></div>
                            <div class="color-dot dice-dot" style="background:#ccff00" onclick="setDiceCol('#ccff00', this)"></div>
                            <div class="color-dot dice-dot" style="background:#ff9900" onclick="setDiceCol('#ff9900', this)"></div>
                        </div>
                    </div>
                    <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:8px;">
                        <span id="txt-bg-color">Arka Plan (Pastel)</span>
                        <div class="color-grid" id="bgColors">
                            <div class="color-dot bg-dot selected" style="background:#f0f2f5" onclick="setBgCol('#f0f2f5', this, '#aaa')"></div>
                            <div class="color-dot bg-dot" style="background:#e3f2fd" onclick="setBgCol('#e3f2fd', this, '#90caf9')"></div>
                            <div class="color-dot bg-dot" style="background:#f1f8e9" onclick="setBgCol('#f1f8e9', this, '#a5d6a7')"></div>
                            <div class="color-dot bg-dot" style="background:#fff3e0" onclick="setBgCol('#fff3e0', this, '#ffcc80')"></div>
                            <div class="color-dot bg-dot" style="background:#fce4ec" onclick="setBgCol('#fce4ec', this, '#f48fb1')"></div>
                        </div>
                    </div>
                </div>

                <div style="text-align: center;"><small id="txt-privacy" style="opacity:0.5; font-size: 11px; cursor: pointer;">Gizlilik Politikası</small></div>
            </div>
        </div>
    </div>

    <div class="nav-container" onclick="event.stopPropagation()">
        <div class="nav-indicator" id="indicator"></div>
        <div class="nav-item active" id="n1" onclick="go(0, 'n1')">ZAR</div>
        <div class="nav-item" id="n2" onclick="go(-50, 'n2')">AYARLAR</div>
    </div>

    <script>
        let currentSection = 'dice';
        let rollCount = 0;
        const langData = {
            tr: { settings: "Ayarlar", diceCount: "Zar Sayısı", lang: "Dil", volume: "Ses Seviyesi", vibration: "Titreşim", diceColor: "Zar Rengi (Neon)", bgColor: "Arka Plan (Pastel)", privacy: "Gizlilik Politikası", navDice: "ZAR", navSets: "AYARLAR" },
            en: { settings: "Settings", diceCount: "Dice Count", lang: "Language", volume: "Volume", vibration: "Vibration", diceColor: "Dice Color (Neon)", bgColor: "Background (Pastel)", privacy: "Privacy Policy", navDice: "DICE", navSets: "SETTINGS" },
            de: { settings: "Einstellungen", diceCount: "Anzahl", lang: "Sprache", volume: "Lautstärke", vibration: "Vibration", diceColor: "Würfelfarbe", bgColor: "Hintergrund", privacy: "Datenschutz", navDice: "WÜRFEL", navSets: "SETUP" },
            fr: { settings: "Paramètres", diceCount: "Nombre", lang: "Langue", volume: "Volume", vibration: "Vibration", diceColor: "Couleur", bgColor: "Fond", privacy: "Confidentialité", navDice: "DÉS", navSets: "AJUSTES" },
            es: { settings: "Ajustes", diceCount: "Cantidad", lang: "Idioma", volume: "Volumen", vibration: "Vibración", diceColor: "Color", bgColor: "Fondo", privacy: "Privacidad", navDice: "DADOS", navSets: "AJUSTES" }
        };

        function changeLang() {
            const l = document.getElementById('lang-select').value;
            const d = langData[l];
            document.getElementById('txt-settings').innerText = d.settings;
            document.getElementById('txt-dice-count').innerText = d.diceCount;
            document.getElementById('txt-lang').innerText = d.lang;
            document.getElementById('txt-volume').innerText = d.volume;
            document.getElementById('txt-vibration').innerText = d.vibration;
            document.getElementById('txt-dice-color').innerText = d.diceColor;
            document.getElementById('txt-bg-color').innerText = d.bgColor;
            document.getElementById('txt-privacy').innerText = d.privacy;
            document.getElementById('n1').innerText = d.navDice;
            document.getElementById('n2').innerText = d.navSets;
        }

        function go(pos, id) {
            document.getElementById('slider').style.transform = `translateX(${pos}%)`;
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            document.getElementById('indicator').style.transform = (id === 'n1') ? 'translateX(0px)' : 'translateX(120px)';
            currentSection = (id === 'n1') ? 'dice' : 'settings';
        }

        function handleGlobalClick() { if(currentSection === 'dice') rollDice(); }

        function rollDice() {
            rollCount++;
            document.querySelectorAll('.cube').forEach(cube => {
                const face = Math.floor(Math.random() * 6) + 1;
                let x = 0, y = 0;
                switch(face) {
                    case 1: x = 0; y = 0; break;
                    case 2: x = 0; y = 180; break;
                    case 3: x = 0; y = -90; break;
                    case 4: x = 0; y = 90; break;
                    case 5: x = -90; y = 0; break;
                    case 6: x = 90; y = 0; break;
                }
                const extra = 1440 + (rollCount * 360); 
                cube.style.transform = `rotateX(${x + extra}deg) rotateY(${y + extra}deg)`;
                if(document.getElementById('vibrate-toggle').checked && navigator.vibrate) navigator.vibrate(50);
            });
        }

        function initDices() {
            const count = document.getElementById('count').value;
            const wrap = document.getElementById('dice-wrapper');
            wrap.innerHTML = '';
            for(let i=0; i<count; i++) {
                wrap.innerHTML += `<div class="scene"><div class="cube"><div class="cube__face face-1">1</div><div class="cube__face face-2">6</div><div class="cube__face face-3">3</div><div class="cube__face face-4">4</div><div class="cube__face face-5">5</div><div class="cube__face face-6">2</div></div></div>`;
            }
        }

        function setDiceCol(color, el) {
            document.documentElement.style.setProperty('--dice-color', color);
            document.documentElement.style.setProperty('--sel-dice-glow', color);
            document.querySelectorAll('#diceColors .dice-dot').forEach(d => d.classList.remove('selected'));
            el.classList.add('selected');
        }

        function setBgCol(color, el, glow) {
            document.documentElement.style.setProperty('--bg-color', color);
            document.documentElement.style.setProperty('--sel-bg-glow', glow);
            document.querySelectorAll('#bgColors .bg-dot').forEach(d => d.classList.remove('selected'));
            el.classList.add('selected');
        }
        initDices();
    </script>
</body>
</html>
