document.addEventListener("DOMContentLoaded", ()=>{

let data = JSON.parse(localStorage.getItem("gacha")) || {
  point:0, spin:0, lvl:1, exp:0,
  inv:[], pity:0, lastDaily:0
};

const target = 5000;

// sound
const click = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
const sfx = {
  common:new Audio("https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3"),
  rare:new Audio("https://assets.mixkit.co/active_storage/sfx/272/272-preview.mp3"),
  epic:new Audio("https://assets.mixkit.co/active_storage/sfx/273/273-preview.mp3"),
  legend:new Audio("https://assets.mixkit.co/active_storage/sfx/276/276-preview.mp3")
};

// gambar
const pool = {
  common:[
    {name:"Rusty Coin",img:"https://picsum.photos/seed/a/100"},
    {name:"Broken Chip",img:"https://picsum.photos/seed/b/100"}
  ],
  rare:[
    {name:"Neon Token",img:"https://picsum.photos/seed/c/100"},
    {name:"Energy Cube",img:"https://picsum.photos/seed/d/100"}
  ],
  epic:[
    {name:"Quantum Core",img:"https://picsum.photos/seed/e/100"}
  ],
  legend:[
    {name:"🔥 GOD CORE 🔥",img:"https://picsum.photos/seed/f/100"}
  ]
};

// misi
const missions = [
  {id:1,name:"📺 Subscribe",reward:3},
  {id:2,name:"🎵 Follow TikTok",reward:3},
  {id:3,name:"📸 Instagram",reward:2}
];

// DOM
const lvl = document.getElementById("lvl");
const point = document.getElementById("point");
const spinCount = document.getElementById("spinCount");
const inventory = document.getElementById("inventory");
const progress = document.getElementById("progress");
const claimBtn = document.getElementById("claim");
const missionList = document.getElementById("missionList");

// save
function save(){
  localStorage.setItem("gacha",JSON.stringify(data));
}

// update
function update(){
  lvl.innerText=data.lvl;
  point.innerText=data.point;
  spinCount.innerText=data.spin;

  progress.style.width=(data.point/target*100)+"%";

  inventory.innerHTML=data.inv.slice(-10).map(i=>`
    <div class="item ${i.rarity}">
      <img src="${i.img}">
      <span>${i.name}</span>
    </div>
  `).join("");

  if(data.point>=target) claimBtn.style.display="block";

  renderMisi();
}

// misi
function renderMisi(){
  missionList.innerHTML=missions.map(m=>`
    <button class="btn" onclick="doMission(${m.id})">
      ${m.name} (+${m.reward})
    </button>
  `).join("");
}

window.doMission=(id)=>{
  click.play();
  let m=missions.find(x=>x.id===id);
  data.spin+=m.reward;
  save();update();
}

// spin
window.spin=(x)=>{
  click.play();
  if(data.spin<x) return alert("Spin kurang 💔");

  data.spin-=x;
  let hasil=[];

  for(let i=0;i<x;i++) hasil.push(roll());

  showResult(hasil);
  save();update();
}

// roll
function roll(){
  let r=Math.random();
  let item;

  if(data.pity>=20){r=1;data.pity=0;}

  if(r<0.5){
    item=pick(pool.common); item.rarity="common"; data.pity++;
  }else if(r<0.8){
    item=pick(pool.rare); item.rarity="rare"; data.pity++;
  }else if(r<0.95){
    item=pick(pool.epic); item.rarity="epic"; data.pity++;
  }else{
    item=pick(pool.legend); item.rarity="legend"; data.pity=0;
  }

  item={...item};
  data.inv.push(item);
  data.point+=Math.floor(Math.random()*100)+20;

  return item;
}

function pick(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

// popup hasil
function showResult(items){
  let div=document.createElement("div");
  div.style.position="fixed";
  div.style.top="0";
  div.style.width="100%";
  div.style.height="100%";
  div.style.background="black";
  div.style.display="flex";
  div.style.flexDirection="column";
  div.style.justifyContent="center";
  div.style.alignItems="center";
  document.body.appendChild(div);

  let i=0;
  function next(){
    if(i>=items.length){setTimeout(()=>div.remove(),1000);return;}
    let it=items[i];

    div.innerHTML=`
      <h2>${it.rarity.toUpperCase()}</h2>
      <img src="${it.img}" width="120">
      <p>${it.name}</p>
    `;

    sfx[it.rarity].play();

    i++;
    setTimeout(next,1000);
  }
  next();
}

// daily
window.daily=()=>{
  click.play();
  let now=Date.now();
  if(now-data.lastDaily<86400000) return alert("Udah claim bang, buset dh rakus bet 😭");

  data.lastDaily=now;
  data.spin+=3;
  data.point+=100;

  save();update();
}

// claim
window.claim=()=>{
  click.play();
  document.body.innerHTML=`
    <h1>🎁 Opening...</h1>
    <img src="https://cdn-icons-png.flaticon.com/512/679/679720.png" width="150">
  `;
  setTimeout(()=>{
    window.location.href="https://chat.whatsapp.com/FkaAIFKS9ypK62izhdL6EO?mode=gi_t";
  },2000);
}

update();

});
