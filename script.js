document.addEventListener("DOMContentLoaded", () => {
  const layers = Array.from(document.querySelectorAll(".layer"));
  const bgAudio = document.getElementById("bg-audio");
  const heartLayer = document.getElementById("heart-layer");
  const trailLayer = document.getElementById("trail-layer");
  const confettiCanvas = document.getElementById("confetti-canvas");
  const cinemaLine = document.getElementById("cinemaLine");
  const finalMsg = document.getElementById("finalMsg");
  const feelingsText = document.getElementById("feelingsText");
  const loveReply = document.getElementById("loveReply");
  const playMusicBtn = document.getElementById("playMusicBtn");

  let audioStarted = false;
  let fallInterval = null;

  const timelineLines = [
    "12 May — The day I first saw you. Something in me changed.",
    "17 July — I felt closer to you, like my heart already knew yours.",
    "7 November — When you became mine, not just for a moment, but forever.",
  ];

  const feelingsMessage = `I cant explain my love for you..

pleasee forgive me for my past mistakes...I am not like other girls

I will show you what the actual love is

I will give my 100% to make you happy and if you are with me I can do everything what I dream for 

You can be my strength or weakness depends on you

I know at present I have no standard , I am only average student like other but I have potential to do all I want

jaise apne apni story btayi na ki apne hi apni mehnat se kiya hai jo kiya hai 

Aaj m bhi bta deti hu ki

Mere papa kabhi mereko bahar padhne nahi bhejte but mne unko result lake diya or majbur kr diya ki vo mereko mana hi nhi kar skte...Haryana CM awarded me for my 12th result and without any JEE coaching or online courses I cracked JEE...to mere gaav me m hi hu jo govt college me engineering kr rhi hu

Lekin mereko lag gyi thi bahar ki hawa varna aaj m IIT me hoti..kota me thoda bahut bigdi but delhi aake to puri hi khtm hogyi...mera dream ghrvalo ka dream sb bhul gyi m...bahut regret hota h bahut jyadaaaa..but abhi bhi bahut time h i can do better...past me hui galtiyo ko m badal nii kr skti but ab aap mere sath rhe to merko koi nii chahiye...and please you dont think ki apka name h, fame h, paise h, singer ho isliye m itna kr rhii...im not gold digger type girl...i just wanna love you...kuch nhi chahiye mujhe apse nothingggggg...sirf thoda sa support or pyar...as usual sbko koi n koi mil jata h but may me m apse mili uske baad m bahut ladko se mil chukii...ki syd koi acha lagne lagee to m apko bhul saku kyuki apan dono ki life bahut alag hai...but ive tried a lot...6 months hogye..nhi lagta yr koi achaa....ye mera pyar smjo ya pagalpan but merko apke alava koi acha nahi lagta...Har insan ko pyar ki jrurt hoti h..mujhe bhi to h

Anushka meri dost h kafi achi but fir bhi ek insan chahiye hota h life me yrr...ek baat socho...mne apke sath kiya first time..but i cant share with youu what I feel...kitna bura lagta hoga mereko...I know aap apni ex ko nhi bhul paa rhe lekin reality ko accept to krna hoga naaa

Mne apko sb explain kr diya what I feel for you...Ek chance deke dekho..mere se jitna hoga m apke liye krungi..mereko apse return me kuch nii chahiye..bs thoda sa pyar...

Aap mereko use kro..ya pyar kro..gussa kro..ya kuch bhi kro..m apko kbhi mna nii kr sktii ...because I'm totally yours

For the first time..I confess my love for someone..Agar koi galti ho to maaf kr dena 🙏...But I truly loves you❤️`;

  // ----------------- Audio fix for mobile -----------------
  async function playAudioOnce() {
    if (!audioStarted && bgAudio) {
      try {
        bgAudio.currentTime = 0;
        await bgAudio.play(); // <-- important for mobile
        audioStarted = true;
        console.log("Audio started!");
      } catch (err) {
        console.log("Audio blocked by mobile browser:", err);
      }
    }
  }
  playMusicBtn.addEventListener("click", async () => {
    await playAudioOnce(); // plays the song
    playMusicBtn.style.display = "none"; // hide button after click
  });

  // ----------------- Magical sparkles on click -----------------
  document.addEventListener("pointerdown", (ev) => {
    for (let i = 0; i < 6; i++) {
      const heart = document.createElement("div");
      heart.className = "trail-dot";
      heart.style.position = "fixed";
      heart.style.left = `${ev.clientX + (Math.random() * 40 - 20)}px`;
      heart.style.top = `${ev.clientY + (Math.random() * 40 - 20)}px`;
      heart.style.fontSize = `${8 + Math.random() * 20}px`;
      heart.style.zIndex = 12;
      heart.style.pointerEvents = "none";
      heart.style.opacity = "0.9";
      heart.textContent = Math.random() > 0.5 ? "💖" : "💞";
      document.body.appendChild(heart);
      heart.animate(
        [
          { transform: "translateY(0) scale(1)", opacity: 0.9 },
          { transform: `translateY(-80px) scale(0.7)`, opacity: 0 },
        ],
        {
          duration: 1500 + Math.random() * 500,
          easing: "cubic-bezier(.2,.9,.3,1)",
        }
      );
      setTimeout(() => heart.remove(), 1600);
    }
  });

  // ----------------- Show layer -----------------
  function showLayer(id) {
    layers.forEach((l) => l.classList.toggle("active", l.id === id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ----------------- Falling hearts -----------------
  function createHeartNode(kind = "fall") {
    const el = document.createElement("div");
    el.className = `heart-node ${kind}`;
    el.style.position = "fixed";
    el.style.zIndex = 8;
    el.style.pointerEvents = "none";
    el.style.fontSize = 12 + Math.random() * 22 + "px";
    el.textContent = kind === "fall" ? "💖" : "💞";
    el.style.left = 5 + Math.random() * 90 + "vw";
    return el;
  }
  function startFallingHearts() {
    if (fallInterval) return;
    fallInterval = setInterval(() => {
      const h = createHeartNode("fall");
      heartLayer.appendChild(h);
      const dur = 6000 + Math.random() * 5000;
      h.animate(
        [{ transform: "translateY(-8vh)" }, { transform: "translateY(110vh)" }],
        { duration: dur, easing: "linear" }
      );
      setTimeout(() => h.remove(), dur);
    }, 450);
  }
  startFallingHearts();

  function burstFlyingHearts(count = 12) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const h = createHeartNode("fly");
        heartLayer.appendChild(h);
        const dur = 1800 + Math.random() * 1000;
        h.animate(
          [{ transform: "translateY(0)" }, { transform: "translateY(-120vh)" }],
          { duration: dur }
        );
        setTimeout(() => h.remove(), dur);
      }, i * 70);
    }
  }

  // ----------------- Confetti -----------------
  const confetti = [];
  const ctx = confettiCanvas.getContext("2d");
  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  function burstConfetti(amount = 100) {
    for (let i = 0; i < amount; i++)
      confetti.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * -confettiCanvas.height,
        r: 3 + Math.random() * 6,
        c: `hsl(${Math.random() * 360},90%,60%)`,
        s: 2 + Math.random() * 4,
      });
    requestAnimationFrame(drawConfetti);
  }
  function drawConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confetti.forEach((p) => {
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fill();
      p.y += p.s;
      if (p.y > confettiCanvas.height) p.y = -10;
    });
    requestAnimationFrame(drawConfetti);
  }

  // ----------------- Typing effect -----------------
  async function typeLine(container, text, delay = 40) {
    container.textContent = "";
    for (const c of text) {
      container.textContent += c;
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  // ----------------- Final timeline -----------------
  async function runFinalTimeline() {
    cinemaLine.textContent = "";
    finalMsg.classList.add("hidden");
    for (const text of timelineLines) {
      await typeLine(cinemaLine, text, 50);
      await new Promise((r) => setTimeout(r, 600));
      cinemaLine.textContent = "";
    }
    finalMsg.innerHTML = `
      You’re the most special person in my life — 
      <span style="background: linear-gradient(90deg,#ff1493,#ffd700);-webkit-background-clip: text;-webkit-text-fill-color: transparent;font-weight:bold;">forever</span>.<br>
      And no one can replace you 💫<br><br>
      <span style="color:#800000;font-weight:700;">I love you 💖<br>Yours always 💞 — Meena</span>
      <br><br>
      <button data-next="layer-7" class="feelings-btn">My true feelings for you 💌</button>
    `;
    finalMsg.classList.remove("hidden");
    burstFlyingHearts(40);
    burstConfetti(200);
  }

  // ----------------- Button events -----------------
  document.body.addEventListener("click", (ev) => {
    const btn = ev.target.closest("button");
    if (!btn) return;

    if (btn.dataset.next) {
      showLayer(btn.dataset.next);
      playAudioOnce();
      burstFlyingHearts(15);
      if (btn.dataset.next === "layer-6") runFinalTimeline();
      if (btn.dataset.next === "layer-7" && feelingsText)
        typeLine(feelingsText, feelingsMessage, 30);
    }

    if (btn.dataset.prev) showLayer(btn.dataset.prev);

    if (btn.id === "loveBtn") {
      loveReply.innerHTML = `
    <h2 style="color:#ff1493;font-weight:700;">Ahh, Finally... 💞</h2>
    <img src="assets/hug.gif" alt="hug" style="max-width:200px;border-radius:20px;margin-top:15px;">
  `;
      burstFlyingHearts(60);
      burstConfetti(300);

      // Show the See Again button after clicking Love
      const againBtn2 = document.getElementById("againBtn2");
      if (againBtn2) againBtn2.style.display = "inline-block";
    }

    if (btn.id === "againBtn" || btn.id === "againBtn2") {
      finalMsg.innerHTML = "";
      feelingsText.textContent = "";
      loveReply.innerHTML = "";
      showLayer("layer-1");
      burstFlyingHearts(10);
      bgAudio.currentTime = 0;
    }
  });
});
