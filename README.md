
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>3D Pro Dice</title>
    <style>
        :root {
            --bg-color: #0f172a; 
            --dice-color: #ef4444;
            --glass: rgba(255, 255, 255, 0.1);
            --ios-border: rgba(255, 255, 255, 0.1);
            --text-color: #ffffff;
        }

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; outline: none; }

        body {
            margin: 0;
            background-color: var(--bg-color);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            height: 100vh;
            width: 100vw;
            overflow: hidden; /* Kaydırmayı engelle, uygulama hissi ver */
            color: var(--text-color);
        }

        /* --- ANA KAYDIRICI (SLIDER) --- */
        .main-view {
            display: flex;
            width: 200vw; /* İki ekran yan yana */
            height: 100vh;
            transition: transform 0.5s cubic-bezier(0.6, 0.01, 0.1, 1);
        }

        .section {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            padding-bottom: 100px; /* Alt bar için boşluk */
        }

        /* --- ZAR ALANI --- */
        #dice-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 25px;
            width: 100%;
            margin-top: +30%;
    
        }

        .scene { width: 110px; height: 110px; perspective: 1000px; }
        .cube {
            width: 100%; height: 100%; position: relative;
            transform-style: preserve-3d;
            transform: rotateX(-20deg) rotateY(20deg);
            transition: transform 1.3s cubic-bezier(0.15, 0.85, 0.35, 1.2);
        }
        .cube__face {
            position: absolute; width: 110px; height: 110px;
            background: var(--dice-color);
            border: 1px solid rgba(255,255,255,0.2);
            display: flex; align-items: center; justify-content: center;
            font-size: 40px; font-weight: bold; color: white;
            border-radius: 22px;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.2), 0 0 15px var(--dice-color);
        }
        .face-1 { transform: rotateY(0deg) translateZ(55px); }
        .face-2 { transform: rotateY(180deg) translateZ(55px); }
        .face-3 { transform: rotateY(90deg) translateZ(55px); }
        .face-4 { transform: rotateY(-90deg) translateZ(55px); }
        .face-5 { transform: rotateX(90deg) translateZ(55px); }
        .face-6 { transform: rotateX(-90deg) translateZ(55px); }

        /* --- TAM EKRAN AYARLAR --- */
        .settings-content {
            width: 100%;
            max-width: 450px;
            height: 100%;
            overflow-y: auto;
            padding-top: 40px;
        }

        .settings-group {
            background: var(--glass);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            margin-bottom: 20px;
            border: 1px solid var(--ios-border);
        }

        .setting-row {
            padding: 18px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .color-grid { display: flex; gap: 12px; }
        .color-dot { width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; cursor: pointer; }
        .selected { transform: scale(1.2); box-shadow: 0 0 15px white; }

        /* --- ALT BAR (STİCKY BOTTOM) --- */
        .bottom-nav {
            position: fixed;
            bottom: 25px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 320px;
            height: 70px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-radius: 35px;
            display: flex;
            align-items: center;
            padding: 5px;
            border: 1px solid rgba(255,255,255,0.1);
            z-index: 9999;
        }

        .nav-indicator {
            position: absolute;
            height: 60px;
            width: calc(50% - 5px);
            background: rgba(255,255,255,0.2);
            border-radius: 30px;
            transition: transform 0.4s cubic-bezier(0.6, 0.01, 0.1, 1);
        }

        .nav-item {
            flex: 1;
            text-align: center;
            font-weight: 700;
            color: rgba(255,255,255,0.4);
            cursor: pointer;
            z-index: 10;
            font-size: 15px;
            letter-spacing: 1px;
        }

        .nav-item.active { color: #fff; }

        select, input[type="range"] { 
            background: none; border: none; color: white; font-weight: 600; font-size: 16px;
        }
        option { background: #1e293b; color: white; }
    </style>
</head>
<body onclick="handleGlobalClick(event)">

    <div class="main-view" id="mainSlider">
        <div class="section" id="dice-section">
            <div id="dice-wrapper"></div>
            <p style="margin-top: 40px; opacity: 0.3; font-size: 14px;">ZAR ATMAK İÇİN DOKUN</p>
        </div>

        <div class="section" id="settings-section">
            <div class="settings-content" onclick="event.stopPropagation()">
                <h2 id="txt-settings" style="margin-left: 10px;">Ayarlar</h2>
                
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
                    <div class="setting-row"><span id="txt-volume">Ses Seviyesi</span><input type="range" style="width: 100px;"></div>
                    <div class="setting-row"><span id="txt-vibration">Titreşim</span><input type="checkbox" id="vibrate-toggle" checked></div>
                </div>

                <div class="settings-group">
                    <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:12px;">
                        <span id="txt-dice-color">Zar Rengi</span>
                        <div class="color-grid" id="diceColors">
                            <div class="color-dot" style="background:#ef4444" onclick="setDiceCol('#ef4444', this)"></div>
                            <div class="color-dot" style="background:#22c55e" onclick="setDiceCol('#22c55e', this)"></div>
                            <div class="color-dot" style="background:#3b82f6" onclick="setDiceCol('#3b82f6', this)"></div>
                            <div class="color-dot" style="background:#eab308" onclick="setDiceCol('#eab308', this)"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="bottom-nav" onclick="event.stopPropagation()">
        <div class="nav-indicator" id="indicator"></div>
        <div class="nav-item active" id="n1" onclick="go(0, 'n1')">ZAR</div>
        <div class="nav-item" id="n2" onclick="go(-100, 'n2')">AYARLAR</div>
    </div>

    <script>
        let currentSection = 'dice';
        let rollCount = 0;

        function go(pos, id) {
            document.getElementById('mainSlider').style.transform = `translateX(${pos}vw)`;
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            
            const ind = document.getElementById('indicator');
            ind.style.transform = (id === 'n1') ? 'translateX(0px)' : 'translateX(100%)';
            
            currentSection = (id === 'n1') ? 'dice' : 'settings';
        }

        function handleGlobalClick() {
            if(currentSection === 'dice') rollDice();
        }

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
                cube.style.transform = `rotateX(${x + (rollCount * 1440)}deg) rotateY(${y + (rollCount * 1440)}deg)`;
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
            document.querySelectorAll('#diceColors .color-dot').forEach(d => d.classList.remove('selected'));
            el.classList.add('selected');
        }

        initDices();
    </script>
</body>
</html>
