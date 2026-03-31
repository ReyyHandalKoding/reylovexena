document.addEventListener("DOMContentLoaded",()=>{

let data = JSON.parse(localStorage.getItem("gacha")) || {
  point:0, spin:10, lvl:1, exp:0,
  inv:[], pity:0, lastDaily:0
};

const target=5000;

// SOUND
const click = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");

// BGM
const bgm = new Audio("https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3");
bgm.loop = true;
bgm.volume = 0.4;

// autoplay pas klik pertama
document.addEventListener("click", ()=>{
  if(bgm.paused){
    bgm.play().catch(()=>{});
  }
}, { once:true });

window.toggleBGM = ()=>{
  if(bgm.paused){
    bgm.play();
  } else {
    bgm.pause();
  }
};

const sfx={
  common:new Audio("https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3"),
  rare:new Audio("https://assets.mixkit.co/active_storage/sfx/272/272-preview.mp3"),
  epic:new Audio("https://assets.mixkit.co/active_storage/sfx/273/273-preview.mp3"),
  legend:new Audio("https://assets.mixkit.co/active_storage/sfx/276/276-preview.mp3")
};

// (POOL LU TETEP — ga gw ubah, biar ga ribet)
const pool={...JSON.parse(JSON.stringify({
  common:[
    {name:"🪵 Kayu Lapuk",img:"https://files.catbox.moe/e5ddh1.jpeg"},
    {name:"🪙 Koin Kusam",img:"https://files.catbox.moe/6vkk3x.jpeg"},
    {name:"📦 Kotak Tua",img:"https://files.catbox.moe/pzkugd.jpeg"},
    {name:"🔩 Baut Karat",img:"https://files.catbox.moe/u6z9k9.jpeg"},
    {name:"📜 Kertas Sobek",img:"https://files.catbox.moe/bo9h3z.jpeg"},
    {name:"🧱 Batu Retak",img:"https://files.catbox.moe/wfr5ho.jpeg"},
    {name:"🪶 Bulu Usang",img:"https://files.catbox.moe/jaw2d9.webp"},
    {name:"🥾 Sepatu Bekas",img:"https://files.catbox.moe/wqd11n.jpeg"}
  ],
  rare:[
    {name:"💎 Kristal Biru",img:"https://files.catbox.moe/nzvjjw.jpeg"},
    {name:"🔷 Core Biru",img:"https://files.catbox.moe/epynie.jpg"},
    {name:"📘 Buku jurus rahasia",img:"https://files.catbox.moe/ogeyki.jpeg"},
    {name:"⚙️ Gear Neon",img:"https://files.catbox.moe/yx4nwu.jpeg"},
    {name:"💠 Token Elite",img:"https://files.catbox.moe/xqizuq.jpg"}
  ],
  epic:[
    {name:"⚡ Plasma Core",img:"https://files.catbox.moe/sl87s9.jpeg"},
    {name:"🌌 Fragmen Void",img:"https://files.catbox.moe/2gk261.png"},
    {name:"🧬 DNA Mutan",img:"https://files.catbox.moe/w8tr3c.png"},
    {name:"🔮 Orb Misterius",img:"https://files.catbox.moe/afkaol.jpg"}
  ],
  legend:[
    {name:"👑 Raja Singularity",img:"https://files.catbox.moe/i1ldc8.png"},
    {name:"🔥 Core Dewa",img:"https://files.catbox.moe/zs7z8u.jpeg"},
    {name:"⚡ Entitas Abadi",img:"https://files.catbox.moe/47reba.jpeg"}
  ]
}))};

// DOM
const lvl=document.getElementById("lvl");
const point=document.getElementById("point");
const spinCount=document.getElementById("spinCount");
const inventory=document.getElementById("inventory");
const progress=document.getElementById("progress");
const claimBtn=document.getElementById("claim");
const missionList=document.getElementById("missionList");

function save(){localStorage.setItem("gacha",JSON.stringify(data));}

function update(){
lvl.innerText=data.lvl;
point.innerText=data.point;
spinCount.innerText=data.spin;

progress.style.width=(data.point/target*100)+"%";

inventory.innerHTML=data.inv.slice(-10).map(i=>`
<div class="item ${i.rarity}">
<img src="${i.img}">
<span>${i.name}</span>
</div>`).join("");

if(data.point>=target) claimBtn.style.display="block";

genLB();
renderMisi();
}

const missions=[
{id:1,name:"📺 Subscribe",reward:3},
{id:2,name:"🎵 TikTok",reward:3},
{id:3,name:"📸 IG",reward:2}
];

function renderMisi(){
missionList.innerHTML=missions.map(m=>`
<button onclick="doMission(${m.id})">${m.name} (+${m.reward})</button>
`).join("");
}

window.doMission=(id)=>{
click.play();
let m=missions.find(x=>x.id===id);
data.spin+=m.reward;
save();update();
};

window.spin=(x)=>{
click.play();
if(data.spin<x) return alert("Spin kurang 😹");

data.spin-=x;
for(let i=0;i<x;i++) roll();

save();update();
};

function roll(){
let r=Math.random(),item;

if(data.pity>=20){r=1;data.pity=0;}

if(r<0.5){item=pick(pool.common);item.rarity="common";data.pity++;}
else if(r<0.8){item=pick(pool.rare);item.rarity="rare";data.pity++;}
else if(r<0.95){item=pick(pool.epic);item.rarity="epic";data.pity++;}
else{item=pick(pool.legend);item.rarity="legend";data.pity=0;}

item={...item};
data.inv.push(item);
data.point+=Math.floor(Math.random()*100)+20;

sfx[item.rarity].currentTime=0;
sfx[item.rarity].play();
}

function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}

window.daily=()=>{
click.play();
let now=Date.now();
if(now-data.lastDaily<86400000) return alert("Udah claim 😹");

data.lastDaily=now;
data.spin+=3;
data.point+=100;

save();update();
};

window.claim=()=>{
click.play();
document.body.innerHTML=`<h1>🎁 Opening...</h1>`;
setTimeout(()=>{
window.location.href="https://chat.whatsapp.com/FkaAIFKS9ypK62izhdL6EO?mode=gi_t";
},2000);
};

function genLB(){
document.getElementById("lb").innerHTML=`
DewaSpin - 12000<br>
AnakHoki - 9000<br>
You - ${data.point}
`;
}

update();

});
