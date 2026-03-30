document.addEventListener("DOMContentLoaded",()=>{

let data = JSON.parse(localStorage.getItem("gacha")) || {
  point:0, spin:10, lvl:1, exp:0,
  inv:[], pity:0, lastDaily:0
};

const target=5000;

// SOUND
const click = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");

const sfx={
  common:new Audio("https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3"),
  rare:new Audio("https://assets.mixkit.co/active_storage/sfx/272/272-preview.mp3"),
  epic:new Audio("https://assets.mixkit.co/active_storage/sfx/273/273-preview.mp3"),
  legend:new Audio("https://assets.mixkit.co/active_storage/sfx/276/276-preview.mp3")
};

// POOL
const pool={
common:[
{name:"🪵 Kayu Lapuk",img:"https://picsum.photos/seed/c1/100"},
{name:"🪙 Koin Kusam",img:"https://picsum.photos/seed/c2/100"},
{name:"📦 Kotak Tua",img:"https://picsum.photos/seed/c3/100"},
{name:"🔩 Baut Karat",img:"https://picsum.photos/seed/c4/100"},
{name:"📜 Kertas Sobek",img:"https://picsum.photos/seed/c5/100"},
{name:"🧱 Batu Retak",img:"https://picsum.photos/seed/c6/100"},
{name:"🪶 Bulu Usang",img:"https://picsum.photos/seed/c7/100"},
{name:"🥾 Sepatu Bekas",img:"https://picsum.photos/seed/c8/100"}
],
rare:[
{name:"💎 Kristal Biru",img:"https://picsum.photos/seed/r1/100"},
{name:"🔷 Core Biru",img:"https://picsum.photos/seed/r2/100"},
{name:"📘 Buku jurus rahasia",img:"https://picsum.photos/seed/r3/100"},
{name:"⚙️ Gear Neon",img:"https://picsum.photos/seed/r4/100"},
{name:"💠 Token Elite",img:"https://picsum.photos/seed/r5/100"}
],
epic:[
{name:"⚡ Plasma Core",img:"https://picsum.photos/seed/e1/100"},
{name:"🌌 Fragmen Void",img:"https://picsum.photos/seed/e2/100"},
{name:"🧬 DNA Mutan",img:"https://picsum.photos/seed/e3/100"},
{name:"🔮 Orb Misterius",img:"https://picsum.photos/seed/e4/100"}
],
legend:[
{name:"👑 Raja Singularity",img:"https://picsum.photos/seed/l1/100"},
{name:"🔥 Core Dewa",img:"https://picsum.photos/seed/l2/100"},
{name:"⚡ Entitas Abadi",img:"https://picsum.photos/seed/l3/100"}
]
};

// DOM
const lvl=document.getElementById("lvl");
const point=document.getElementById("point");
const spinCount=document.getElementById("spinCount");
const inventory=document.getElementById("inventory");
const progress=document.getElementById("progress");
const claimBtn=document.getElementById("claim");
const missionList=document.getElementById("missionList");

// SAVE
function save(){localStorage.setItem("gacha",JSON.stringify(data));}

// UPDATE
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

// MISSION
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
}

// SPIN
window.spin=(x)=>{
click.play();
if(data.spin<x) return alert("Spin kurang 😹");

data.spin-=x;

for(let i=0;i<x;i++) roll();

save();update();
}

// ROLL
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

// PICK
function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}

// DAILY
window.daily=()=>{
click.play();
let now=Date.now();
if(now-data.lastDaily<86400000) return alert("Udah claim 😹");

data.lastDaily=now;
data.spin+=3;
data.point+=100;

save();update();
}

// CLAIM
window.claim=()=>{
click.play();
document.body.innerHTML=`<h1>🎁 Opening...</h1>`;
setTimeout(()=>{
window.location.href="https://chat.whatsapp.com/FkaAIFKS9ypK62izhdL6EO?mode=gi_t";
},2000);
}

// LEADERBOARD
function genLB(){
document.getElementById("lb").innerHTML=`
DewaSpin - 12000<br>
AnakHoki - 9000<br>
You - ${data.point}
`;
}

update();

});
