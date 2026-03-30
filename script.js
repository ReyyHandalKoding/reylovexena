let data = JSON.parse(localStorage.getItem("singularity")) || {
  point:0, spin:0, exp:0, lvl:1,
  inv:[], lastDaily:0, streak:0, pity:0
};

const target = 5000;

const img = {
  common: "https://cdn-icons-png.flaticon.com/512/616/616494.png",
  rare: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png",
  epic: "https://cdn-icons-png.flaticon.com/512/3523/3523887.png",
  legend: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
  box: "https://cdn-icons-png.flaticon.com/512/679/679720.png"
};

const sound = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");

function save(){
  localStorage.setItem("singularity", JSON.stringify(data));
}

function update(){
  lvl.innerText = data.lvl;
  exp.innerText = data.exp;
  point.innerText = data.point;
  spinCount.innerText = data.spin;

  document.getElementById("progress").style.width =
    Math.min((data.point/target)*100,100) + "%";

  inventory.innerHTML = data.inv.slice(-10).map(i =>
    `<div class="item ${i.rarity}">
      <img src="${i.img}">
      <span>${i.name}</span>
    </div>`
  ).join("");

  if(data.point >= target){
    claim.style.display="inline-block";
  }

  genLB();
}

function misi(){
  data.spin += 3;
  save(); update();
}

function daily(){
  let now = Date.now();
  if(now - data.lastDaily < 86400000){
    alert("Udah claim 😹");
    return;
  }

  data.lastDaily = now;
  data.streak++;

  data.point += 100 + data.streak*20;
  data.spin += 2;

  save(); update();
}

function spin(x){
  if(data.spin < x){
    alert("Spin kurang 😹");
    return;
  }

  data.spin -= x;

  animateSpin(x);
}

function animateSpin(x){
  let i = 0;
  let int = setInterval(()=>{
    i++;
    document.title = "🎰 Spinning...";

    if(i > 10){
      clearInterval(int);

      sound.currentTime = 0;
      sound.play();

      for(let j=0;j<x;j++){
        roll();
      }

      save(); update();
      document.title = "🎰 Gacha Singularity";
    }
  },100);
}

function roll(){
  let r = Math.random();
  let item;

  if(data.pity >= 20){
    r = 1;
    data.pity = 0;
  }

  if(r<0.5){
    item = {name:"Common Chip", img:img.common, rarity:"common", p:rand(10,30)};
    data.pity++;
  } else if(r<0.8){
    item = {name:"Rare Token", img:img.rare, rarity:"rare", p:rand(30,80)};
    data.pity++;
  } else if(r<0.95){
    item = {name:"Epic Card", img:img.epic, rarity:"epic", p:rand(80,150)};
    data.pity++;
  } else {
    item = {name:"SINGULARITY CORE 🗿", img:img.legend, rarity:"legend", p:rand(200,400)};
    data.pity = 0;
  }

  data.inv.push(item);
  data.point += item.p;
  data.exp += item.p;

  if(data.exp >= data.lvl*300){
    data.exp = 0;
    data.lvl++;
  }
}

function rand(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function claim(){
  document.body.innerHTML = `
    <h1>🎁 Opening Mystery Box...</h1>
    <img src="${img.box}" width="150">
  `;

  setTimeout(()=>{
    window.location.href = "https://chat.whatsapp.com/FkaAIFKS9ypK62izhdL6EO?mode=gi_t";
  },2000);
}

function genLB(){
  let fake = [
    "DewaSpin - 12000",
    "AnakHoki - 9500",
    "SlotMaster - 8700",
    "You - " + data.point
  ];
  lb.innerHTML = fake.join("<br>");
}

update();
