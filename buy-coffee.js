(function () {

  // =========================
  // DTVERSE SUPPORT WIDGET
  // =========================

  const PAYPAL_LINK = "https://www.paypal.me/tiwaridevendra";
  const UPI_ID = "tiwaridevendraa@ybl";
  const UPI_NAME = "DTverse";

  // SOCIALS
  const WEBSITE = "https://dtverseofficial.netlify.app";
  const GITHUB = "https://github.com/dtverseofficial";
  const TELEGRAM = "https://t.me/dtverse";
  const INSTAGRAM = "https://instagram.com/devvv.ir";

  const upiLink =
    `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR`;

  // =========================
  // STYLE
  // =========================

  const style = document.createElement("style");

  style.textContent = `

    .dt-coffee-wrap{
      position:fixed;
      right:18px;
      bottom:18px;
      z-index:99999;
      display:flex;
      align-items:center;
      gap:8px;
    }

    .dt-coffee-btn,
    .dt-coffee-hide,
    .dt-coffee-option,
    .dt-socials a{

      border:1px solid rgba(255,255,255,.16);

      background:rgba(255,255,255,.08);

      backdrop-filter:blur(18px);
      -webkit-backdrop-filter:blur(18px);

      box-shadow:
        0 8px 32px rgba(0,0,0,.25),
        inset 0 1px 1px rgba(255,255,255,.08);

      transition:.25s ease;
    }

    .dt-coffee-btn{
      color:white;
      padding:12px 16px;
      border-radius:999px;
      font:600 14px system-ui,sans-serif;
      cursor:pointer;
    }

    .dt-coffee-hide{
      width:30px;
      height:30px;
      border-radius:50%;
      color:white;
      cursor:pointer;
      font-size:18px;
      line-height:1;
    }

    .dt-coffee-btn:hover,
    .dt-coffee-hide:hover,
    .dt-coffee-option:hover,
    .dt-socials a:hover{
      transform:translateY(-2px);
      background:rgba(255,255,255,.14);
    }

    .dt-coffee-overlay{
      position:fixed;
      inset:0;
      z-index:99998;

      display:none;
      place-items:center;

      background:rgba(0,0,0,.5);

      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);
    }

    .dt-coffee-overlay.show{
      display:grid;
    }

    .dt-coffee-card{

      width:min(92vw,360px);

      padding:24px;

      border-radius:24px;

      background:rgba(17,24,39,.72);

      border:1px solid rgba(255,255,255,.12);

      backdrop-filter:blur(22px);
      -webkit-backdrop-filter:blur(22px);

      box-shadow:
        0 20px 80px rgba(0,0,0,.45),
        inset 0 1px 1px rgba(255,255,255,.08);

      text-align:center;

      color:white;

      font-family:system-ui,sans-serif;
    }

    .dt-coffee-card h2{
      margin:0 0 8px;
      font-size:24px;
      font-weight:800;
    }

    .dt-coffee-card p{
      margin:0 0 18px;
      color:#cbd5e1;
      font-size:14px;
      line-height:1.5;
    }

    .dt-coffee-option{

      width:100%;

      margin:8px 0;

      padding:14px;

      border-radius:16px;

      color:white;

      font-size:15px;
      font-weight:700;

      cursor:pointer;
    }

    .dt-socials{

      margin-top:18px;

      display:flex;
      justify-content:center;
      gap:12px;
    }

    .dt-socials a{

      width:44px;
      height:44px;

      border-radius:50%;

      display:flex;
      align-items:center;
      justify-content:center;

      text-decoration:none;
    }

    .dt-socials a svg{
      width:20px;
      height:20px;
      fill:white;
    }

    .dt-close{

      margin-top:14px;

      background:none;
      border:none;

      color:#94a3b8;

      cursor:pointer;

      font-size:14px;
    }

    @media(max-width:500px){

      .dt-coffee-wrap{
        right:12px;
        bottom:14px;
      }

      .dt-coffee-btn{
        padding:11px 14px;
        font-size:13px;
      }

    }

  `;

  document.head.appendChild(style);

  // =========================
  // FLOATING BUTTON
  // =========================

  const wrap = document.createElement("div");
  wrap.className = "dt-coffee-wrap";

  const btn = document.createElement("button");
  btn.className = "dt-coffee-btn";
  btn.innerHTML = "☕ Buy me a coffee";

  const hideBtn = document.createElement("button");
  hideBtn.className = "dt-coffee-hide";
  hideBtn.innerHTML = "×";

  wrap.appendChild(hideBtn);
  wrap.appendChild(btn);

  document.body.appendChild(wrap);

  // =========================
  // OVERLAY
  // =========================

  const overlay = document.createElement("div");
  overlay.className = "dt-coffee-overlay";

  overlay.innerHTML = `

    <div class="dt-coffee-card">

      <h2>Support DTverse ☕</h2>

      <p>
        If my projects helped you,
        you can support DTverse here.
      </p>

      <button class="dt-coffee-option" id="dtPaypalBtn">
        PayPal
      </button>

      <button class="dt-coffee-option" id="dtUpiBtn">
        UPI
      </button>

      <div class="dt-socials">

        <!-- WEBSITE -->
        <a href="${WEBSITE}" target="_blank" title="Website">

          <svg viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.92 9h-3.05a15.7 15.7 0 00-1.38-5.03A8.02 8.02 0 0118.92 11zM12 4c1.15 1.58 1.96 3.94 2.13 7H9.87C10.04 7.94 10.85 5.58 12 4zM4.08 13h3.05a15.7 15.7 0 001.38 5.03A8.02 8.02 0 014.08 13zm3.05-2H4.08a8.02 8.02 0 014.43-5.03A15.7 15.7 0 007.13 11zm4.87 9c-1.15-1.58-1.96-3.94-2.13-7h4.26c-.17 3.06-.98 5.42-2.13 7zm2.49-1.97A15.7 15.7 0 0015.87 13h3.05a8.02 8.02 0 01-4.43 5.03z"/>
          </svg>

        </a>

        <!-- GITHUB -->
        <a href="${GITHUB}" target="_blank" title="GitHub">

          <svg viewBox="0 0 24 24">
            <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.24c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.06 1.81 2.79 1.29 3.47.99.11-.77.42-1.29.76-1.58-2.67-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.61-5.48 5.91.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.82.58A12 12 0 0012 .5z"/>
          </svg>

        </a>

        <!-- TELEGRAM -->
        <a href="${TELEGRAM}" target="_blank" title="Telegram">

          <svg viewBox="0 0 24 24">
            <path d="M9.04 15.47l-.38 5.35c.54 0 .78-.23 1.07-.5l2.56-2.44 5.3 3.88c.97.54 1.65.26 1.91-.9l3.46-16.2h.01c.31-1.45-.52-2.02-1.47-1.67L1.5 10.64c-1.4.55-1.38 1.33-.24 1.68l5.1 1.59L18.2 6.5c.56-.37 1.07-.17.65.2"/>
          </svg>

        </a>

        <!-- INSTAGRAM -->
        <a href="${INSTAGRAM}" target="_blank" title="Instagram">

          <svg viewBox="0 0 24 24">
            <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3zm11.5 1a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
          </svg>

        </a>

      </div>

      <button class="dt-close" id="dtCloseCoffee">
        Close
      </button>

    </div>

  `;

  document.body.appendChild(overlay);

  // =========================
  // EVENTS
  // =========================

  btn.onclick = () => {
    overlay.classList.add("show");
  };

  hideBtn.onclick = () => {
    wrap.style.display = "none";
    overlay.classList.remove("show");
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("show");
    }
  };

  document.getElementById("dtCloseCoffee").onclick = () => {
    overlay.classList.remove("show");
  };

  document.getElementById("dtPaypalBtn").onclick = () => {
    window.open(PAYPAL_LINK, "_blank");
  };

  document.getElementById("dtUpiBtn").onclick = () => {
    window.location.href = upiLink;
  };

})();