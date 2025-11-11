document.addEventListener('DOMContentLoaded', () => {
  const layers = Array.from(document.querySelectorAll('.layer'));
  const startBtn = document.getElementById('startBtn');
  const revealBtn = document.getElementById('revealBtn');
  const againBtn = document.getElementById('againBtn');
  const bgAudio = document.getElementById('bg-audio');
  const heartLayer = document.getElementById('heart-layer');
  const trailLayer = document.getElementById('trail-layer');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const cinemaLine = document.getElementById('cinemaLine');
  const finalMsg = document.getElementById('finalMsg');

  let audioStarted=false, fallInterval=null;

  const timelineLines=[
    "12 May — The day I first saw you. Something in me changed.",
    "17 July — I felt closer to you, like my heart already knew yours.",
    "7 November — When you became mine, not just for a moment, but forever."
  ];

  function showLayer(id){
    layers.forEach(l=>{
      if(l.id===id){l.classList.add('active');l.classList.remove('exit');}
      else{if(l.classList.contains('active'))l.classList.add('exit');l.classList.remove('active');}
    });
    window.scrollTo({top:0,behavior:'smooth'});
  }

  document.body.addEventListener('click',(ev)=>{
    const n = ev.target.closest('[data-next]');
    if(n){const t=n.getAttribute('data-next');if(t) showLayer(t); burstFlyingHearts(10); tryStartAudio();}
    const p = ev.target.closest('[data-prev]');
    if(p){const t=p.getAttribute('data-prev');if(t) showLayer(t); burstFlyingHearts(6);}
  });

  if(startBtn) startBtn.addEventListener('click',()=>{tryStartAudio();showLayer('layer-2');});
  if(revealBtn) revealBtn.addEventListener('click',()=>{
    tryStartAudio();
    showLayer('layer-6');
    setTimeout(()=>{burstFlyingHearts(12); runFinalTimeline();},520);
  });
  if(againBtn) againBtn.addEventListener('click',()=>{
    if(finalMsg) finalMsg.classList.remove('show');
    if(cinemaLine) cinemaLine.textContent='';
    if(bgAudio && !bgAudio.paused) bgAudio.currentTime=0;
    setTimeout(()=>{burstFlyingHearts(10); runFinalTimeline();},360);
  });

  function tryStartAudio(){
    if(audioStarted)return;
    audioStarted=true;
    if(bgAudio && bgAudio.querySelector('source')){
      bgAudio.currentTime=0;
      bgAudio.play().catch(()=>{
        const resume=()=>{
          bgAudio.play().catch(()=>{});
          window.removeEventListener('click',resume);
          window.removeEventListener('touchstart',resume);
        };
        window.addEventListener('click',resume);
        window.addEventListener('touchstart',resume);
      });
    }
    setTimeout(stopFallingHearts,1400);
  }
  setTimeout(()=>tryStartAudio(),400);

  // Falling Hearts
  function createHeartNode(kind='fall'){
    const el=document.createElement('div');
    el.className=`heart-node ${kind}`;
    el.style.position='fixed';
    el.style.zIndex=8;
    el.style.pointerEvents='none';
    el.style.fontSize=(12+Math.random()*22)+'px';
    el.textContent=(kind==='fall')?'💖':'💞';
    el.style.left=(5+Math.random()*90)+'vw';
    return el;
  }
  function startFallingHearts(){
    if(fallInterval)return;
    fallInterval=setInterval(()=>{
      const h=createHeartNode('fall'); heartLayer.appendChild(h);
      const dur=6000+Math.random()*5000;
      const rotate=(Math.random()*360)-180;
      h.animate([{transform:`translateY(-8vh) rotate(0deg)`,opacity:0.95},{transform:`translateY(110vh) rotate(${rotate}deg)`,opacity:0.06}],{duration:dur,easing:'linear'});
      setTimeout(()=>h.remove(),dur+120);
    },450);
  }
  function stopFallingHearts(){if(!fallInterval)return; clearInterval(fallInterval); fallInterval=null;}
  startFallingHearts();

  // Flying Hearts Burst
  function burstFlyingHearts(count=12){
    for(let i=0;i<count;i++){
      setTimeout(()=>{
        const h=createHeartNode('fly'); heartLayer.appendChild(h);
        const leftDrift=(Math.random()*140)-70;
        const dur=1600+Math.random()*1400;
        const scale=0.9+Math.random()*0.9;
        h.animate([{transform:`translateY(0) translateX(0) scale(${scale})`,opacity:1},{transform:`translateY(-120vh) translateX(${leftDrift}px) scale(${scale*0.9})`,opacity:0}],{duration:dur,easing:'cubic-bezier(.2,.9,.3,1)'});
        setTimeout(()=>h.remove(),dur+80);
      },i*70);
    }
  }

  // Confetti
  const confetti=[]; const canvas=confettiCanvas; const ctx=canvas.getContext?canvas.getContext('2d'):null;
  function resizeCanvas(){if(!canvas)return; canvas.width=window.innerWidth; canvas.height=window.innerHeight;}
  window.addEventListener('resize',resizeCanvas); resizeCanvas();
  function burstConfetti(amount=120){
    if(!ctx)return;
    for(let i=0;i<amount;i++){
      confetti.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height-canvas.height,r:3+Math.random()*6,c:`hsl(${Math.random()*360},90%,60%)`,s:2+Math.random()*4,vx:(Math.random()*2-1)*2});
    }
    requestAnimationFrame(drawConfetti);
  }
  function drawConfetti(){
    if(!ctx)return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=confetti.length-1;i>=0;i--){
      const p=confetti[i];
      ctx.fillStyle=p.c;
      ctx.beginPath();
      ctx.ellipse(p.x,p.y,p.r,p.r*0.7,0,0,Math.PI*2);ctx.fill();
      p.x+=p.vx;p.y+=p.s;
      if(p.y>canvas.height+50) confetti.splice(i,1);
    }
    if(confetti.length>0) requestAnimationFrame(drawConfetti);
  }

  // Trail
  function spawnTrail(x,y){
    for(let i=0;i<6;i++){
      const el=document.createElement('div');
      const isHeart=Math.random()>0.5;
      el.className='trail-dot';
      el.style.position='fixed';
      el.style.left=`${x+(Math.random()*40-20)}px`;
      el.style.top=`${y+(Math.random()*40-20)}px`;
      el.style.zIndex=12;
      el.style.pointerEvents='none';
      el.style.opacity='0.95';
      el.style.fontSize=`${8+Math.random()*20}px`;
      el.textContent=isHeart?'💖':'💞';
      trailLayer.appendChild(el);
      el.animate([{transform:'translateY(0) scale(1) rotate(0deg)',opacity:0.9},{transform:`translateY(${(-100+Math.random()*50)}px) scale(0.7) rotate(${Math.random()*360}deg)`,opacity:0}],{duration:1600+Math.random()*500,easing:'cubic-bezier(.2,.9,.3,1)'});
      setTimeout(()=>el.remove(),1700);
    }
  }
  document.addEventListener('pointermove',(ev)=>spawnTrail(ev.clientX,ev.clientY));

  // Type Line function
  async function typeLine(container,text,delay=50){
    container.textContent='';
    for(const c of text){
      container.textContent+=c;
      await new Promise(r=>setTimeout(r,delay));
    }
  }

  // Run Final Timeline
  async function runFinalTimeline(){
    if(!cinemaLine || !finalMsg) return;
    cinemaLine.textContent='';
    finalMsg.classList.remove('show');
    finalMsg.classList.add('hidden');

    for(let i=0;i<timelineLines.length;i++){
      const text=timelineLines[i];
      const delay=Math.max(20,Math.floor(6000/text.length));
      await typeLine(cinemaLine,text,delay);
      await new Promise(r=>setTimeout(r,500));
      cinemaLine.textContent='';
    }

    finalMsg.innerHTML=`You’re the most special person in my life — <span class="gold">forever</span>.<br>
    And no one can replace you 💫<br><br>
    I love you 💖<br>
    Yours always 💞 — Meena`;

    finalMsg.classList.remove('hidden');
    finalMsg.classList.add('show');

    burstConfetti(140);
    burstFlyingHearts(28);
  }

});
