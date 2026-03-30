let data = JSON.parse(localStorage.getItem("singularity")) || {
  point:0, shard:0, spin:0, exp:0, lvl:1,
  inv:[], lastDaily:0, streak:0
};

const target = 5000;

// gambar dari internet (casino + item + mystery box)
const img = {
  common: "https://cdn-icons-png.flaticon.com/512/616/616494.png",
  rare: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png",
  epic: "https://cdn-icons-png.flaticon.com/512/3523/3523887.png",
  legend: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
  box: "https://cdn-icons-png.flaticon.com/512/679/679720.png"
};

function save(){
  localStorage.setItem("singularity", JSON.stringify(data));
}

function update(){
  document.getElementById("lvl").innerText = data.lvl;
  document.getElementById("exp").innerText = data.exp;
  document.getElementById("point").innerText = data.point;
  document.getElementById("shard").innerText = data.shard;
  document.getElementById("spinCount").innerText = data.spin;

  document.getElementById("inventory").innerHTML =
    data.inv.slice(-10).map(i =>
      `<div class="item">
        <img src="${i.img}">
        <span>${i.name}</span>
      </div>`
    ).join("");

  if(data.point >= target){
    document.getElementById("claim").style.display = "inline-block";
  }

  genLB();
}

function misi(){
  data.spin += 3;
  alert("Misi kelar, dapet spin 😹");
  save(); update();
}

function daily(){
  let now = Date.now();
  if(now - data.lastDaily < 86400000){
    alert("Udah claim njing 😹");
    return;
  }

  data.lastDaily = now;
  data.streak++;

  let reward = 100 + (data.streak*20);
  data.point += reward;
  data.spin += 2;

  save(); update();
}

function spin(x){
  if(data.spin < x){
    alert("Spin kurang 😹");
    return;
  }

  data.spin -= x;

  for(let i=0;i<x;i++){
    roll();
  }

  save(); update();
}

function roll(){
  let r = Math.random();
  let item;

  if(r<0.5){
    item = {name:"Common Chip", img:img.common, p:rand(10,30), s:0};
  } else if(r<0.8){
    item = {name:"Rare Token", img:img.rare, p:rand(30,80), s:5};
  } else if(r<0.95){
    item = {name:"Epic Card", img:img.epic, p:rand(80,150), s:10};
  } else {
    item = {name:"SINGULARITY CORE 🗿", img:img.legend, p:rand(200,400), s:25};
  }

  data.inv.push(item);
  data.point += item.p;
  data.shard += item.s;
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
  alert("🎁 Lu buka Mystery Box...");
  setTimeout(()=>{
    window.location.href = "https://chat.whatsapp.com/FkaAIFKS9ypK62izhdL6EO?mode=gi_t";
  },1500);
}

function genLB(){
  let fake = [
    "DewaSpin - 12000",
    "AnakHoki - 9500",
    "SlotMaster - 8700",
    "You - " + data.point
  ];
  document.getElementById("lb").innerHTML = fake.join("<br>");
}

update();
