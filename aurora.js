/* =============================================================
   AURORA GLASS — 인터랙션 레이어
   떠다니는 별 파티클 · 히어로 3D 틸트 · 마그네틱 버튼 · 데모 카드 스포트라이트
   (main.js · apps.js 뒤에 로드 — 모듈 카드가 렌더된 뒤 바인딩)
   ============================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------- 떠다니는 별 파티클 ---------- */
  if (!reduce) {
    var cv = document.getElementById("particles");
    if (cv) {
      var ctx = cv.getContext("2d");
      var W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
      var parts = [];
      var COLORS = ["rgba(106,123,255,", "rgba(166,104,255,", "rgba(79,215,255,", "rgba(57,230,195,"];
      var resize = function () {
        W = cv.width = innerWidth * DPR;
        H = cv.height = innerHeight * DPR;
        cv.style.width = innerWidth + "px";
        cv.style.height = innerHeight + "px";
        var count = Math.min(70, Math.floor(innerWidth / 22));
        parts = [];
        for (var i = 0; i < count; i++) {
          parts.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: (Math.random() * 1.8 + 0.5) * DPR,
            vx: (Math.random() - 0.5) * 0.12 * DPR,
            vy: (Math.random() - 0.5) * 0.12 * DPR,
            a: Math.random() * 0.5 + 0.15,
            c: COLORS[i % COLORS.length],
            tw: Math.random() * Math.PI * 2
          });
        }
      };
      var draw = function () {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          p.x += p.vx; p.y += p.vy; p.tw += 0.02;
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
          var alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.c + alpha + ")";
          ctx.fill();
        }
        requestAnimationFrame(draw);
      };
      resize();
      draw();
      var rt;
      window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(resize, 200); });
    }
  }

  /* ---------- 히어로 3D 틸트 ---------- */
  if (!isTouch && !reduce) {
    var heroWrap = document.querySelector(".hero__visual");
    var heroTilt = document.getElementById("heroTilt");
    if (heroWrap && heroTilt) {
      var raf1 = null;
      heroWrap.addEventListener("mousemove", function (ev) {
        var r = heroWrap.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        if (raf1) cancelAnimationFrame(raf1);
        raf1 = requestAnimationFrame(function () {
          heroTilt.style.transform = "rotateY(" + px * 14 + "deg) rotateX(" + (-py * 14) + "deg)";
        });
      });
      heroWrap.addEventListener("mouseleave", function () {
        if (raf1) cancelAnimationFrame(raf1);
        heroTilt.style.transform = "rotateY(0deg) rotateX(0deg)";
      });
    }
  }

  /* ---------- 마그네틱 버튼 ---------- */
  if (!isTouch && !reduce) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (ev) {
        var r = btn.getBoundingClientRect();
        var mx = ev.clientX - r.left - r.width / 2;
        var my = ev.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + mx * 0.28 + "px," + my * 0.4 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------- 데모 카드 스포트라이트 (마우스 따라오는 빛) ----------
     모듈 카드는 main.js가 동적으로 렌더하므로 문서 위임으로 처리 */
  if (!isTouch && !reduce) {
    document.addEventListener("pointermove", function (ev) {
      var card = ev.target.closest && ev.target.closest(".module--app");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((ev.clientX - r.left) / r.width) * 100 + "%");
      card.style.setProperty("--my", ((ev.clientY - r.top) / r.height) * 100 + "%");
    }, { passive: true });
  }
})();
