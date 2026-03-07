// ============================================================
//  Maintenance Page – JavaScript
// ============================================================
//  Konfiguration:
//    FORMSPREE_ID  → deine Formspree-Formular-ID eintragen,
//                    z.B. "xpwzgkra" aus https://formspree.io/f/xpwzgkra
//                    Leer lassen ("") um das Absenden zu überspringen.
//
//    TYPED_STRINGS → Text der getippt wird. HTML ist erlaubt –
//                    <br> für Zeilenumbruch, <span class="accent">…</span>
//                    für die cyan Hervorhebung.
// ============================================================

const FORMSPREE_ID = "xzdjzreo";  // ✏️ hier eintragen

// ✏️ Headline hier anpassen
const TYPED_STRINGS = [
  "Etwas Neues<br>entsteht <span class=\"accent\">bald</span>",
];


// ── Typewriter via typed.js ───────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  new Typed("#headline", {
    strings:        TYPED_STRINGS,
    typeSpeed:      55,       // ms pro Zeichen
    startDelay:     600,      // ms vor dem Start
    showCursor:     true,
    cursorChar:     "_",
    loop:           false,    // auf true setzen für endlose Wiederholung
    contentType:    "html",   // erlaubt <br> und <span> im String
  });
});


// ── Formular absenden ────────────────────────────────────────
async function submitForm() {
  const input = document.getElementById("email");
  const ok    = document.getElementById("ok");
  const btn   = document.querySelector(".input-row button");
  const email = input.value.trim();

  // Validierung
  if (!email || !email.includes("@")) {
    input.style.outline = "2px solid #ff5f57";
    setTimeout(() => (input.style.outline = ""), 1200);
    return;
  }

  // Optional: an Formspree senden
  if (FORMSPREE_ID) {
    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Fehler beim Senden:", err);
    }
  }

  // UI zurücksetzen
  input.value    = "";
  input.disabled = true;
  btn.disabled   = true;
  ok.classList.add("show");
}

// ── Enter-Taste im Input-Feld ────────────────────────────────
document.getElementById("email").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitForm();
});