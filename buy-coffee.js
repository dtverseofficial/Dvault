(function () {

  // =========================
  // DTVERSE SUPPORT WIDGET
  // =========================

  const PAYPAL_LINK = "https://www.paypal.me/tiwaridevendra";
  const UPI_ID = "tiwaridevendraa@ybl";
  const UPI_NAME = "DTverse";

  const WEBSITE = "https://dtverseofficial.netlify.app";
  const GITHUB = "https://github.com/dtverseofficial";
  const TELEGRAM = "https://t.me/dtverse";
  const INSTAGRAM = "https://instagram.com/devvv.ir";

  const QR_IMAGE_URL =
    "https://res.cloudinary.com/duwpxpod6/image/upload/f_auto,q_auto/DTverse_UPI_i4wms8";

  // =========================
  // TOAST
  // =========================

  function showToast(msg) {
    const t = document.createElement("div");

    t.textContent = msg;

    t.style.cssText = `
      position:fixed;
      bottom:90px;
      right:18px;
      background:#111827;
      color:#fff;
      padding:10px 14px;
      border-radius:10px;
      font:600 13px system-ui;
      z-index:999999;
      box-shadow:0 10px 30px rgba(0,0,0,.3);
      opacity:0;
      transform:translateY(10px);
      transition:.25s ease;
    `;

    document.body.appendChild(t);

    requestAnimationFrame(() => {
      t.style.opacity = "1";
      t.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateY(10px)";
      setTimeout(() => t.remove(), 300);
    }, 2200);
  }

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
      box-shadow:0 8px 32px rgba(0,0,0,.25),
        inset 0 1px 1px rgba(255,255,255,.08);
      transition:.25s ease;
    }

    .dt-coffee-btn{
      color:white;
      padding:12px 16px;
      border-radius:999px;
      font:600 14px system-ui;
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
      color:white;
      text-align:center;
      font-family:system-ui;
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
    }

    .dt-coffee-option{
      width:100%;
      margin:8px 0;
      padding:14px;
      border-radius:16px;
      color:white;
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
      width:22px;
      height:22px;
      fill:white;
    }

    .dt-close{
      margin-top:14px;
      background:none;
      border:none;
      color:#94a3b8;
      cursor:pointer;
    }
  `;

  document.head.appendChild(style);

  // =========================
  // FLOAT BUTTON
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

      <p>If my projects helped you, support here.</p>

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
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2c1.7 2 2.7 4.5 2.9 7H9.1C9.3 8.5 10.3 6 12 4zm-6.9 7h3.2c-.2 2.5-.8 4.8-1.6 6.5A8 8 0 015.1 11zm3.2 0h6.6c-.2 3-1.2 5.5-3.3 7-2.1-1.5-3.1-4-3.3-7zm8.2 0h3.2a8 8 0 01-1.6 6.5c-.8-1.7-1.4-4-1.6-6.5zm3.2-2h-3.2c-.2-2.5-.8-4.8-1.6-6.5A8 8 0 0118.9 9z"/>
          </svg>
        </a>

        <!-- GITHUB -->
        <a href="${GITHUB}" target="_blank" title="GitHub">
          <svg viewBox="0 0 24 24">
            <path d="M12 .5A11.5 11.5 0 000 12c0 5.2 3.3 9.6 8 11.2.6.1.8-.2.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 016 0C16.9 5.1 18 5.4 18 5.4c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.3.8 1 .8 2.1v3.2c0 .4.2.7.8.6A11.5 11.5 0 0024 12 11.5 11.5 0 0012 .5z"/>
          </svg>
        </a>

        <!-- TELEGRAM -->
        <a href="${TELEGRAM}" target="_blank" title="Telegram">
          <svg viewBox="0 0 24 24">
            <path d="M9.0 16.0l-.4 5.4c.5 0 .8-.2 1.1-.5l2.5-2.4 5.3 3.9c1 .5 1.7.2 2-.9L23 4c.3-1.4-.5-2-1.5-1.6L1.5 10.6c-1.4.6-1.3 1.3-.2 1.7l5.1 1.6 11.8-7.4c.5-.3 1-.1.6.2z"/>
          </svg>
        </a>

        <!-- INSTAGRAM -->
        <a href="${INSTAGRAM}" target="_blank" title="Instagram">
          <svg viewBox="0 0 24 24">
            <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 4a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm6.5-2a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
          </svg>
        </a>

      </div>

      <button class="dt-close" id="dtCloseCoffee">Close</button>

    </div>
  `;

  document.body.appendChild(overlay);

  // =========================
  // EVENTS
  // =========================

  btn.onclick = () => overlay.classList.add("show");

  hideBtn.onclick = () => {
    wrap.style.display = "none";
    overlay.classList.remove("show");
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.classList.remove("show");
  };

  document.getElementById("dtCloseCoffee").onclick = () => {
    overlay.classList.remove("show");
  };

  document.getElementById("dtPaypalBtn").onclick = () => {
    window.open(PAYPAL_LINK, "_blank");
  };

  // =========================
  // UPI (DOWNLOAD QR)
  // =========================

  document.getElementById("dtUpiBtn").onclick = async () => {
    try {

      await navigator.clipboard.writeText(UPI_ID);
      showToast("UPI ID copied ✅");

      showToast("Downloading QR 📥");

      const res = await fetch(QR_IMAGE_URL);
      const blob = await res.blob();

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "DTverse-UPI-QR.png";
      document.body.appendChild(a);
      a.click();
      a.remove();

      showToast("QR saved to gallery 📁");

    } catch (err) {
      console.error(err);
      showToast("Something went wrong ❌");
    }
  };

})();