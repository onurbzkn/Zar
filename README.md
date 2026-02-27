
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Zar</title>
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
            width: 100vw;
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
            align-items: center; /* Dikeyde tam orta */
            justify-content: center; /* Yatayda tam orta */
            flex-direction: column;
            position: relative;
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
            transform: rotateX(0deg) rotateY(0deg);
            transition: transform 1.2s cubic-bezier(0.15, 0.85, 0.35, 1.2);
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

        /* --- AYARLAR KARTI --- */
        .settings-card {
            background: var(--glass);
            backdrop-filter: blur(30px) saturate(190%);
            -webkit-backdrop-filter: blur(30px) saturate(190%);
            border: 1px solid var(--ios-border);
            border-radius: 30px;
            width: 90%;
            max-width: 380px;
            padding: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.05);
        }

        .settings-group {
            background: rgba(255, 255, 255, 0.25);
            border-radius: 12px;
            margin-bottom: 12px;
            overflow: hidden;
        }

        .setting-row {
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 0.5px solid rgba(0,0,0,0.05);
            font-size: 14px;
        }

        .color-grid { display: flex; gap: 10px; padding: 5px 0; }
        .color-dot { width: 26px; height: 26px; border-radius: 50%; border: 2.5px solid white; cursor: pointer; transition: 0.3s; }
        
        .selected { transform: scale(1.2); animation: glow-ani 1.5s infinite alternate; }
        @keyframes glow-ani { from { box-shadow: 0 0 2px white; } to { box-shadow: 0 0 15px white; } }

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
            background: rgba(255, 255, 255, 0.7);
            border-radius: 25px;
            transition: transform 0.4s cubic-bezier(0.6, 0.01, 0.1, 1);
        }

        .nav-item { flex: 1; text-align: center; font-weight: 700; color: rgba(0,0,0,0.3); cursor: pointer; z-index: 1002; line-height: 50px; }
        .nav-item.active { color: #000; }

        select { background: none; border: none; font-weight: 600; font-family: inherit; }
    </style>
</head>
<body onclick="handleGlobalClick(event)">

    <div class="main-container" id="slider">
        <div class="section">
            <div id="dice-wrapper">
                </div>
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
                            <option value="tr">Türkçe</option><option value="en">English</option>
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
                            <div class="color-dot d-dot selected" style="background:#00ff88" onclick="setDiceCol('#00ff88', this)"></div>
                            <div class="color-dot d-dot" style="background:#00d9ff" onclick="setDiceCol('#00d9ff', this)"></div>
                            <div class="color-dot d-dot" style="background:#ff0077" onclick="setDiceCol('#ff0077', this)"></div>
                            <div class="color-dot d-dot" style="background:#ff9900" onclick="setDiceCol('#ff9900', this)"></div>
                        </div>
                    </div>
                    <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:8px;">
                        <span id="txt-bg-color">Arka Plan (Pastel)</span>
                        <div class="color-grid" id="bgColors">
                            <div class="color-dot b-dot selected" style="background:#f0f2f5" onclick="setBgCol('#f0f2f5', this)"></div>
                            <div class="color-dot b-dot" style="background:#e3f2fd" onclick="setBgCol('#e3f2fd', this)"></div>
                            <div class="color-dot b-dot" style="background:#f1f8e9" onclick="setBgCol('#f1f8e9', this)"></div>
                            <div class="color-dot b-dot" style="background:#fce4ec" onclick="setBgCol('#fce4ec', this)"></div>
                        </div>
                    </div>
                </div>

                <div style="text-align: center;"><small id="txt-privacy" style="opacity:0.5; cursor: pointer;">Gizlilik Politikası</small></div>
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

        function go(pos, id) {
            document.getElementById('slider').style.transform = `translateX(${pos}%)`;
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            document.getElementById('indicator').style.transform = (id === 'n1') ? 'translateX(0px)' : 'translateX(120px)';
            currentSection = (id === 'n1') ? 'dice' : 'settings';
        }

        function handleGlobalClick() { if(currentSection === 'dice') rollDice(); }

        function rollDice() {
            rollCount++; // Her seferinde açıyı artırarak efektin tazeliğini koruyoruz
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
                const extra = 720 + (rollCount * 360); 
                cube.style.transform = `rotateX(${x + extra}deg) rotateY(${y + extra}deg)`;
            });
            if(document.getElementById('vibrate-toggle').checked && navigator.vibrate) navigator.vibrate(40);
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
            document.querySelectorAll('.d-dot').forEach(d => d.classList.remove('selected'));
            el.classList.add('selected');
        }

        function setBgCol(color, el) {
            document.documentElement.style.setProperty('--bg-color', color);
            document.querySelectorAll('.b-dot').forEach(d => d.classList.remove('selected'));
            el.classList.add('selected');
        }

        initDices();
    </script>
</body>
</html>
