document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

  function isSmartphone() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
  }

  if (isSmartphone()) {
    document.body.style.zoom = "88%";
    document.querySelector(".viewport").style.width = "calc(50% + 190px)";
    document.querySelector(".viewport").style.height = "calc(50% + 270px)";
    document.querySelector(".corner").style.fontSize = "12px";
    document.querySelector("#foodHealth").style.fontSize = "12px";
    document.querySelector("#sunmoon").style.bottom = "115px";
    document.querySelector(".viewport").transform = "translate(10%, 10%)";
  } else {
    //document.getElementById("inputBox").style.display = "none";
  }
  
  var sandboxMode = false;
  let divisor;
  let wings;
  if (navigator.userAgent.indexOf("Chromebook") !== -1) {
    divisor = 26;
    wings = "🪽";
  } else if (navigator.userAgent.indexOf("Windows") !== -1) {
    divisor = 30;
    wings = "𓆩𓆪";
  } else {
    divisor = 30;
    wings = "🪽";
  }

  var GRID_NUMBER = 9;
  var PLAYER_EMOJI = "😄";
  var HAND_EMOJI = "👊";
  var RHAND_EMOJI = "🤚";
  var HEART_EMOJI = "❤️";
  var DEAD_EMOJI = "🖤";
  var EMPTY_EMOJI = "⚫";
  var HUNGER_EMOJI = "🍗";
  var cellColor = "#222";
  var damageColor = cellColor;
  
  var BOSS_EMOJI = "💩";
  var BOSS = "💩";
  var currentBoss = "💩";
  var BOSS_LOOT = "🏆";
  var BOSS_ENRAGED = "🤢";
  var ANGRY = "😡";
  var BOSS_HEARTS = "🤎";
  var BOSS_DAMAGE = 4;
  var MAX_BOSS_HEALTH = 20;
  var bossHealth = MAX_BOSS_HEALTH;
  var boss_mode = false;
  var boss_move = true;
  var dragonDefeated = false;
  var bossRegester = 0;
  var projRegester = 0;
  var win = false;
  var speed = 500;
  var damageTick = 1000;

  var MAX_FOOD_HEALTH = 10;
  var FOOD_HEALTH = MAX_FOOD_HEALTH;
  var MAX_SATURATION = 10;
  var saturation = 2;
  var MAX_PLAYER_HEALTH = 10;
  var playerHealth = MAX_PLAYER_HEALTH;
  var direction = "left";
  var Jpress = false;
  var durability = 0;
  var raisedShield = false;
  
  var moveX = 5;
  var moveY = 5;
  var time = 400;
  var phase = "";
  var burning = 0;
  var burn = false;
  var encrypt = 3; // 3
  var clickCounter = 0;
  var pos1 = [1,0];
  var pos2 = [1,0];
  var currentSlot = 0;
  
  // Dependency-based variables
  var maxFishing = 30;
  var fishing = maxFishing;
  var tractorMode = false;
  var regeneration = 0;
  var fireRes = 0;

  // Generate Slots
  const slot1 = document.getElementById("slot1");
  const slot2 = document.getElementById("slot2");
  const slot3 = document.getElementById("slot3");
  const slot4 = document.getElementById("slot4");
  const slot5 = document.getElementById("slot5");
  const slot6 = document.getElementById("slot6");
  const slot7 = document.getElementById("slot7");
  const slot8 = document.getElementById("slot8");
  const slot9 = document.getElementById("slot9");

  var baseEmote = ["😄","🙂","😊","😂","🤣","😎","😜","😏","😘","🙃","😋","🥹","😍","😁"];
  var moonPhases = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
  var moonIndex = 0;
  
  var currentIndex = 0;
  var showInv = "";

  var Inventory = [
    ["🗡️", "⛏️", "🪓", "", "", "", "", "💩", "🥚"],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]
  ];

  var inventoryValue = [
    [" ", " ", " ", "", "", "", "", " ", " "],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]
  ];
  
  var armor = ["🧢","","","","",""];
  
  // Hovering Text
  var hover = "";
  var iRow = 0;
  var iCol = 0;
  const corner = document.querySelector('.corner');
  const hoverText = document.querySelector('.hover-text');

  corner.addEventListener('mousemove', (event) => {
    hoverText.style.left = `${event.clientX}px`;
    hoverText.style.top = `${event.clientY + 10}px`;
    
    // Hover Text
    const clickArea = document.getElementById('healthBar');
    const mouseX = event.clientX - clickArea.getBoundingClientRect().left;
    const mouseY = event.clientY - clickArea.getBoundingClientRect().top;

    let s1Row = parseInt(Math.round((mouseY - 30) / divisor)); // Make sure divisor is defined
    let s1Col = parseInt(Math.round((mouseX - 3) / divisor)); // Make sure divisor is defined
    iRow = s1Row;
    iCol = s1Col;

    if (s1Row >= 0 && s1Row < Inventory.length && s1Col >= 0 && s1Col < Inventory[0].length) {
      hover = Inventory[s1Row][s1Col] + inventoryValue[s1Row][s1Col] ?? "";
    } else if (s1Row >= 7 && s1Row <= 10 && s1Col <=8) {
      s1Row -= 7;
      for (let i = 0; i < boxLoot.length; i++) {
        const lootEntry = boxLoot[i];
        const valueEntry = boxValueLoot[i];
        if (chestPosition.x == lootEntry[0] && chestPosition.y == lootEntry[1]) {
          let pos = s1Row * 9 + s1Col + 2;
          hover = lootEntry[pos] + valueEntry[pos];
        }
      }
    } else {hover = "";}
    hoverText.textContent = hover;
  });

  corner.addEventListener('mouseenter', () => {
    hoverText.style.left = '0';
    hoverText.style.top = '0';
  });

  corner.addEventListener('mouseleave', () => {
    hoverText.style.left = '-9999px';
  });

  var objectProperties = {
    "🌊": {
      name: "Water",
      canBeWalkedOn: false,
      durability: 99,
      toolRequired: ""
    },
    "🌳": {
      name: "Tree",
      description: "Cut down for wood",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "🪓",
      loot: "🪵"
    },
    "🌲": {
      name: "Evergreen Tree",
      description: "Cut down for wood",
      canBeWalkedOn: false,
      durability: 6,
      toolRequired: "🪓",
      loot: "🪵"
    },
    "🌴": {
      name: "Palm Tree",
      description: "Cut down for wood",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "🪓",
      loot: "🪵"
    },
    "🪵": {
      name: "Wood",
      description: "Great building material",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "🪓",
      loot: "🪵"
    },
    "🌵": {
      name: "Cactus",
      description: "Ouch! Be careful not to get pricked",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "🪓",
      loot: "🌵"
    },
    "🌱": {
      name: "Seedling",
      canBeWalkedOn: true,
      durability: 3,
      toolRequired: "👊",
      loot: ""
    },
    "𓇠": {
      name: "Tomato Seed",
      canBeWalkedOn: true,
      durability: 8,
      toolRequired: "👊",
      loot: "𓇠"
    },
    "𓇢": {
      name: "Corn Seed",
      canBeWalkedOn: true,
      durability: 8,
      toolRequired: "👊",
      loot: "𓇢"
    },
    "𓄺": {
      name: "Potato Seed",
      canBeWalkedOn: true,
      durability: 8,
      toolRequired: "👊",
      loot: "𓄺"
    },
    "⌁": {
      name: "Lettuce Seed",
      canBeWalkedOn: true,
      durability: 8,
      toolRequired: "👊",
      loot: "⌁"
    },
    "❦": {
      name: "Grape Seed",
      canBeWalkedOn: true,
      durability: 8,
      toolRequired: "👊",
      loot: "❦"
    },
    "𓇼": {
      name: "Sand Seed",
      canBeWalkedOn: true,
      durability: 8,
      toolRequired: "👊",
      loot: "𓇼"
    },
    "𓇡": {
      name: "Bean Seed",
      canBeWalkedOn: true,
      durability: 8,
      toolRequired: "👊",
      loot: "𓇡"
    },
    ".": {
      name: "Wheat Seed",
      canBeWalkedOn: true,
      durability: 8,
      toolRequired: "👊",
      loot: "."
    },
    ":･": {
      name: "Melon Seed",
      canBeWalkedOn: true,
      durability: 8,
      toolRequired: "👊",
      loot: ":･"
    },
    "˖": {
      name: "Tree Sapling",
      canBeWalkedOn: true,
      durability: 8,
      toolRequired: "👊",
      loot: "˖"
    },
    "↟": {
      name: "Evergreen Sapling",
      canBeWalkedOn: true,
      durability: 8,
      toolRequired: "👊",
      loot: "↟"
    },
    "☘️": {
      name: "Shamrock",
      canBeWalkedOn: true,
      durability: 3,
      toolRequired: "👊",
      loot: "☘️"
    },
    "🌸": {
      name: "Cherry Blossom",
      canBeWalkedOn: true,
      durability: 3,
      toolRequired: "👊",
      loot: "🌸"
    },
    "🌷": {
      name: "Tulip",
      canBeWalkedOn: true,
      durability: 3,
      toolRequired: "👊",
      loot: "🌷"
    },
    "🧨": {
      name: "Dynamite",
      canBeWalkedOn: true,
      durability: 10,
      toolRequired: "👊",
      loot: "🧨"
    },
    "💣": {
      name: "Bomb",
      canBeWalkedOn: true,
      durability: 10,
      toolRequired: "👊",
      loot: "💣"
    },
    "🪦": {
      name: "Headstone",
      description: "☠ RIP ☠",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "⛏️",
      loot: "🪦"
    },
    "🪨": {
      name: "Stone",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "⛏️",
      loot: "🪨"
    },
    "🏔️": {
      name: "Snowy Mountain",
      canBeWalkedOn: false,
      durability: 15,
      toolRequired: "⛏️",
      loot: "🪨"
    },
    "🗻": {
      name: "Mountain",
      canBeWalkedOn: false,
      durability: 15,
      toolRequired: "⛏️",
      loot: "🪨"
    },
    "🛰": {
      name: "Satellite",
      canBeWalkedOn: false,
      durability: 10,
      toolRequired: "⛏️",
      loot: "🔩"
    },
    "🧰": {
      name: "Toolbox",
      description: "Use to craft stuff",
      canBeWalkedOn: false,
      durability: 10,
      toolRequired: "⛏️",
      loot: "🧰"
    },
    "🍳": {
      name: "Frying Pan",
      description: "Use to cook stuff",
      canBeWalkedOn: false,
      durability: 10,
      toolRequired: "⛏️",
      loot: "🍳"
    },
    "⚗️": {
      name: "Brewery",
      description: "Use to brew stuff",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "⛏️",
      loot: "⚗️"
    },
    "📦": {
      name: "Box",
      description: "Stores stuff",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "🪓",
      loot: ""
    },
    "🚜": {
      name: "Tractor",
      description: "Harvests crops quick",
      canBeWalkedOn: true,
      durability: 10,
      toolRequired: "⛏",
      loot: "🚜"
    },
    "🔐": {
      name: "Dungeon Lock",
      description: "You need a special key",
      canBeWalkedOn: false,
      durability: 999,
      toolRequired: "⛏️",
      loot: "🔒"
    },
    "🔒": {
      name: "Dungeon Lock",
      description: "You need a key",
      canBeWalkedOn: false,
      durability: 999,
      toolRequired: "⛏️",
      loot: "🔒"
    },
    "🌩️": {
      name: "Thunder Cloud",
      description: "Bit stormy outside",
      canBeWalkedOn: true,
      durability: 5,
      toolRequired: "👊",
      loot: "⚡"
    },
    "⛈️": {
      name: "Rainy Thunder Cloud",
      description: "Bit stormy outside",
      canBeWalkedOn: true,
      durability: 5,
      toolRequired: "👊",
      loot: "⚡"
    },
    "❄️": {
      name: "Snowflake",
      description: "Chilly",
      canBeWalkedOn: true,
      durability: 5,
      toolRequired: "👊",
      loot: "❄️"
    },
    "🥚": {
      name: "Egg",
      description: "Yummy",
      canBeWalkedOn: true,
      durability: 5,
      toolRequired: "👊",
      loot: "🥚"
    },
    "🏆": {
      name: "Trophy",
      description: "Congrats bro!",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "⛏️",
      loot: "🏆"
    },
    "🧱": {
      name: "Brick Wall",
      canBeWalkedOn: false,
      durability: 20,
      toolRequired: "⛏️",
      loot: "🧱"
    },
    "🪟": {
      name: "Window",
      canBeWalkedOn: false,
      durability: 10,
      toolRequired: "⛏️",
      loot: "🪟"
    },
    "🌫️": {
      name: "Marble",
      canBeWalkedOn: false,
      durability: 20,
      toolRequired: "⛏️",
      loot: "🌫️"
    },
    "🟪": {
      name: "Purple Wall",
      canBeWalkedOn: false,
      durability: 40,
      toolRequired: "",
      loot: "🟪"
    },
    "♒": {
      name: "Chiseled Purple Wall",
      canBeWalkeedOn: false,
      durability: 40,
      toolRequired: "",
      loot: "♒"
    },
    "🟥": {
      name: "Red Wall",
      canBeWalkedOn: false,
      durability: 20,
      toolRequired: "⛏️",
      loot: "🟥"
    },
    "⬜": {
      name: "White",
      canBeWalkedOn: false,
      durability: 999,
      toolRequired: "⛏️",
      loot: "⬜"
    },
    "⬛": {
      name: "Black",
      canBeWalkedOn: false,
      durability: 99,
      toolRequired: "",
      loot: "⬛"
    },
    "🌋": {
      name: "Volcano",
      description: "Keep a safe distance!",
      canBeWalkedOn: false,
      durability: 35,
      toolRequired: "⛏️",
      loot: "🪨"
    },
    "💩": {
      name: "Poop",
      description: "Mr. Poop has awaken from his slumber.",
      canBeWalkedOn: false,
      durability: 35,
      toolRequired: "⛏️",
      loot: "💩"
    },
    "🤖": {
      name: "Robot",
      description: "Beep. Boop",
      canBeWalkedOn: false,
      durability: 35,
      toolRequired: "⛏️",
      loot: "🤖"
    },
    "🐀": {
      name: "Rat King",
      description: "Squeek Squeek >:)",
      canBeWalkedOn: false,
      durability: 35,
      toolRequired: "⛏️",
      loot: "🐀"
    },
    "👹": {
      name: "Lucifer",
      description: "I am death, destroyer of worlds.",
      canBeWalkedOn: false,
      durability: 35,
      toolRequired: "⛏️",
      loot: "👹"
    },
    "🐖": {
      name: "Pig",
      description: "Oink Oink",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🥓"
    },
    "🐄": {
      name: "Cow",
      description: "Moo Moo",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🥩"
    },
    "🦆": {
      name: "Duck",
      description: "Quack Quack",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🪶"
    },
    "🐓": {
      name: "Rooster",
      description: "Cock-a-doodle-doo!",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🍗"
    },
    "🐔": {
      name: "Chicken",
      description: "Cluck cluck!",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🍗"
    },
    "🐕": {
      name: "Dog",
      description: "Aww..",
      isAnimal: true,
      canBeWalkedOn: true,
      durability: 7,
      toolRequired: "🗡️",
      loot: ""
    },
    "🐈": {
      name: "Cat",
      description: "Aww..",
      isAnimal: true,
      canBeWalkedOn: true,
      durability: 7,
      toolRequired: "🗡️",
      loot: ""
    },
    "🐶": {
      name: "Doggy",
      description: "Aww..",
      isAnimal: true,
      canBeWalkedOn: true,
      durability: 7,
      toolRequired: "🗡️",
      loot: ""
    },
    "🐱": {
      name: "Kitty",
      description: "Aww..",
      isAnimal: true,
      canBeWalkedOn: true,
      durability: 7,
      toolRequired: "🗡️",
      loot: ""
    },
    "🧟‍♂️": {
      name: "Zombie Man",
      description: "Brains...",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🍖"
    },
    "🧟‍♀️": {
      name: "Zombie Woman",
      description: "Brains...",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🦴"
    },
    "🧛": {
      name: "Vampire",
      description: "I want to suck your blood...",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🩸"
    },
    "👻": {
      name: "Ghost",
      description: "Boo!",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🔑"
    },
    "🐍": {
      name: "Snake",
      description: "Ssss...",
      isAnimal: true,
      canBeWalkedOn: true,
      durability: 5,
      toolRequired: "🗡️",
      loot: ""
    },
    "🐦": {
      name: "Bird",
      description: "Tweet Tweet",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🪶"
    },
    "🕊️": {
      name: "Dove",
      description: "Coo-oo",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🪶"
    },
    "🕷️": {
      name: "Spider",
      description: "Don't get bit!",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 3,
      toolRequired: "🗡️",
      loot: "🕸"
    },
    "🦇": {
      name: "Bat",
      description: "Don't get bit!",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 2,
      toolRequired: "🗡️",
      loot: ""
    },
    "👼": {
      name: "Baby Angel",
      description: "Holy little fella",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "🗡️",
      loot: "🌟"
    },
    "😇": {
      name: "Angel",
      description: "Holy art thou",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "🗡️",
      loot: "🌟"
    },
    "🦄": {
      name: "Unicorn",
      description: "So pretty",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 7,
      toolRequired: "🗡️",
      loot: "🌈"
    },
    "🧞": {
      name: "Genie",
      description: "I'll grant you 3 wishes...",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 7,
      toolRequired: "🗡️",
      loot: "🫖"
    },
    "🧚": {
      name: "Fairy",
      description: ":3",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 6,
      toolRequired: "🗡️",
      loot: "✨"
    },
    "🪬": {
      name: "Hamsa",
      description: "He sees all...",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "⛏️",
      loot: "🪬"
    },
    "🤡": {
      name: "The Joker",
      description: "???",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "⛏️",
      loot: "🤡"
    },
    "🐲": {
      name: "Dragonic",
      description: "Do not awaken from its slumber",
      canBeWalkedOn: false,
      durability: 10,
      toolRequired: "⛏️",
      loot: "🐲"
    },
    "☄": {
      name: "Comet",
      description: "Meteor Shower!",
      canBeWalkedOn: false,
      durability: 5,
      toolRequired: "⛏️",
      loot: "☄"
    },
    "🛸": {
      name: "UFO",
      description: "Unidentified Flying Object",
      canBeWalkedOn: false,
      durability: 7,
      toolRequired: "🗡️",
      loot: "🌠"
    },
    "👽": {
      name: "Alien",
      description: "'We come in peace...'",
      canBeWalkedOn: false,
      durability: 7,
      toolRequired: "⛏",
      loot: "👽"
    },
    "👿": {
      name: "Mad Demon",
      description: ">:(",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 10,
      toolRequired: "🗡",
      loot: "🔥"
    },
    "😈": {
      name: "Evil Demon",
      description: ">:)",
      isAnimal: true,
      canBeWalkedOn: false,
      durability: 9,
      toolRequired: "🗡",
      loot: "🔥"
    },
    "🔥": {
      name: "Fire",
      description: "Warning: HOT",
      canBeWalkedOn: true,
      durability: 2,
      toolRequired: "",
      loot: ""
    },
    "🥀": {
      name: "Wilted Flower",
      canBeWalkedOn: true,
      durability: 3,
      toolRequired: "👊",
      loot: "🥀"
    },
    "🌾": {
      name: "Wheat",
      canBeWalkedOn: true,
      durability: 1,
      toolRequired: "👊",
      loot: "🌾"
    },
    "🌽": {
      name: "Corn",
      canBeWalkedOn: true,
      durability: 2,
      toolRequired: "👊",
      loot: "🌽"
    },
    "🫘": {
      name: "Beans",
      canBeWalkedOn: true,
      durability: 2,
      toolRequired: "👊",
      loot: "🫘"
    },
    "🍅": {
      name: "Tomato",
      canBeWalkedOn: true,
      durability: 2,
      toolRequired: "👊",
      loot: "🍅"
    },
    "🥬": {
      name: "Lettuce",
      canBeWalkedOn: true,
      durability: 2,
      toolRequired: "👊",
      loot: "🥬"
    },
    "🥔": {
      name: "Potato",
      canBeWalkedOn: true,
      durability: 2,
      toolRequired: "👊",
      loot: "🥔"
    },
    "🍇": {
      name: "Grapes",
      canBeWalkedOn: true,
      durability: 2,
      toolRequired: "👊",
      loot: "🍇"
    },
    "🍈": {
      name: "Melon",
      canBeWalkedOn: true,
      durability: 4,
      toolRequired: "👊",
      loot: "🍉"
    },
    "🏠": {
      name: "House",
      description: "Nice place to live",
      canBeWalkedOn: true,
      durability: 20,
      toolRequired: "🪓",
      loot: "🪵"
    },
    "💎": {
      name: "Gem",
      description: "Ooh shiny!",
      canBeWalkedOn: false,
      durability: 15,
      toolRequired: "⛏️",
      loot: "💎"
    },
    "🪙": {
      name: "Precious Metal",
      canBeWalkedOn: false,
      durability: 10,
      toolRequired: "⛏️",
      loot: "🪙"
    },
    "🔩": {
      name: "Iron",
      description: "A very useful metal",
      canBeWalkedOn: false,
      durability: 10,
      toolRequired: "⛏️",
      loot: "🔩"
    },
    "💠": {
      name: "Diamond",
      description: "Diamonds!",
      canBeWalkedOn: false,
      durability: 15,
      toolRequired: "⛏️",
      loot: "💠"
    },
    "🗿": {
      name: "Stone Statue",
      description: "🍷🗿",
      canBeWalkedOn: false,
      durability: 10,
      toolRequired: "⛏️",
      loot: "🗿"
    },
    "🍄": {
      name: "Mushroom",
      canBeWalkedOn: true,
      durability: 3,
      toolRequired: "👊",
      loot: "🍄"
    },
    "🔮": {
      name: "Crystal Ball",
      description: "Use to make magical stuff",
      canBeWalkedOn: false,
      durability: 8,
      toolRequired: "⛏️",
      loot: "🔮"
    },
    "🏖": {
      name: "Sand",
      canBeWalkedOn: true,
      durability: 3,
      toolRequired: "⛏️",
      loot: "⏳"
    },
    "🌿": {
      name: "Herb",
      canBeWalkedOn: true,
      durability: 2,
      toolRequired: "👊",
      loot: "🌿"
    },
    " ": {
      name: " ",
      canBeWalkedOn: true,
      durability: 99,
      toolRequired: "",
      loot: " "
    },
    "🧙": {
      name: "Witch NPC",
      description: "I'm in quite the mood for some milk and cookies! Tell you what, if you can get me some, I'll give you something in return :)",
      canBeWalkedOn: false,
      durability: 99,
      toolRequired: "🗡",
      loot: "🍖"
    },
    "🧙‍♂️": {
      name: "Wizard NPC",
      description: "If you can get me 5 glowing stars, I'll teach you the art of wizardry (hint: they're in the sky). The witch might be able to help you get there.",
      canBeWalkedOn: false,
      durability: 99,
      toolRequired: "🗡",
      loot: "🍖"
    },
    "🧝‍♂️": {
      name: "Archer NPC",
      description: "If you make a bow, I'll give you some very special arrows.",
      canBeWalkedOn: false,
      durability: 99,
      toolRequired: "🗡",
      loot: "🍖"
    },
    "🥷": {
      name: "Ninja NPC",
      description: "I can help you upgrade your sword.",
      canBeWalkedOn: false,
      durability: 99,
      toolRequired: "🗡",
      loot: "🍖"
    },
    "🧑‍🌾": {
      name: "Farmer NPC",
      description: "If you can get me 5 of each crop, I'll give you something special...",
      canBeWalkedOn: false,
      durability: 99,
      toolRequired: "🗡",
      loot: "🍖"
    },
    "🧑‍🔧": {
      name: "Mechanic NPC",
      description: "If you can get me a hamburger, I'll show you something I've been trying to build..",
      canBeWalkedOn: false,
      durability: 99,
      toolRequired: "🗡",
      loot: "🍖"
    },
    "👷‍♂️": {
      name: "Miner NPC",
      description: "If you can get me a pizza, I'll show you something...",
      canBeWalkedOn: false,
      durability: 99,
      toolRequired: "🗡",
      loot: "🍖"
    },
  };
  
  var foodProperties = {
    "🍗": {
      name: "Drumstick",
      nutrition: 2,
    }, "🥩": {
      name: "Steak",
      nutrition: 2,
    }, "🥓": {
      name: "Bacon",
      nutrition: 2,
    }, "🍞": {
      name: "Bread",
      nutrition: 2,
    }, "🌭": {
      name: "Hot Dog",
      nutrition: 5,
    }, "🌽": {
      name: "Corn",
      nutrition: 1,
    }, "🫘": {
      name: "Beans",
      nutrition: 1,
    }, "🍅": {
      name: "Tomato",
      nutrition: 1,
    }, "🥬": {
      name: "Lettuce",
      nutrition: 1,
    }, "🥔": {
      name: "Potato",
      nutrition: 2,
    }, "🍇": {
      name: "Grapes",
      nutrition: 2,
    }, "🍉": {
      name: "Melon",
      nutrition: 2,
    }, "🥛": {
      name: "Milk",
      nutrition: 1,
    }, "🧀": {
      name: "Cheese",
      nutrition: 2,
    }, "🍺": {
      name: "Beer",
      nutrition: 3,
    }, "☕": {
      name: "Coffee",
      nutrition: 3,
    }, "🍷": {
      name: "Wine",
      nutrition: 3,
    }, "🍹": {
      name: "Tropical Drink",
      nutrition: 3,
    }, "🍔": {
      name: "Hamburger",
      nutrition: 12,
    }, "🍪": {
      name: "Cookie",
      nutrition: 3,
    }, "🍟": {
      name: "Fries",
      nutrition: 4,
    }, "🍿": {
      name: "Popcorn",
      nutrition: 3,
    }, "🥗": {
      name: "Salad",
      nutrition: 7,
    }, "🍕": {
      name: "Pizza",
      nutrition: 8,
    }, "🐟": {
      name: "Fish",
      nutrition: 1,
    }, "🦐 ": {
      name: "Shrimp",
      nutrition: 1,
    }, "🍤": {
      name: "Fried Shrimp",
      nutrition: 3,
    }, "🦀": {
      name: "Crab",
      nutrition: 2,
    }, "🍎": {
      name: "Red Apple",
      nutrition: 2,
    }, "🍏": {
      name: "Green Apple",
      nutrition: 2,
    }, "🍊": {
      name: "Orange",
      nutrition: 2,
    }, "🥧": {
      name: "Apple Pie",
      nutrition: 8,
    }, "🦞": {
      name: "Lobster",
      nutrition: 2,
    }, "💊": {
      name: "Health Pill",
      nutrition: 1,
      effect: "health4",
    }, "🩹": {
      name: "Bandage",
      nutrition: 0,
      effect: "health2",
    }, "🧪": {
      name: "Regeneration Potion",
      nutrition: 0,
      effect: "regeneration",
    }, "🌡️": {
      name: "Fire Potion",
      nutrition: 0,
      effect: "fireres",
    },
  };
  
  var craftingDictionary = {
    "🍞": {
      name: "Bread",
      itemsNeeded: ["🌾"],
      amountsNeeded: [3],
      required: "",
    },
    "🧰": {
      name: "Toolbox",
      itemsNeeded: ["🪵", "🔩"],
      amountsNeeded: [3, 1],
      required: "",
    },
    "🍳": {
      name: "Cooking Pan",
      itemsNeeded: ["🔩"],
      amountsNeeded: [3],
      required: "",
    },
    "🗿": {
      name: "Stone Statue",
      itemsNeeded: ["🪨"],
      amountsNeeded: [4],
      required: "🧰",
    },
    "🏠": {
      name: "House",
      itemsNeeded: ["🪵","🧱","🪟"],
      amountsNeeded: [8,16,3],
      required: "🧰",
    },
    "🥧": {
      name: "Apple Pie",
      itemsNeeded: ["🍞","🍎","🍏"],
      amountsNeeded: [1,1,1],
      required: "🍳",
    },
    "🌭": {
      name: "Hot Dog",
      itemsNeeded: ["🍞","🥩"],
      amountsNeeded: [2,1],
      required: "🍳",
    },
    "🍔": {
      name: "Hamburger",
      itemsNeeded: ["🍞","🥩","🧀","🍅","🥬"],
      amountsNeeded: [2,1,1,1,1],
      required: "🍳",
    },
    "🍟": {
      name: "Fries",
      itemsNeeded: ["🥔"],
      amountsNeeded: [2],
      required: "🍳",
    },
    "🍿": {
      name: "Popcorn",
      itemsNeeded: ["🌽"],
      amountsNeeded: [2],
      required: "🍳",
    },
    "🍕": {
      name: "Pizza",
      itemsNeeded: ["🍞","🥓","🧀","🍅"],
      amountsNeeded: [1,1,1,1],
      required: "🍳",
    },
    "🧀": {
      name: "Cheese",
      itemsNeeded: ["🥛"],
      amountsNeeded: [1],
      required: "🍳",
    },
    "🥗": {
      name: "Salad",
      itemsNeeded: ["🥬","🍅","🌽"],
      amountsNeeded: [4,1,1],
      required: "",
    },
    "🪣": {
      name: "Bucket",
      itemsNeeded: ["🪨","🔩"],
      amountsNeeded: [2,1],
      required: "🧰",
    },
    "🧺": {
      name: "Basket",
      itemsNeeded: ["🪵","🌾"],
      amountsNeeded: [2,1],
      required: "🧰",
    },
    "👹": {
      name: "Lucifer",
      itemsNeeded: ["👁","🎭","🔥"],
      amountsNeeded: [1,1,10],
      required: "🧰",
    },
    "🍺": {
      name: "Beer",
      itemsNeeded: ["🪣","🌾"],
      amountsNeeded: [1,2],
      required: "⚗️",
    },
    "☕": {
      name: "Coffee",
      itemsNeeded: ["🪣","🫘"],
      amountsNeeded: [1,2],
      required: "⚗️",
    },
    "🍷": {
      name: "Wine",
      itemsNeeded: ["🪣","🍇"],
      amountsNeeded: [1,2],
      required: "⚗️",
    },
    "🍹": {
      name: "Tropical Drink",
      itemsNeeded: ["🪣","🍊"],
      amountsNeeded: [1,2],
      required: "⚗️",
    },
    ":･": {
      name: "Melon Seeds",
      itemsNeeded: ["🍉"],
      amountsNeeded: [1],
      required: "",
    },
    "⚗️": {
      name: "Brewery",
      itemsNeeded: ["🪟"],
      amountsNeeded: [3],
      required: "🧰",
    },
    "🪟": {
      name: "Glass",
      itemsNeeded: ["⏳"],
      amountsNeeded: [1],
      required: "🧰",
    },
    "💊": {
      name: "Health Pill",
      itemsNeeded: ["🌿","💧"],
      amountsNeeded: [2,1],
      required: "⚗️",
    },
    "🧪": {
      name: "Regeneration Potion",
      itemsNeeded: ["🍄","🩸","🪟"],
      amountsNeeded: [1,3,1],
      required: "⚗️",
    },
    "🌡️": {
      name: "Fire Potion",
      itemsNeeded: ["🍄","🔥","🪟"],
      amountsNeeded: [1,3,1],
      required: "⚗️",
    },
    "🩹": {
      name: "Bandage",
      itemsNeeded: ["🌿","🌾"],
      amountsNeeded: [2,1],
      required: "🧰",
    },
    "🏹": {
      name: "Bow",
      itemsNeeded: ["🪵","🕸"],
      amountsNeeded: [3,4],
      required: "🧰",
    },
    "🎣": {
      name: "Fishing Rod",
      itemsNeeded: ["🪵","🕸"],
      amountsNeeded: [4,3],
      required: "🧰",
    },
    "🍪": {
      name: "Cookie",
      itemsNeeded: ["🌾","🫘"],
      amountsNeeded: [2,1],
      required: "🍳",
    },
    "𓆩𓆪​": {
      name: "Wings",
      itemsNeeded: ["🪶"],
      amountsNeeded: [4],
      required: "🔮",
    },
    "➶​": {
      name: "Arrow",
      itemsNeeded: ["🪵","🪶"],
      amountsNeeded: [1,1],
      required: "🧰",
    },
    "📕": {
      name: "Book",
      itemsNeeded: ["🪵","🪶","🌾"],
      amountsNeeded: [1,1,4],
      required: "🧰",
    },
    "🔪": {
      name: "Blade",
      itemsNeeded: ["🪵","🔩"],
      amountsNeeded: [1,5],
      required: "🧰",
    },
    "🛡️": {
      name: "Shield",
      itemsNeeded: ["🪵","🔩"],
      amountsNeeded: [1,4],
      required: "🧰",
    },
    "🪖": {
      name: "Military Helmet",
      itemsNeeded: ["💎","🔩"],
      amountsNeeded: [3,1],
      required: "🧰",
    },
    "⛑": {
      name: "Medical Helmet",
      itemsNeeded: ["💠","🔩"],
      amountsNeeded: [3,1],
      required: "🧰",
    },
    "👕": {
      name: "Chestplate",
      itemsNeeded: ["💎","🔩"],
      amountsNeeded: [4,1],
      required: "🧰",
    },
    "👖": {
      name: "Pants",
      itemsNeeded: ["💠","🪶"],
      amountsNeeded: [3,1],
      required: "🧰",
    },
    "👟": {
      name: "Shoe",
      itemsNeeded: ["💠","🪶"],
      amountsNeeded: [2,1],
      required: "🧰",
    },
    "🧱​": {
      name: "Brick Wall",
      itemsNeeded: ["🪨","⏳"],
      amountsNeeded: [2,1],
      required: "🧰",
    },
    "🔦": {
      name: "Flashlight",
      itemsNeeded: ["🪟","🔩"],
      amountsNeeded: [1,2],
      required: "🧰",
    },
    "🕹️": {
      name: "Teleporter",
      itemsNeeded: ["💠","🔩","🌠","🌌"],
      amountsNeeded: [1,3,3,1],
      required: "🧰",
    },
    "•​": {
      name: "Bullet",
      itemsNeeded: ["🔩"],
      amountsNeeded: [1],
      required: "🧰",
    },
    "📦": {
      name: "Box",
      itemsNeeded: ["🪵"],
      amountsNeeded: [6],
      required: "🧰",
    },
  };
  
  var quests = {
    "🧙": {
      name: "Witch NPC",
      qrequired: ["🍪","🥛"],
      output: "🔮",
      currentQuest: 2,
      quest2: ["If you want help for getting into the dungeon, I'll need you to do me a favor...","🗝️","🐭"],
      quest3: ["Are you the prophesized one that will slay the dragon?","🐲","🌈","🌈","🌈","🌈","🌟","🌟","🌟","⚡","⚡"],
    },
    "🧙‍♂️": {
      name: "Wizard NPC",
      qrequired: ["🌟","🌟","🌟","🌟","🌟"],
      output: "🪄",
      currentQuest: 2,
      quest2: ["You still have long ways to go apprentice. I'll teach you spells to improve your magic","🪄📖","🪄","📕","📕","📕"],
      quest3: ["You still have long ways to go student. I'll teach you spells to improve your magic","🪄📚","🏆","🪄","📕","📕","📕","📕","📕","📕"],
      quest4: ["Doing all this magic constantly makes you hungry, right? (That's how I'm so skinny). I think it's time you finally upgrade to something more musical","🎸","🪄","✨","✨","🌟","🌟","🪵","🪵","🔩","🕸️","🕸️","🕸️"]
    },
    "🧑‍🌾": {
      name: "Farmer NPC",
      qrequired: ["🌽","🌽","🌽","🌽","🌽","🍅","🍅","🍅","🍅","🍅","🥬","🥬","🥬","🥬","🥬","🫘","🫘","🫘","🫘","🫘","🥔","🥔","🥔","🥔","🥔"],
      output: "💩",
      currentQuest: 2,
      quest2: ["I'll give you some new fruit to grow if you can get me a good old beer (you'll need to make a brewery with glass)","🍇","🍺"],
      quest3: ["Thanks for the crops, to make things more automatic, get me some more and I'll help make it easier.","🚜","🌽","🌽","🌽","🌽","🌽","🌽","🌽","🍅","🍅","🍅","🍅","🍅","🍅","🍅","🥬","🥬","🥬","🥬","🥬","🥬","🥬","🫘","🫘","🫘","🫘","🫘","🫘","🫘","🥔","🥔","🥔","🥔","🥔"],
      quest4: ["I'll give you some new fruit to grow if you can get me a nice wine (I'm not an alcoholic, I swear)","🍉","🍷"],
      quest5: ["There's nothing I love more than dogs. I'll give you one of mine for something","🐕","🦴","🍹"],
      quest6: ["There's nothing I love more than dogs. I'll give you one of mine for something","🐶","🦴","🍺","🍷"],
      quest7: ["Thanks for doing all of my quests!","​","​"]
    },
    "🧑‍🔧": {
      name: "Mechanic NPC",
      qrequired: ["🍔"],
      output: "🤖",
      currentQuest: 2,
      quest2: ["You want to get into space, eh? If you give the materials, I think I could make that happen","🚀","🔩","🔩","🔩","🔩","🔩","🔩","⚙","🪙","🪙","🪙","🪙","🪙","🌌"],
      quest3: ["Is it true that there's alien life out there? If you can get me some UFO parts, I'll see what I can make","👽","🌠","🌠","🌠","🌠","🌠"],
      quest4: ["Thanks for doing all of my quests!","​","​"]
    },
    "👷‍♂️": {
      name: "Miner NPC",
      qrequired: ["🍕"],
      output: "🐀",
      currentQuest: 2,
      quest2: ["I'll help you upgrade your pickaxe!","⚒","⛏","🔩","🔩","🔩","🔩","🔩","🔩","🪙","💎","💠","⚙"],
      quest3: ["I'll help you upgrade your axe!","🪚","🪓","🔩","🔩","🔩","🔩","🔩","🔩","🪙","🪵","🪵","🪵","🪵","🪵","🪵","🪵","🪵","🪵","🪵","🪵"],
      quest4: ["Whenever I feel lonely I think about pets. I'll give you one of mine for something","🐈","🐟"],
      quest5: ["Whenever I feel lonely I think about pets. I'll give you one of mine for something","🐱","🐟"],
      quest6: ["Thanks for doing all of my quests!","​","​"]
    },
    "🥷": {
      name: "Ninja NPC",
      qrequired: ["🗡️","🔪"],
      output: "⚔️",
      currentQuest: 2,
      quest2: ["Like your improved weapon? I'll help you upgrade it and make it more deadly","⚔️🩸","🎖️","⚔️","🩸"],
      quest3: ["Like your improved weapon? I'll help you upgrade it and make it more shiny","⚔️💎","🏆","⚔️","💎"],
      quest4: ["Like your new weapon? I'll help you upgrade it and make it luckier","⚔️☘️","🏆","⚔️","☘️"],
      quest5: ["Like your improved weapon? I'll help you upgrade it and make it frostier","⚔️❄️","🏆","⚔️","❄️"],
      quest6: ["Like your improved weapon? I'll help you upgrade it and make it more firey","⚔️🔥","🏆","⚔️","🔥"],
      quest7: ["Like your improved weapon? I'll help you upgrade it and make it more sparkly","⚔️✨","🏆","⚔️","✨"],
      quest8: ["Like your improved weapon? I'll help you upgrade it and make it the ultimate weapon","⚔️🥇","⚔️","🥇"],
      quest9: ["Thanks for doing all of my quests!","​","​"]
    },
    "🧝‍♂️": {
      name: "Archer NPC",
      qrequired: ["🏹","🌸","🌸","🌷"],
      output: "🏹💘",
      currentQuest: 2,
      quest2: ["It's time to upgrade from that bow.","🔫","🏹","🔩","🔩","🔩","🪙","🪙"],
    }
  };
  
  var weaponProperties = {
    "👊": {
      name: "Fist",
      damage: 1,
      itemType: "👊",
    },
    "🗡️": {
      name: "Dagger",
      damage: 1,
      itemType: "🗡️",
      sub: 0,
    },
    "⛏️": {
      name: "Pickaxe",
      damage: 1,
      itemType: "⛏️",
      sub: 0,
    },
    "🪓": {
      name: "Axe",
      damage: 1,
      itemType: "🪓",
      sub: 0,
    },
    "🔪": {
      name: "Blade",
      damage: 3,
      itemType: "🗡️",
      sub: 1,
    },
    "⚔️": {
      name: "Double Sword",
      damage: 4,
      itemType: "🗡️",
      sub: 2,
    },
    "⚒": {
      name: "Pick & Hammer",
      damage: 2,
      itemType: "⛏️",
      sub: 3,
    },
    "🪚": {
      name: "Saw",
      damage: 2,
      itemType: "🪓",
      sub: 4,
    },
    "🪄": {
      name: "Magic Wand",
      damage: 2,
      itemType: "🗡️",
    },
  };
  
  var armorProperties = {
    "🧢": {
      name: "Cap",
      protection: 2,
      slot: 0,
    },
    "🪖": {
      name: "Military Helmet",
      protection: 3,
      slot: 0,
    },
    "🎩": {
      name: "Tophat",
      protection: 4,
      slot: 0,
    },
    "💫": {
      name: "Star Crown",
      protection: 10,
      slot: 0,
    },
    "⛑️": {
      name: "Medical Helmet",
      protection: 4,
      slot: 0,
    },
    "👕": {
      name: "Chestplate",
      protection: 3,
      slot: 1,
    },
    "🛡️": {
      name: "Shield",
      protection: 3,
      slot: 4,
    },
    "👟": {
      name: "Shoe",
      protection: 3,
      slot: 3,
    },
    "🥾": {
      name: "Boot",
      protection: 4,
      slot: 3,
    },
    "👢": {
      name: "Tall Boot",
      protection: 5,
      slot: 3,
    },
    "🩳": {
      name: "Shorts",
      protection: 2,
      slot: 2,
    },
    "👖": {
      name: "Pants",
      protection: 4,
      slot: 2,
    },
  };
  
  var farmCrops = {
    "🍅": {"name": "Tomato", "seed": "𓇠"},
    "🌽": {"name": "Corn", "seed": "𓇢"},
    "🥔": {"name": "Potato", "seed": "𓄺"},
    "🥬": {"name": "Lettuce", "seed": "⌁"},
    "🍇": {"name": "Grapes", "seed": "❦"},
    "🏖": {"name": "Sand", "seed": "𓇼"},
    "🫘": {"name": "Beans", "seed": "𓇡"},
    "🌾": {"name": "Wheat", "seed": "."},
    "🍈": {"name": "Melon", "seed": ":･"},
    "🌳": {"name": "Tree", "seed": "˖"},
    "🌲": {"name": "Evergreen Tree", "seed": "↟"},
    "🍄": {"name": "Mushroom", "seed": "𓍊"},
  };
  
  var bosses = {
    "💩": {
      name: "Mr. Poop",
      base_emoji: "💩",
      hearts: "🤎",
      health: 20,
      loot: ["🎖️","🪖"],
      enraged: "🤢",
      angry: "😡",
      damage: 3,
      level: 0,
    },
    "🤖": {
      name: "Roboto",
      base_emoji: "🤖",
      hearts: "⚙",
      health: 40,
      loot: ["🏆","⚙"],
      enraged: "💢",
      angry: ":-\\",
      damage: 6,
      level: 0,
    },
    "🐀": {
      name: "Rat King",
      base_emoji: "🐀",
      hearts: "💚",
      health: 50,
      loot: ["🏆","🐭"],
      enraged: "🤮",
      angry: "🐭",
      damage: 10,
      level: -1,
    },
    "🤡": {
      name: "The Joker",
      base_emoji: "🤡",
      hearts: "🤍",
      health: 50,
      loot: ["🏆","🎭","🎈"],
      enraged: "😵‍💫",
      angry: "🤬",
      damage: 15,
      level: -3,
    },
    "🪬": {
      name: "Hamsa",
      base_emoji: "🪬",
      hearts: "🫀",
      health: 60,
      loot: ["🏆","👁"],
      enraged: "😰",
      angry: "🪬",
      damage: 20,
      level: 0, //fix
    },
    "🐲": {
      name: "Dragonic",
      base_emoji: "🐲",
      hearts: "💚",
      health: 50,
      loot: ["🏆","🌌","🌌","🐉"],
      enraged: "😤",
      angry: "🐉",
      damage: 25,
      level: 0, //fix
    },
    "👽": {
      name: "Alien",
      base_emoji: "👽",
      hearts: "💙",
      health: 50,
      loot: ["🏆","💫"],
      enraged: "😣",
      angry: "👽",
      damage: 25,
      level: 0,
    },
    "👹": {
      name: "Lucifer",
      base_emoji: "👹",
      hearts: "❤‍🔥",
      health: 60,
      loot: ["🏆","🥇","❤‍🔥"],
      enraged: "👺",
      angry: "👺",
      damage: 45,
      level: 0,
    },
  };
  
  var currentProjectiles = [];
  var current_map = [];
  var level = 0;

  var terrain_map = [
   [ "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌊", "☘️", "🌲", " ", "🌿", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌊", "🌿", " ", "🌳", " ", " ", "🌾", " ", " ", " ", " ", " ", " ", "🌵", " ", " ", "🌴", " ", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌲", " ", " ", "🌿", " ", " ", " ", " ", "🌳", " ", " ", " ", "🌱", " ", "🌵", " ", " ", "🌵", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", " ", "🌲", "🌿", " ", "🌲", "🌱", "🌾", " ", " ", " ", "🌾", " ", " ", " ", " ", "🌵", " ", " ", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌿", "🌷", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "🌵", " ", " ", " ", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", " ", "🌲", "🌿", " ", "🌳", " ", " ", " ", "🌱", "🌳", " ", " ", " ", " ", "🌵", " ", " ", " ", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌸", " ", " ", "🌾", " ", " ", " ", "🌱", " ", " ", " ", " ", " ", " ", " ", " ", " ", "🌵", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌴", " ", " ", " ", " ", " ", "🌳", " ", "🏚️", " ", " ", " ", "🏠", " ", "🌱", " ", " ", " ", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", " ", " ", "🕳️", " ", " ", " ", " ", " ", " ", " ", " ", " ", "🌱", " ", " ", " ", " ", "🏖", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", " ", " ", " ", " ", " ", " ", " ", " ", "🌾", " ", "🌳", " ", " ", "🌾", " ", " ", " ", "🏖", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🏖", " ", "🌱", " ", "🌾", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "🗻", " ", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🏖", " ", " ", " ", " ", " ", " ", " ", " ", "🌱", " ", " ", " ", "🕳️", " ", "🏔️", " ", "🌴", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌴", " ", " ", " ", " ", " ", "🌳", " ", " ", " ", " ", " ", " ", " ", "🏔️", "🌷", "🏢", " ", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🏖", "🌽", "🌽", "🌽", "🌽", "🌽", "🌽", " ", "🛖", " ", " ", "🌳", "🏠", "🗻", "🏔️", " ", " ", " ", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", " ", "🥬", "🥬", "🥬", "🥬", "🥬", "🥬", " ", "🌾", " ", " ", " ", " ", "🗻", " ", " ", "🌋", " ", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", " ", "🫘", "🫘", "🫘", "🫘", "🫘", "🫘", " ", " ", " ", " ", " ", " ", " ", "🌸", " ", " ", " ", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", " ", "🥔", "🥔", "🥔", "🥔", "🥔", "🥔", "", "🌷", " ", " ", " ", "🌱", " ", " ", "🌱", " ", "🌊", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌊", "🍅", "🍅", "🍅", "🍅", "🍅", "🍅", " ", " ", " ", " ", " ", " ", " ", " ", "🌷", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊" ],
   [ "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊" ]
 ];

  var cave_map = [
   [ "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "🪨", "🪨", "🪨", " ", " ", " ", " ", "🪨", "🪨", "🪨", " ", " ", " ", " ", " ", "🪨", "🪨", "🪨", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "🪨", " ", "🪨", " ", "🪨", "🪨", " ", " ", " ", " ", " ", " ", "🪨", "🪨", " ", " ", "🪨", "🪨", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "🪨", " ", " ", " ", " ", "🪨", "🪨", " ", " ", " ", "🪨", "🪨", "🪨", "🪨", "🪨", " ", "🕸️", "🪨", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", " ", " ", " ", " ", "🍄", " ", "🪨", "🪨", " ", "🪨", "🪨", "🕸️", " ", "🪨", "🪨", " ", "🍄", "🪨", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", " ", "🏚️", "🪨", " ", " ", "🍄", " ", "🪨", "🪨", "🪨", " ", " ", "🍄", "🪨", " ", " ", " ", " ", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", " ", "🪨", "🪨", "🪨", "🍄", " ", " ", "🪨", "🪨", " ", " ", " ", " ", "🪨", "🪨", " ", " ", "🍄", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", " ", " ", " ", "🪨", "🪨", "🕸️", "🪨", "🪨", " ", "🪨", " ", " ", " ", " ", "🪨", "🪨", " ", " ", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", " ", " ", " ", " ", "🪨", "🪨", "🪨", " ", " ", "🪨", "🪨", " ", " ", " ", " ", " ", " ", " ", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "🪨", " ", "🪜", " ", "🪨", "🪨", " ", " ", " ", "🪨", "🪨", "🪨", " ", " ", "🪨", "🍄", " ", " ", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "🪨", " ", " ", " ", " ", " ", " ", " ", " ", "🪨", " ", " ", " ", "🪨", "🪨", " ", "🍄", " ", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "🪨", " ", " ", " ", "🪨", "🪨", "🪨", " ", "🪨", " ", " ", " ", "🪨", "🪨", " ", "🪨", "🪨", " ", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "🪨", "🪨", " ", " ", " ", " ", "🪨", " ", " ", "🕷️", "🏰", " ", "🪨", "🪜", " ", "🪨", " ", " ", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "🪨", " ", " ", "🪨", " ", " ", "🪨", " ", " ", " ", " ", " ", " ", " ", " ", "🪨", " ", " ", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", " ", " ", "🪨", "🪨", " ", "🪨", "🪨", "🪨", "🕸️", " ", " ", " ", " ", "🪨", "🪨", "🪨", " ", " ", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "🪨", " ", "🪨", " ", " ", " ", "🪨", "🪨", "🪨", " ", " ", "🪨", " ", "🪨", " ", " ", "🌋", " ", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", " ", " ", " ", " ", " ", " ", " ", " ", "🪨", "🪨", " ", " ", "🪨", "🪨", "🪨", " ", " ", " ", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", " ", " ", " ", "🍄", "🪨", "🪨", " ", " ", " ", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", " ", " ", "🪨", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🕸️", " ", " ", " ", " ", " ", " ", " ", " ", " ", "🪨", "🪨", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛" ],
   [ "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛" ]
 ];
  
  var house_map = [
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," ","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🧱","🧱","🪟","🧱","🧱","🪟","🧱","🪟","🧱"," "," "," ","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🧱","🛋️","🪑","📺","🧱","🗑️","🛋️","📻","🧱"," "," "," ","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🧱"," ","🧑‍🔧"," ","🧱"," ","🥷"," ","🧱"," "," "," ","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🧱"," "," "," ","🧱"," "," "," ","🧱"," "," "," ","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🧱"," "," ","🛏️","🧱","🛏️"," "," ","🧱"," "," "," ","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🧱","🚪","🧱","🪟","🧱","🧱","🧱","🚪","🧱","🌫️","🪟","🌫️","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","🌫️","🏹","🌫️","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🟥","🚪","🟥","🟥","🟪","🟪","🟪","🚪","🟪","🌫️","🧝‍♂️","🌫️","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🪟"," "," ","🟥","🟪"," "," "," ","🟪","🚪"," ","🪟","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🟥"," "," ","🟥","🟪"," "," "," ","🟪","🌫️"," ","🪟","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🪟"," "," ","🟥","🟪","🔮","🧙‍♂️","🧙","🟪","🌫️"," ","🌫️","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🟥","🧑‍🌾","🧺","🟥","🟪","🪟","🟪","🪟","🟪","🌫️"," ","🌫️","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," ","🟥","🟥","🟥","🟥"," "," "," "," "," ","🪟"," ","🌫️","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","🌫️","🎯","🌫️","⬛"," "," "," "],
    [" "," "," ","⬛"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","🌫️","🌫️","🌫️","⬛"," "," "," "],
    [" "," "," ","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛"," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "]
  ];
  
var dungeon_map = [
    ["🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🧱","🧱","🧱","🧱","🧱","🟪","🟪","🟪","🟪","♒","🟪","🟪","🟪","🟪","♒","🟪","🟪","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🧱","🪑","  ","📻","🧱","🟪"," "," "," ","🟪","👻","🟪"," "," "," ","🔒"," ","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🧱","👷‍♂️","  ","  ","🧱","♒"," ","📦"," ","🔒"," ","🔒"," ","📦"," ","🟪"," ","♒","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🧱","  ","  ","🧱","🧱","🟪"," "," "," ","🟪"," ","♒"," "," ","🟪","🟪"," ","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🧱","  ","  ","🧱","🟪","🟪","🟪","🔒","🟪","🟪"," ","🟪","🟪","🟪","♒"," "," ","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🧱","  ","🛏️","🧱","🟪"," "," "," "," ","🟪"," ","🟪","💣","💣","🟪"," "," ","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🧱","🚪","🧱","🧱","♒"," ","🧨","🧨"," ","♒"," ","🟪"," "," ","🔒"," ","📦","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","  ","  ","  ","  ","🟪"," ","🧨"," "," ","🟪"," ","🟪"," ","💣","🟪","🟪","🟪","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🟪","🟪","🟪","🟪","🟪"," ","🧨","🧨"," ","🟪"," ","🟪"," "," "," "," "," ","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🟪"," ","⛩️"," ","🟪"," "," "," ","🟪","🟪","🔐","🟪","🟪","🟪","🟪","♒","🔒","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","♒"," "," "," ","🟪","🟪","🔒","🟪","🟪","  ","  ","  ","♒"," ","🐍"," "," ","♒","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🟪"," "," "," ","🟪","🐍"," ","🐍","🟪","  ","🏰","  ","🟪"," ","🧨","📦","🐍","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🟪","🟪","🔒","🟪","♒"," ","🐍"," ","♒","  ","  ","  ","🟪","🐍"," "," "," ","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🟪"," "," "," ","🟪"," ","🐍"," ","🟪","🟪","🟪","🟪","🟪","🟪","♒","🐍","🧨","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🟪"," ","🪬"," ","🟪","🐍"," ","🐍"," ","🐍","🟪"," "," "," ","🟪"," ","🧨","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","♒"," "," "," ","🔒","🐍"," "," ","📦"," ","♒"," ","🤡"," ","🔒","🐍"," ","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🟪"," "," "," ","🟪"," ","🐍","🐍"," ","🐍","🟪"," "," "," ","🟪"," "," ","♒","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","🟪","🟪","♒","🟪","🟪","🟪","🟪","🟪","🟪","🟪","🟪","🟪","🟪","♒","🟪","🟪","🟪","🟪","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨"],
    ["🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨", "🪨"]
  ];

  var sky_map = [
    ["☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," "," "," "," "," "," "," ","☁️","☁️","☁️"," "," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," ","☁️","☁️"," "," "," "," "," "," ","❄️"," "," "," "," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," "," "," "," "," "," "," "," "," ","❄️"," "," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜","☁️","☁️"," "," "," "," "," "," "," "," "," "," ","❄️"," "," "," ","☁️"," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜","🌩️","⛈️","⛈️"," "," "," ","☁️","☁️"," "," "," "," "," "," "," "," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," ","☁️","☁️","☁️","☁️"," "," "," ","☁️","☁️"," "," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","☁️"," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," "," "," "," ","☁️","☁️"," "," "," "," "," ","☁️","☁️","☁️","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," ","☁️","☁️"," "," "," "," "," "," "," "," "," ","☁️","☁️"," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," "," ","☁️","☁️"," "," "," "," "," "," "," ","☁️","☁️"," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," "," "," "," "," "," ","☁️","☁️"," "," "," "," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," ","☁️","☁️"," "," "," "," "," "," "," "," "," "," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," ","🌧️","🌧️","🌧️"," "," "," "," "," "," "," "," "," ","☁️","☁️"," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," "," "," "," "," "," ","☁️"," "," "," ","☁️","☁️","☁️","☁️","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️"],
    ["☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️","☁️"]
  ];
  
  var hell_map = [
   [ "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🔥", "🔥", "🔥", " ", " ", " ", " ", "🔥", "🔥", "🔥", " ", " ", " ", " ", " ", "🔥", "🔥", "🔥", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🔥", " ", "🥀", " ", "🔥", "🔥", " ", " ", " ", " ", " ", "🥀", "🔥", "🔥", " ", " ", "🔥", "🔥", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🔥", " ", " ", " ", " ", "🔥", "🔥", " ", " ", " ", "🔥", "🔥", "🔥", "🔥", "🔥", " ", "🌋", "🔥", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", " ", " ", " ", " ", "🌋", " ", "🔥", "🔥", "🥀", "🔥", "🔥", "🌋", " ", "🔥", "🥀", " ", "🌋", "🔥", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", " ", "🌋", "🔥", " ", " ", " ", " ", "🔥", "🔥", "🔥", " ", " ", "🌋", "🔥", " ", " ", " ", " ", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", " ", "🔥", "🔥", "🔥", "🌋", "🥀", " ", "🔥", "🔥", " ", "🥀", " ", " ", "🔥", "🔥", " ", " ", "🌋", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", " ", " ", "🔥", "🔥", "🔥", "🌋", "🔥", "🔥", "🌋", " ", " ", " ", "🌋", " ", "🔥", "🔥", " ", " ", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🥀", " ", " ", " ", "🔥", "🔥", "🔥", "🥀", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🔥", " ", " ", " ", "🔥", "🔥", " ", " ", " ", " ", " ", " ", " ", " ", "🔥", "🥀", " ", " ", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🔥", " ", "⛩️", " ", " ", " ", " ", " ", " ", " ", " ", " ", "🥀", "🔥", "🔥", " ", "🥀", " ", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🔥", " ", " ", " ", "🔥", "🔥", "🔥", " ", " ", " ", " ", " ", "🔥", "🔥", "🥀", "🔥", "🔥", " ", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🔥", "🔥", " ", " ", " ", "🌋", "🔥", " ", " ", " ", "🌋", " ", "🔥", " ", " ", "🔥", " ", " ", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🔥", " ", " ", "🔥", " ", " ", "🔥", "🥀", " ", " ", " ", " ", " ", " ", " ", "🔥", " ", " ", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", " ", " ", "🔥", "🔥", " ", "🔥", "🔥", "🔥", "🌋", " ", " ", " ", " ", "🔥", "🔥", "🔥", " ", " ", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🔥", " ", "🔥", "🥀", " ", " ", " ", "🔥", "🔥", " ", "🌋", "🔥", "🥀", "🔥", " ", " ", "🌋", " ", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", " ", " ", " ", " ", " ", " ", " ", "🔥", "🔥", "🔥", " ", " ", "🔥", "🔥", "🔥", " ", " ", " ", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🥀", " ", " ", "🌋", "🔥", "🔥", "🥀", " ", " ", "🔥", "🔥", "🔥", "🔥", "🔥", "🥀", " ", "🥀", "🔥", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🌋", " ", " ", " ", " ", " ", " ", " ", " ", " ", "🔥", "🔥", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🟥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥" ],
   [ "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥", "🔥" ]
 ];
  
  var space_map = [
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","🪐"," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," ","🪐"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," ","🌕"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","🪐"," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," ","🌎"," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","🪐"," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," ","🪐"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","🪐"," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "]
  ];
  
  var moon_map = [
    ["🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," "," "," "," "," "," "," "," ","🌗"," "," "," "," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," ","🌕"," "," "," "," "," ","🌖"," ","🌗"," "," ","🌒"," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," "," "," "," "," "," "," "," ","🌗"," "," "," "," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," "," "," "," "," "," "," "," ","🌗"," "," "," "," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," "," "," "," "," "," "," "," ","🌗"," "," "," "," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," "," ","🛰️","🌖"," "," "," "," ","🌗"," "," "," "," ","⛺"," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," ","🏗️"," "," "," "," "," "," ","🌗"," "," ","🏕️"," "," ","⛺","🌒"," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," ","📡"," "," "," "," "," ","🚧"," ","🌗"," "," ","⛺"," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," ","👨‍🚀"," ","🏗️"," "," ","🚧"," ","🌗"," "," "," "," ","🧌"," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛","🏗️"," "," "," "," "," "," ","🚧"," ","🌗"," "," "," "," "," "," ","⛺"," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," ","🛰️"," ","📡"," "," "," ","🚧"," ","🌗"," "," "," ","⛺"," ","🏕️"," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," ","🚌"," "," "," "," "," "," ","🌗"," "," "," "," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," "," "," "," "," "," ","🌖"," ","🌗"," "," "," "," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," ","🌖"," "," "," "," "," "," "," ","🌗"," "," "," "," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," "," "," "," "," "," "," "," ","🌗"," "," ","🌒"," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," "," "," "," "," "," "," "," ","🌗"," "," "," "," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," ","🌖"," "," "," "," "," "," ","🌗"," "," "," "," "," "," ","🌑"," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛"," "," "," "," "," "," "," "," "," ","🌗"," "," "," "," "," "," "," "," ","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","⬛","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑"],
    ["🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌕","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑","🌑"]
  ];
  
  current_map = terrain_map;
  var playerTile = current_map[9][9];
  var gridElement = document.getElementById("emojiGrid");
  var coordinatesElement = document.getElementById("coordinates");
  var healthBarElement = document.getElementById("healthBar");
  var viewportElement = document.getElementById("viewport");
  let tooltip = document.getElementById("tooltip");
  let itemName = document.getElementById("item-name");
  let sunmoon = document.getElementById("sunmoon");
  var inputBox = document.getElementById("inputBox");
  var phaseOnce = true;
  
  let playerPosition = { x: 5, y: 5 };
  let bossPosition = { x: 1, y: 1 };
  let chestPosition = {};
  let limitedVision = {};
  let blackSquare = "⬛";
  
  // Generate box loot
  var boxLoot = [];
  var boxValueLoot = [];
  
  function RNG(n) {
    const randomValue = Math.random();

    if (randomValue < 1 / n) {
      return " ";
    } else {
      return String(Math.floor(Math.random() * (n - 1)) + 2);
    }
  }

  for (let i = 0; i < dungeon_map.length; i++) {
    for (let j = 0; j < dungeon_map[i].length; j++) {
      if (dungeon_map[i][j] == "📦") {
        var newLootEntry = [j, i];
        var newValueEntry = [j, i];

        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 4; col++) {
            const randomChance = Math.random();
            let lootType = "";
            let lootValue = "";

            switch (true) {
              case randomChance < 0.2:
                lootType = "🕸️"; // 20% chance
                lootValue = RNG(3);
                break;
              case randomChance < 0.5:
                lootType = "🍞"; // 30% chance
                lootValue = RNG(3);
                break;
              case randomChance < 0.6:
                lootType = "🍔"; // 10% chance
                lootValue = RNG(3);
                break;
              default:
                lootType = "";
                lootValue = "";
                break;
            }

            newLootEntry.push(lootType);
            newValueEntry.push(lootValue);
          }
        }

        // Add the new loot and value entries to the respective arrays
        boxLoot.push(newLootEntry);
        boxValueLoot.push(newValueEntry);
      }
    }
  }
  
  function replaceItem(items,replace,value) {
    for (let i = 0; i < Inventory.length; i++) {
      for (let j = 0; j < Inventory[i].length; j++) {
        if (Inventory[i][j] === items) {
          Inventory[i][j] = replace;
          inventoryValue[i][j] = value;
          return;
        }
      }
    }
  }
  
  function ifBox(s1,s2,s3,s4) {
    if (adjacent.includes("📦")) {
      for (let i = 0; i < boxLoot.length; i++) {
        const lootEntry = boxLoot[i];
        const valueEntry = boxValueLoot[i];

        if (chestPosition.x == lootEntry[0] && chestPosition.y == lootEntry[1]) {
          let pos = s3 * 9 + s4 + 2;
          if (Inventory[s1][s2] != undefined && lootEntry[pos] != undefined) {
            if (lootEntry[pos] != "") {
              if (Inventory[s1][s2] == "") {
                Inventory[s1][s2] = lootEntry[pos];
                inventoryValue[s1][s2] = valueEntry[pos];
                lootEntry[pos] = "";
                valueEntry[pos] = "";
              } else if (Inventory[s1][s2] != "") {
                let temp = Inventory[s1][s2];
                let temp2 = inventoryValue[s1][s2];
                Inventory[s1][s2] = lootEntry[pos];
                inventoryValue[s1][s2] = valueEntry[pos];
                lootEntry[pos] = temp;
                valueEntry[pos] = temp2;
              }
            } else if (lootEntry[pos] == "") {
              lootEntry[pos] = Inventory[s1][s2];
              valueEntry[pos] = inventoryValue[s1][s2];
              Inventory[s1][s2] = "";
              inventoryValue[s1][s2] = "";
            }
          }
        }
      }
    } else {
      swapItems(Inventory,s1,s2,s3,s4);
      swapItems(inventoryValue,s1,s2,s3,s4);
    }
  }

  function goBack() {
    if (direction == "up") {
      moveY++;
    } else if (direction == "down") {
      moveY--;
    }
    if (direction == "left") {
      moveX++;
    } else if (direction == "right") {
      moveX--;
    }
  }

  function dim() {
    switch (level) {
      case 0:
        return terrain_map;
        break;
      case 1:
        return sky_map;
        break;
      case 2:
        return space_map;
        break;
      case -1:
        return cave_map;
        break;
      case -2:
        return hell_map;
        break;
      case -3:
        return dungeon_map;
        break;
      case 3:
        return house_map;
        break;
    }
  }
  
  function damage(amount) {
    // Calculate protection
    let totalProtection = 0;
    for (let item of armor) {
      totalProtection += armorProperties[item]?.protection || 0;
    }
    const factor = 1 - totalProtection / 80; // damage probability
    //const probability = 1 - Math.pow(factor, amount);

    const newAmount = Math.ceil(amount / (totalProtection / 2));
    
    // Apply damage & other stuff
    if (playerHealth - newAmount < 0) {
      playerHealth = 0;
    } else if (!raisedShield) {
      playerHealth -= newAmount;
    }
    
    PLAYER_EMOJI = "🤕";
    damageColor = "#992222";

    setTimeout(() => {
      damageColor = cellColor;
    }, damageTick);
  }
  
  function loadBossFight(boss) {
    boss_mode = true;
    win = false;
    damageTick = 100;
    speed = 500;
    
    BOSS_EMOJI = bosses[boss];
    BOSS = bosses[boss].base_emoji;
    BOSS_LOOT = bosses[boss].loot;
    BOSS_ENRAGED = bosses[boss].enraged;
    ANGRY = bosses[boss].angry;
    BOSS_HEARTS = bosses[boss].hearts;
    MAX_BOSS_HEALTH = bosses[boss].health;
    BOSS_DAMAGE = bosses[boss].damage;
    bossHealth = MAX_BOSS_HEALTH;
  }
    
  function addInventory(slot) {
    let success = false;
    for (let i = 0; i < Inventory.length; i++) {
      for (let j = 0; j < Inventory[i].length; j++) {
        if (Inventory[i][j] === slot) {
          if (inventoryValue[i][j] == "") {
            inventoryValue[i][j] = " ";
            success = true;
            return;
          } else if (inventoryValue[i][j] == " ") {
            inventoryValue[i][j] = 2;
            success = true;
            return;
          } else if (inventoryValue[i][j] >= 2) {
            inventoryValue[i][j]++;
            success = true;
            return;
          }
        }
      }
    }
    if (!success) {
      for (let i = 0; i < Inventory.length; i++) {
        for (let j = 0; j < Inventory[i].length; j++) {
          if (Inventory[i][j] === "") {
            Inventory[i][j] = slot;
            inventoryValue[i][j] = " ";
            if (showInv != "") {
              openInventory();
            }
            return;
          }
        }
      }
    }
  }
  
  function removeInventory(slot) {
    for (let i = 0; i < Inventory.length; i++) {
      for (let j = 0; j < Inventory[i].length; j++) {
        if (Inventory[i][j] === slot) {
          if (inventoryValue[i][j]== " ") {
            Inventory[i][j] = "";
            inventoryValue[i][j]== "";
            HAND_EMOJI = "👊";
            return;
          } else if (inventoryValue[i][j] == 2) {
            inventoryValue[i][j] = " ";
            return;
          } else if (inventoryValue[i][j] >= 3) {
            inventoryValue[i][j]--;
            return;
          }
        }
      }
    }
  }

  function createCellElement(emoji) {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.style.backgroundColor = damageColor;
    cellElement.textContent = emoji;

    return cellElement;
  }
  
  function summonMob(matrix,mob) {
    const numRows = matrix.length;
    const numColumns = matrix[0].length;
    const randomRow = Math.floor(Math.random() * numRows);
    const randomColumn = Math.floor(Math.random() * numColumns);
    if (matrix[randomRow][randomColumn] === " " && !boss_mode) {
      matrix[randomRow][randomColumn] = mob;
    }
  }
  
  function moveMob(matrix,mob) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === mob) {
          let rng = Math.floor(Math.random() * 4);
          if (matrix[row + 1][col] === " " && rng == 0) {
            matrix[row][col] = " ";
            matrix[row + 1][col] = mob;
          } else if (matrix[row - 1][col] === " " && rng == 1) {
            matrix[row][col] = " ";
            matrix[row - 1][col] = mob;
          } else if (matrix[row][col + 1] === " " && rng == 2) {
            matrix[row][col] = " ";
            matrix[row][col + 1] = mob;
          } else if (matrix[row][col - 1] === " " && rng == 3) {
            matrix[row][col] = " ";
            matrix[row][col - 1] = mob;
          }
        }
      }
    }
  }
  
    
  function movePet(matrix,mob) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === mob) {
          
          // Random
          if (Math.random() < 0.55) {
            let rng = Math.floor(Math.random() * 4);
            if (matrix[row + 1][col] === " " && rng == 0) {
              matrix[row][col] = " ";
              matrix[row + 1][col] = mob;
            } else if (matrix[row - 1][col] === " " && rng == 1) {
              matrix[row][col] = " ";
              matrix[row - 1][col] = mob;
            } else if (matrix[row][col + 1] === " " && rng == 2) {
              matrix[row][col] = " ";
              matrix[row][col + 1] = mob;
            } else if (matrix[row][col - 1] === " " && rng == 3) {
              matrix[row][col] = " ";
              matrix[row][col - 1] = mob;
            }
          }
          // Intentional
          else {
            let Row = row;
            let Col = col;
            let dx = moveX + 4 - Col;
            let dy = moveY + 4 - Row;
            let absDx = Math.abs(dx);
            let absDy = Math.abs(dy);

            if (absDx > absDy) {
              Col += dx > 0 ? 1 : -1;
            } else {
              Row += dy > 0 ? 1 : -1;
            }

            if (matrix[Row][Col] == " ") { 
            matrix[row][col] = " ";
            matrix[Row][Col] = mob;
            } else {
              let randomDirection = Math.floor(Math.random() * 4);
              Row = row;
              Col = col;

              if (randomDirection === 0) {
                Row += 1; // Move down
              } else if (randomDirection === 1) {
                Row -= 1; // Move up
              } else if (randomDirection === 2) {
                Col += 1; // Move right
              } else if (randomDirection === 3) {
                Col -= 1; // Move left
              }

              if (Row >= 0 && Row < matrix.length && Col >= 0 && Col < matrix[row].length && matrix[Row][Col] == " ") {
                matrix[row][col] = " ";
                matrix[Row][Col] = mob;
              }
            }
          }
        }
      }
    }
  }
  
  function moveEnemy(matrix,mob,amount) {
    if (!boss_mode) {
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (matrix[row][col] === mob) {
            let Row = row;
            let Col = col;
            let dx = moveX + 4 - Col;
            let dy = moveY + 4 - Row;
            let absDx = Math.abs(dx);
            let absDy = Math.abs(dy);
            
            if (Col == moveX + 4 && Row == moveY + 4 || adjacent.includes(mob)) {
              if (time % 3 == 0) {damage(amount)}
            }

            if (absDx > absDy) {
              Col += dx > 0 ? 1 : -1;
            } else {
              Row += dy > 0 ? 1 : -1;
            }

            if (matrix[Row][Col] == " ") { 
            matrix[row][col] = " ";
            matrix[Row][Col] = mob;
            } else {
              let randomDirection = Math.floor(Math.random() * 4);
              Row = row;
              Col = col;

              if (randomDirection === 0) {
                Row += 1; // Move down
              } else if (randomDirection === 1) {
                Row -= 1; // Move up
              } else if (randomDirection === 2) {
                Col += 1; // Move right
              } else if (randomDirection === 3) {
                Col -= 1; // Move left
              }

              if (Row >= 0 && Row < matrix.length && Col >= 0 && Col < matrix[row].length && matrix[Row][Col] == " ") {
                matrix[row][col] = " ";
                matrix[Row][Col] = mob;
              }
            }
          }
        }
      }
    }
  }
    
  function updateProj(matrix) {
    const arrowsToUpdate = [];

    // Find the positions of arrows that need to be updated or removed
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        const currentCell = matrix[row][col];
        let list = ["➶","➴","↢","➵", "✨","✨​","✨​​","✨​​​", "'","'​","-","-​", "☘","☘​","☘​​","☘​​​", "🍀","🍀​","🍀​​","🍀​​​", "🌀","🌀​","🌀​​","🌀​​​", "⭐","⭐​","⭐​​","⭐​​​", "❄️​","❄️​​","❄️​​​","❄️​​​​", "🔥​","🔥​​","🔥​​​","🔥​​​​", "🐰","🐰​","🐰​​","🐰​​​", "🐸","🐸​","🐸​​","🐸​​​", "🎵","🎵​","🎵​​","🎵​​​", "🎶","🎶​","🎶​​","🎶​​​"];

        // Arrow
        for (let i = 0; i < list.length; i += 4) {
          if (currentCell === list[i]) {
            arrowsToUpdate.push({ row, col, newRow: row - 1, newCol: col });
          } else if (currentCell === list[i+1]) {
            arrowsToUpdate.push({ row, col, newRow: row + 1, newCol: col });
          } else if (currentCell === list[i+2]) {
            arrowsToUpdate.push({ row, col, newRow: row, newCol: col - 1 });
          } else if (currentCell === list[i+3]) {
            arrowsToUpdate.push({ row, col, newRow: row, newCol: col + 1 });
          }
        }
      }
    }

    // Apply the changes to the matrix
    arrowsToUpdate.forEach(({ row, col, newRow, newCol }) => {
      if (
        newRow >= 0 &&
        newRow < matrix.length &&
        newCol >= 0 &&
        newCol < matrix[row].length
      ) {
        const targetCell = matrix[newRow][newCol];

        if (targetCell === " ") {
          matrix[newRow][newCol] = matrix[row][col];
        } else if (objectProperties[targetCell]?.isAnimal || false) {
          addInventory(objectProperties[targetCell].loot);
          matrix[newRow][newCol] = matrix[row][col] = " ";
        }
        
        matrix[row][col] = " ";
      }
    });
  }
  
  var possible = [];
  var canCraft = [];
  var adjacent = [];
  var posIndex = 0;
  
  function bossShoot(projectile) {
    currentProjectiles.push([projectile,bossPosition.x,bossPosition.y,0,3,"boss"]);
    currentProjectiles.push([projectile,bossPosition.x,bossPosition.y,1,3,"boss"]);
    currentProjectiles.push([projectile,bossPosition.x,bossPosition.y,2,3,"boss"]);
    currentProjectiles.push([projectile,bossPosition.x,bossPosition.y,3,3,"boss"]);
  }
  
  function testFor(emoji,amount) {
    for (let i = 0; i < Inventory.length; i++) {
      for (let j = 0; j < Inventory[i].length; j++) {
        if ((inventoryValue[i][j] === " " ? 1 : inventoryValue[i][j]) >= amount && Inventory[i][j] === emoji) {
          return true;
        }
      }
    }
    return false;
  }
  
  function checkCraftingPossibility(itemName) {
    const craftingRecipe = craftingDictionary[itemName];

    const { itemsNeeded, amountsNeeded, required } = craftingRecipe;

    let requirements = 0;
    for (let h = 0; h < itemsNeeded.length; h++) {
      if (testFor(itemsNeeded[h],amountsNeeded[h]) && !canCraft.includes(itemName)) {
        requirements++;
      }
      
      for (let i = 0; i < Inventory.length; i++) {
        for (let j = 0; j < Inventory[i].length; j++) {
          if (Inventory[i][j] === itemsNeeded[h] && !possible.includes(itemName)) {
            possible.push(itemName);
          }
        }
      }
    }
    if (requirements == itemsNeeded.length) {
      canCraft.push(itemName);
    }
  }
  
  function multiple(item,quantity,result) {
    if (testFor(item,1)) {
      removeInventory(item);
      for (let i = 0; i < quantity; i++) {
        addInventory(result);
      }
    }
  }

  function hunger(value) {
    // If value is positive, try to fill up food_health
    if (value > 0) {
      const remainingSpace = MAX_FOOD_HEALTH - FOOD_HEALTH;
      if (remainingSpace >= value) {
        FOOD_HEALTH += value;
        return; // Food health increased successfully
      } else {
        FOOD_HEALTH = MAX_FOOD_HEALTH;
        value -= remainingSpace;
      }

      // Once food_health is maxed, try to increase saturation
      if (value > 0) {
        const remainingSaturationSpace = MAX_SATURATION - saturation;
        if (remainingSaturationSpace >= value) {
          saturation += value;
        } else {
          saturation = MAX_SATURATION;
        }
      }
    }
    // If value is negative, first reduce saturation, then food_health
    else if (value < 0) {
      if (saturation > 0) {
        saturation += value;
      } else {
        if (FOOD_HEALTH >= -value) {
          FOOD_HEALTH += value;
        } else {
          FOOD_HEALTH = 0;
        }
      }
    }
  }
  
  function setBlock(map,y,x,req,replace) {
    if (map[moveY + y][moveX + x] == req || req == "") {
      map[moveY + y][moveX + x] = replace;
      return true;
    }
  }
  
  var openBracket;
  var closedBracket;
  
  function drawGrid() {
    gridElement.innerHTML = "";
    let grid = " ";

    for (let row = 0; row < GRID_NUMBER; row++) {
      for (let col = 0; col < GRID_NUMBER; col++) {
        if (!boss_mode) {
          grid = current_map[row + moveY][col + moveX];
        }
        let cellElement = createCellElement(grid);
        gridElement.appendChild(cellElement);
      }
    }

    // Draw Player
    const playerCell = gridElement.children[(playerPosition.y - 1) * GRID_NUMBER + (playerPosition.x - 1)];
    playerCell.textContent = PLAYER_EMOJI;
    
    // Limited Vision
    for (let pos in limitedVision) {
      const obj = limitedVision[pos];
      
      const limVis = gridElement.children[(obj.y - 1) * GRID_NUMBER + (obj.x - 1)];
      limVis.textContent = blackSquare;
    }
    
    // Draw Boss
    if (boss_mode) {
      // Update & Calculate Projectiles
      for (let list = 0; list < currentProjectiles.length; list++) {
        // name,x,y,dir,damage
        let proj = currentProjectiles[list];
        const arrowCell = gridElement.children[(proj[2] - 1) * GRID_NUMBER + (proj[1] - 1)];
        arrowCell.textContent = proj[0];
        if (playerPosition.x === proj[1] && playerPosition.y === proj[2] && proj[5] === "boss") {
          projRegester ++;
          damageTick = 900;
          if (projRegester == 1) {damage(proj[4]);}
        } else if (projRegester > 0) {
          projRegester --;
        }
      }
      
      // Load Boss
      const bossCell = gridElement.children[(bossPosition.y - 1) * GRID_NUMBER + (bossPosition.x - 1)];
      bossCell.textContent = BOSS_EMOJI;   
      if (playerPosition.x === bossPosition.x && playerPosition.y === bossPosition.y) {
        bossCell.textContent = BOSS_ENRAGED;
        bossRegester ++;
        damageTick = 900;
        if (bossRegester == 1) {damage(BOSS_DAMAGE);}
        
        if (playerHealth <= 0) {
          // Game Over condition
          PLAYER_EMOJI = "💀";
          playerPosition = { x: 5, y: 5 };
          boss_mode = false;
          tooltip.innerHTML = "You Lost...";
        } 
      } else {
        bossCell.textContent = BOSS_EMOJI;
        bossRegester = 0;
      }
      
      const bossHealthElement = document.getElementById("bossHealth");
      var bossHearts = BOSS_HEARTS.repeat(bossHealth);
      var bossDead = DEAD_EMOJI.repeat(MAX_BOSS_HEALTH - bossHealth);
      bossHealthElement.textContent = "\n" + bossHearts + bossDead;
      
    } else {
      const bossHealthElement = document.getElementById("bossHealth");
      bossHealthElement.textContent = "";
    }

    const foodHealthElement = document.getElementById("foodHealth");
    var foodHearts = HUNGER_EMOJI.repeat(FOOD_HEALTH);
    var foodDead = EMPTY_EMOJI.repeat(MAX_FOOD_HEALTH - FOOD_HEALTH);
    foodHealthElement.textContent = foodDead + foodHearts;

    // Calculate the offset to center the viewport
    const offsetX = window.innerWidth / 2 - viewportElement.clientWidth / 2;
    const offsetY = window.innerHeight / 2 - viewportElement.clientHeight / 2;

    // Set the viewport position to center the visible area
    viewportElement.style.left = `${offsetX}px`;
    viewportElement.style.top = `${offsetY}px`;
    
    // Update health bar
    var hearts = HEART_EMOJI.repeat(playerHealth);
    var dead = DEAD_EMOJI.repeat(MAX_PLAYER_HEALTH - playerHealth);
    healthBarElement.innerHTML = hearts + dead + showInv;

    for (let i = 0; i < Inventory[0].length; i++) {
      let ob = openBracket;
      let cb = closedBracket;
      if (ob == i + 1) {
        ob = "【";
        cb = "】";
      } else {
        ob = "";
        cb = "";
      }
      
      document.getElementById(`slot${i + 1}`).innerHTML = `${
        Inventory[0][i]
      }<span class="inv-number" id="s${i + 1}">${ob}${inventoryValue[0][i]}${cb}</span>`;
    }
    
    // Update Level
    switch (level) {
      case 0:
        current_map = terrain_map;
        break;
      case 1:
        current_map = sky_map;
        break;
      case 2:
        current_map = space_map;
        break;
      case -1:
        current_map = cave_map;
        break;
      case -2:
        current_map = hell_map;
        break;
      case -3:
        current_map = dungeon_map;
        break;
      case 3:
        current_map = house_map;
        break;
    }
    
    // Surface related events
    if (time > 250 && Math.random() < 0.08 && current_map == terrain_map) {
      let rng = Math.floor(Math.random() * 4);
      switch (rng) {
        case 0:
          summonMob(terrain_map,"🐖"); break;
        case 1:
          summonMob(terrain_map,"🐄"); break;
        case 2:
          summonMob(terrain_map,"🦆"); break;
        case 3:
          if (Math.random() < 0.5) {
            summonMob(terrain_map,"🐓"); break;
          } else {
            summonMob(terrain_map,"🐔"); break;
          }
      }
    }
    
    if (Math.random() < 0.5 && current_map == terrain_map) {
      moveMob(terrain_map,"🐖");
      moveMob(terrain_map,"🐄");
      moveMob(terrain_map,"🦆");
      moveMob(terrain_map,"🐓");
      moveMob(terrain_map,"🐔");
    }
    
    // Pets
    if (Math.random() < 0.6 && current_map == terrain_map) {
      movePet(terrain_map,"🐶");
      movePet(terrain_map,"🐱");
      movePet(terrain_map,"🐕");
      movePet(terrain_map,"🐈");
      movePet(terrain_map,"🐤");
    }
    
    if (Math.random() < 0.4 && current_map == dungeon_map) {
      let rng = Math.floor(Math.random() * 4);
      switch (rng) {
        case 0:
          summonMob(dungeon_map,"🧟‍♂️"); break;
        case 1:
          summonMob(dungeon_map,"🧟‍♀️"); break;
        case 2:
          summonMob(dungeon_map,"🧛"); break;
        case 3:
          summonMob(dungeon_map,"👻"); break;
      }
    }
    
    if (Math.random() < 0.8 && current_map == dungeon_map) {
      moveEnemy(dungeon_map,"🧟‍♂️",1);
      moveEnemy(dungeon_map,"🧟‍♀️",1);
      moveEnemy(dungeon_map,"🧛",1);
      moveEnemy(dungeon_map,"👻",1);
      moveEnemy(dungeon_map,"🐍",1);
    }
    
    // Cave related events
    if (Math.random() < 0.2 && current_map == cave_map) {
      let rng = Math.floor(Math.random() * 7);
      switch (rng) {
        case 0:
          summonMob(cave_map,"💎"); break;
        case 1:
          summonMob(cave_map,"🪙"); break;
        case 2:
          summonMob(cave_map,"💠"); break;
        case 3:
          summonMob(cave_map,"🔩"); break;
        case 4:
          summonMob(cave_map,"🔩"); break;
        case 5:
          summonMob(cave_map,"🕷️"); break;
        case 6:
          summonMob(cave_map,"🦇"); break;
      }
    }
    
    // Sky related events
    if (Math.random() < 0.2 && current_map == sky_map) {
      let rng = Math.floor(Math.random() * 7);
      switch (rng) {
        case 0:
          summonMob(sky_map,"👼"); break;
        case 1:
          summonMob(sky_map,"😇"); break;
        case 2:
          summonMob(sky_map,"🐦"); break;
        case 3:
          summonMob(sky_map,"🕊️"); break;
        case 4:
          summonMob(sky_map,"🌪"); break;
        case 5:
          summonMob(sky_map,"🦄"); break;
        case 6:
          if (dragonDefeated) {
            if (Math.random() < 0.2) {
              summonMob(sky_map,"🧞");
            } else if (Math.random() < 0.2) {
              summonMob(sky_map,"🧚");
            }
          }
          break;
      }
    }
    
    if (Math.random() < 0.7 && current_map == sky_map) {
      moveMob(sky_map,"👼");
      moveMob(sky_map,"😇");
      moveMob(sky_map,"🐦");
      moveMob(sky_map,"🕊️");
      moveMob(sky_map,"🌪");
      moveMob(sky_map,"🦄");
      if (dragonDefeated) {moveMob(sky_map,"🧞");}
    }
    
    // Space related events
    if (Math.random() < 0.2 && current_map == space_map) {
      let rng = Math.floor(Math.random() * 5);
      switch (rng) {
        case 0:
          summonMob(space_map,"🛸"); break;
        case 1:
          summonMob(space_map,"☄"); break;
        case 2:
          summonMob(space_map,"👾"); break;
        case 3:
          summonMob(space_map,"☄"); break;
        case 4:
          summonMob(space_map,"🛰"); break;
      }
    }
    
    if (Math.random() < 0.7 && current_map == space_map) {
      moveEnemy(space_map,"🛸",1);
      moveMob(space_map,"👾");
      moveMob(space_map,"🪐");
      moveMob(space_map,"🛰");
    }
    
    // Hell related events
    if (Math.random() < 0.3 && current_map == hell_map) {
      let rng = Math.floor(Math.random() * 2);
      switch (rng) {
        case 0:
          summonMob(hell_map,"😈"); break;
        case 1:
          summonMob(hell_map,"👿"); break;
      }
    }
    
    if (Math.random() < 0.8 && current_map == hell_map) {
      moveEnemy(hell_map,"😈",2);
      moveEnemy(hell_map,"👿",2);
    } if (adjacent.includes("😈") || adjacent.includes("👿")) {
      burning = 30;
    }
    
    if (Math.random() < 0.8 && current_map == cave_map) {
      moveEnemy(cave_map,"🕷️",1);
      moveMob(cave_map,"🦇")
    }
    
    // Time related events
    if (time <= 0) {
      time = 400;
    } else {time--;}
    if (time % 120 == 0) {hunger(-1);} 
    if (time % 15 == 0 && FOOD_HEALTH == 0) {
      damage(1);
      time --;
    } if (time % 20 == 0 && playerHealth < 10 && FOOD_HEALTH > 0) {
      playerHealth ++;
      hunger(-1);
    }
    
    if (time == 380 || time == 260) {
      for (let row = 0; row < terrain_map.length; row++) {
        for (let col = 0; col < terrain_map[row].length; col++) {
          if (terrain_map[row][col] === "🥚" && time == 380) {
            terrain_map[row][col] = "🐣";
          }
          if (terrain_map[row][col] === "🐣" && time == 260) {
            terrain_map[row][col] = "🐤";
          }
        }
      }
    }
    
    // Farm Crop Replenish
    if (time === 1) {
      for (let i = 0; i < terrain_map.length; i++) {
        for (let j = 0; j < terrain_map[i].length; j++) {
          for (let item in farmCrops) {
            if (terrain_map[i][j] === farmCrops[item].seed) {
              terrain_map[i][j] = item;
            }
          }
        }
      }
      for (let i = 0; i < cave_map.length; i++) {
        for (let j = 0; j < cave_map[i].length; j++) {
          for (let item in farmCrops) {
            if (cave_map[i][j] === farmCrops[item].seed) {
              cave_map[i][j] = item;
            }
          }
        }
      }
    }
    
    // Sun/Moon
    if (time <= 400) {
      sunmoon.innerHTML = "☀️";
      phase = "☀️";
    } if (time <= 120) {
      sunmoon.innerHTML = "🌇";
      phase = "🌇";
    } if (time <= 100) {
      phaseOnce = false;
      sunmoon.innerHTML = moonPhases[moonIndex];
      phase = moonPhases[moonIndex];
      if (phaseOnce) {
        phaseOnce = false;
        if (moonIndex == moonPhases.length - 1) {
          moonIndex = 0;
        } else {moonIndex++;}
      }
    } if (time <= 20) {
      phaseOnce = true;
      sunmoon.innerHTML = "🌅";
      phase = "🌅";
    }
    
    // Burning
    if (burning > 0) {
      burn = true;
      damageTick = 80;
      PLAYER_EMOJI = "🥵";
      burning --;
      if (fireRes > 0) {
        fireRes --;
      } else {
        HEART_EMOJI = "❤️‍🔥";
      }
      if (burning % 5 == 0 && fireRes <= 0) {
        if (level == -2) {damage(2);}
        else {damage(1);}
      }
    } if (burning == 0 && burn) {
        HEART_EMOJI = "❤️";
        PLAYER_EMOJI = "😄";
        burn = false;
      }
    
    // Special Effects
    if (sandboxMode) {
      playerHealth = 10;
      armorProperties[armor[0]].protection = 999;
    }
    if (level == 2) {PLAYER_EMOJI = "🥶";}
    
    if (regeneration > 0) {
      regeneration--;
      HEART_EMOJI = "💗";
      if (regeneration % 10 == 0 && playerHealth < MAX_PLAYER_HEALTH) {
        playerHealth++;
      }
      if (regeneration == 1) {HEART_EMOJI = "❤️"};
    }
    
    // Game Over / Death
    if (playerHealth <= 0) {
      PLAYER_EMOJI = "💀";
      boss_mode = false;
      setBlock(dim(),4,4," ","🪦");
      setBlock(dim(),4,4,"🔥","🪦");
      setBlock(dim(),4,4,"💥","🪦");
      playerHealth ++;
      playerPosition = { x : 5, y : 5 };
      HEART_EMOJI = "🖤";
      moveX = 6;
      moveY = 5;
      level = 0;
      tooltip.innerHTML = "YOU DIED";
      if (FOOD_HEALTH == 0) {
        FOOD_HEALTH ++;
      }
    }
    if (playerHealth == 2 && HEART_EMOJI == "🖤") {
      HEART_EMOJI = "❤️";
    }
    if (playerHealth == 10 && (PLAYER_EMOJI == "🤕" || PLAYER_EMOJI == "💀")) {
      PLAYER_EMOJI = "😄";
    }
    
    // Reforges
    replaceItem("⚔️🩸","⚔️","🩸");
    replaceItem("⚔️💎","⚔️","💎");
    replaceItem("⚔️☘️","⚔️","☘️");
    replaceItem("⚔️❄️","⚔️","❄️");
    replaceItem("⚔️🔥","⚔️","🔥");
    replaceItem("⚔️✨","⚔️","✨");
    replaceItem("⚔️🥇","⚔️","🥇");

    replaceItem("🪄📖","🪄","📖");
    replaceItem("🪄📚","🪄","📚");
    
    replaceItem("🏹💘","🏹","💘");
    
    // Fishin' Stuff
    if (fishing < maxFishing) {
      fishing --;
    } if (fishing < 10 && Inventory[0][currentSlot - 1] == "🎣") {
      Inventory[0][currentSlot - 1] = "»🎣«"
    } if (fishing <= 0) {
      Inventory[0][currentSlot - 1] = "🎣";
      fishing = maxFishing;
    }
    
    // Tractor Stuff
    if (tractorMode) {
      PLAYER_EMOJI = "🚜";
    }
    
    // Vision
    if ((level == -1 || level == -3) && !boss_mode) {
      if (testFor("🔦",1)) {
        limitedVision = {
          "1":{x:1,y:1},"1a":{x:2,y:1},"1b":{x:3,y:1},"1c":{x:4,y:1},"1d":{x:5,y:1},"1e":{x:6,y:1},"1f":{x:7,y:1},"1g":{x:8,y:1},"1h":{x:9,y:1},
          "2":{x:1,y:2},"2a":{x:2,y:2},"2g":{x:8,y:2},"2h":{x:9,y:2},
          "3":{x:1,y:3},"3h":{x:9,y:3},
          "4":{x:1,y:4},"4h":{x:9,y:4},
          "5":{x:1,y:5},"5h":{x:9,y:5},
          "6":{x:1,y:6},"6h":{x:9,y:6},
          "7":{x:1,y:7},"7h":{x:9,y:7},
          "8":{x:1,y:8},"8a":{x:2,y:8},"8g":{x:8,y:8},"8h":{x:9,y:8},
          "9":{x:1,y:9},"9a":{x:2,y:9},"9b":{x:3,y:9},"9c":{x:4,y:9},"9d":{x:5,y:9},"9e":{x:6,y:9},"9f":{x:7,y:9},"9g":{x:8,y:9},"9h":{x:9,y:9},
        };
      } else {
        limitedVision = {
          "1":{x:1,y:1},"1a":{x:2,y:1},"1b":{x:3,y:1},"1c":{x:4,y:1},"1d":{x:5,y:1},"1e":{x:6,y:1},"1f":{x:7,y:1},"1g":{x:8,y:1},"1h":{x:9,y:1},
          "2":{x:1,y:2},"2a":{x:2,y:2},"2b":{x:3,y:2},"2c":{x:4,y:2},"2d":{x:5,y:2},"2e":{x:6,y:2},"2f":{x:7,y:2},"2g":{x:8,y:2},"2h":{x:9,y:2},
          "3":{x:1,y:3},"3a":{x:2,y:3},"3b":{x:3,y:3},"3c":{x:4,y:3},"3e":{x:6,y:3},"3f":{x:7,y:3},"3g":{x:8,y:3},"3h":{x:9,y:3},
          "4":{x:1,y:4},"4a":{x:2,y:4},"4b":{x:3,y:4},"4f":{x:7,y:4},"4g":{x:8,y:4},"4h":{x:9,y:4},
          "5":{x:1,y:5},"5a":{x:2,y:5},"5g":{x:8,y:5},"5h":{x:9,y:5},
          "6":{x:1,y:6},"6a":{x:2,y:6},"6b":{x:3,y:6},"6f":{x:7,y:6},"6g":{x:8,y:6},"6h":{x:9,y:6},
          "7":{x:1,y:7},"7a":{x:2,y:7},"7b":{x:3,y:7},"7c":{x:4,y:7},"7e":{x:6,y:7},"7f":{x:7,y:7},"7g":{x:8,y:7},"7h":{x:9,y:7},
          "8":{x:1,y:8},"8a":{x:2,y:8},"8b":{x:3,y:8},"8c":{x:4,y:8},"8d":{x:5,y:8},"8e":{x:6,y:8},"8f":{x:7,y:8},"8g":{x:8,y:8},"8h":{x:9,y:8},
          "9":{x:1,y:9},"9a":{x:2,y:9},"9b":{x:3,y:9},"9c":{x:4,y:9},"9d":{x:5,y:9},"9e":{x:6,y:9},"9f":{x:7,y:9},"9g":{x:8,y:9},"9h":{x:9,y:9},
        };
      }
    } else {limitedVision = {};}
    if (level == 3 && !boss_mode) {
      limitedVision = {
        "1":{x:1,y:1},"1a":{x:2,y:1},"1b":{x:3,y:1},"1c":{x:4,y:1},"1d":{x:5,y:1},"1e":{x:6,y:1},"1f":{x:7,y:1},"1g":{x:8,y:1},"1h":{x:9,y:1},
          "2":{x:1,y:2},"2a":{x:2,y:2},"2b":{x:3,y:2},"2c":{x:4,y:2},"2d":{x:5,y:2},"2e":{x:6,y:2},"2f":{x:7,y:2},"2g":{x:8,y:2},"2h":{x:9,y:2},
          "3":{x:1,y:3},"3a":{x:2,y:3},"3g":{x:8,y:3},"3h":{x:9,y:3},
          "4":{x:1,y:4},"4a":{x:2,y:4},"4g":{x:8,y:4},"4h":{x:9,y:4},
          "5":{x:1,y:5},"5a":{x:2,y:5},"5g":{x:8,y:5},"5h":{x:9,y:5},
          "6":{x:1,y:6},"6a":{x:2,y:6},"6g":{x:8,y:6},"6h":{x:9,y:6},
          "7":{x:1,y:7},"7a":{x:2,y:7},"7g":{x:8,y:7},"7h":{x:9,y:7},
          "8":{x:1,y:8},"8a":{x:2,y:8},"8b":{x:3,y:8},"8c":{x:4,y:8},"8d":{x:5,y:8},"8e":{x:6,y:8},"8f":{x:7,y:8},"8g":{x:8,y:8},"8h":{x:9,y:8},
          "9":{x:1,y:9},"9a":{x:2,y:9},"9b":{x:3,y:9},"9c":{x:4,y:9},"9d":{x:5,y:9},"9e":{x:6,y:9},"9f":{x:7,y:9},"9g":{x:8,y:9},"9h":{x:9,y:9},
      };
    }
    
    // Crafting
    for (items in craftingDictionary) {
      checkCraftingPossibility(items);
    } updateProj(dim());
    multiple("🧱​",8,"🧱");
    multiple("➶​",8,"➶");
    multiple("•​",10,"•");
    multiple("𓆩𓆪​",1,wings);

    if (testFor("",2)) {
      removeInventory("");
    }
  }
  
  function openInventory() {
    // If chest
    let chest = "";
    let chestText = "";
    let chestData = "";
    let exists = false;
    let xx = [4,4,3,5]
    let yy = [3,5,4,4]
    for (let j = 0; j < xx.length; j++) {
      if (current_map[moveY + yy[j]][moveX + xx[j]] == "📦") {
        for (let lootEntry of boxLoot) {
          const x = lootEntry[0];
          const y = lootEntry[1];

          if (y === moveY +  yy[j] && x === moveX + xx[j]) {
            exists = true;
            let modifiedLootEntry = [...lootEntry]; // Create a new array based on lootEntry
            modifiedLootEntry.splice(0, 2); // Remove first two items
            modifiedLootEntry = modifiedLootEntry.map(item => (item === "") ? '🟦' : item);

            const chest = [];
            for (let i = 0; i < modifiedLootEntry.length; i++) {
              if (i % 9 === 0 && i !== 0) {
                chest.push('\n'); // Add a line break after every 9th column (excluding the first one)
              }
              chest.push(modifiedLootEntry[i]);
            }

            chestData = chest.join('');
            chestText = "\nBox\n";
            chestPosition = { x: x, y: y };
          }
        }
        if (!exists) {
          // Create a new box array and push it to boxLoot
          let newLootEntry = [moveX + xx[j], moveY + yy[j]];
          let valueEntry = [];
          chestPosition = { x: moveX + xx[j], y:moveY + yy[j] };
          for (let i = 0; i < 36; i++) {
            newLootEntry.push("");
            valueEntry.push("");
          }
          boxLoot.push(newLootEntry);
          boxValueLoot.push(valueEntry);
        }
      }
    }
    
    // Inventory, Armor, Sun/Moon, and Crafting
    let s = " ".repeat(3);
    let space = " ".repeat(15);
    const extra = [
      s + armor[0] + space + "⚒ Crafting 🛠",
      s + armor[1] + space + "   Press 'n'/'m' to cycle.",
      s + armor[2] + space + "     Press 'c' to craft.",
      s + armor[3] + space + space + (possible[posIndex] !== undefined ? possible[posIndex] : ""),
      s + armor[4],
      s + phase
    ];

    showInv = '\n' + Inventory.map((row, index) => {
      const append = extra[index % armor.length];
      return row.map(item => (item === "") ? "⬜" : item).join('') + "       " + append;
    }).join('\n')
    + '\n' + chestText + chestData;
  }

  function startPunching(map,dir,y,x) {
    if (current_map[moveY + y][moveX + x] in objectProperties && HAND_EMOJI in weaponProperties) {
      if (Jpress && direction == dir && objectProperties[current_map[moveY + y][moveX + x]].toolRequired === weaponProperties[HAND_EMOJI].itemType) {
        if (Math.random() < 0.05 && objectProperties[current_map[moveY + y][moveX + x]].name == "Tree") {
          let rng = Math.floor(Math.random() * 3);
          switch (rng) {
            case 0:
              addInventory("🍎"); break;
            case 1:
              addInventory("🍏"); break;
            case 2:
              addInventory("🍊"); break;
          }
        }
        if (durability == 0) {
          if (objectProperties[map[moveY + y][moveX + x]].durability - weaponProperties[HAND_EMOJI].sub > 0) {
            durability = objectProperties[map[moveY + y][moveX + x]].durability - weaponProperties[HAND_EMOJI].sub;
          } else if (objectProperties[map[moveY + y][moveX + x]].durability - weaponProperties[HAND_EMOJI].sub <= 0) {
            durability = 1;
          } else {
            durability = objectProperties[map[moveY + y][moveX + x]].durability;
          }
        } else if (durability == 1) {
          if (objectProperties[map[moveY + y][moveX + x]].loot != "") {
            addInventory(objectProperties[map[moveY + y][moveX + x]].loot);
          }

          if (current_map[moveY + y][moveX + x] in farmCrops) {
            const objectName = farmCrops[map[moveY + y][moveX + x]].seed;
            map[moveY + y][moveX + x] = objectName;
            durability = 0;
            
          } else {map[moveY + y][moveX + x] = " ";}
          
          if (adjacent.includes("📦")) {
            let found = false;
            for (let i = 0; i < boxLoot.length; i++) {
              const lootEntry = boxLoot[i];
              const valueEntry = boxValueLoot[i];

              if (moveX + x == lootEntry[0] && moveY + y == lootEntry[1]) {
                found = true;
                const restOfLoot = lootEntry.slice(2, 39);
                if (restOfLoot.every(val => val === "")) {
                  addInventory("📦");
                } else {
                  setBlock(dim(), y, x, " ", "📦");
                }
              }
            }
            if (!found) {addInventory("📦");}
          }
        } else {
          durability--;
        }
      }
    }
  }
  
  function updateAdjacent() {
    adjacent = [current_map[moveY + 3][moveX + 4],current_map[moveY + 5][moveX + 4],current_map[moveY + 4][moveX + 3],current_map[moveY + 4][moveX + 5]];
  }

  function build(map,item) {
    if (direction == "up" && adjacent[0] == " ") {
      map[moveY + 3][moveX + 4] = item;
      removeInventory(item);
      updateAdjacent();
      if (item in bosses) {if (bosses[item].level == level) 
        {loadBossFight(item); currentBoss = item}}
    } else if (direction == "down" && adjacent[1] == " ") {
      map[moveY + 5][moveX + 4] = item;
      removeInventory(item);
      updateAdjacent();
      if (item in bosses) {if (bosses[item].level == level) 
        {loadBossFight(item);} currentBoss = item}
    } else if (direction == "left" && adjacent[2] == " ") {
      map[moveY + 4][moveX + 3] = item;
      removeInventory(item);
      updateAdjacent();
      if (item in bosses) {if (bosses[item].level == level) 
        {loadBossFight(item);} currentBoss = item}
    } else if (direction == "right" && adjacent[3] == " ") {
      map[moveY + 4][moveX + 5] = item;
      removeInventory(item);
      updateAdjacent();
      if (item in bosses) {if (bosses[item].level == level) 
        {loadBossFight(item);} currentBoss = item}
    }
    if (level == 0 && item == "🏠") {
      // Build the house
      let x = [2,2,2,2,2, 6,6,6,6,6, 3,4,5,3,4,5];
      let y = [2,3,4,5,6, 2,3,4,5,6, 2,2,2,6,6,6];
      
      for (let i = 0; i < x.length; i++) {
        setBlock(house_map,x[i],y[i]," ","🧱");
      }
      setBlock(house_map,2,4,"🧱","🪟");
      setBlock(house_map,4,2,"🧱","🪟");
      setBlock(house_map,4,6,"🧱","🪟");
      setBlock(house_map,6,4,"🧱","🚪");
    }
  }
  
  function shoot(map,ammo,up,down,left,right) {
    if (testFor(ammo,1)) {
      if (!boss_mode) {
        if (direction == "up") {
          setBlock(map,3,4," ",up)
          removeInventory(ammo);
        }
        else if (direction == "down") {
          setBlock(map,5,4," ",down)
          removeInventory(ammo);
        }
        else if (direction == "left") {
          setBlock(map,4,3," ",left)
          removeInventory(ammo);
        }
        else if (direction == "right") {
          setBlock(map,4,5," ",right)
          removeInventory(ammo);
        }
      } else {
          if (direction == "up") {
            currentProjectiles.push([up,playerPosition.x,playerPosition.y,0,3]);
            removeInventory(ammo);
          } else if (direction == "down") {
            currentProjectiles.push([down,playerPosition.x,playerPosition.y,1,3]);
            removeInventory(ammo);
          } else if (direction == "left") {
            currentProjectiles.push([left,playerPosition.x,playerPosition.y,2,3]);
            removeInventory(ammo);
          } else if (direction == "right") {
            currentProjectiles.push([down,playerPosition.x,playerPosition.y,3,3]);
            removeInventory(ammo);
          }
      }
    }
  }
  
  function magic(map,proj,damage) {
    if (!boss_mode) {
      if (direction == "up" && adjacent[0] == " ") {
        map[moveY + 3][moveX + 4] = proj;
      }
      else if (direction == "down" && adjacent[1] == " ") {
        map[moveY + 5][moveX + 4] = proj + "​";
      }
      else if (direction == "left" && adjacent[2] == " ") {
        map[moveY + 4][moveX + 3] = proj + "​​";
      }
      else if (direction == "right" && adjacent[3] == " ") {
        map[moveY + 4][moveX + 5] = proj + "​​​";
      }
    } else {
        if (direction == "up") {
          currentProjectiles.push([proj,playerPosition.x,playerPosition.y,0,damage,"player"]);
        } else if (direction == "down") {
          currentProjectiles.push([proj,playerPosition.x,playerPosition.y,1,damage,"player"]);
        } else if (direction == "left") {
          currentProjectiles.push([proj,playerPosition.x,playerPosition.y,2,damage,"player"]);
        } else if (direction == "right") {
          currentProjectiles.push([proj,playerPosition.x,playerPosition.y,3,damage,"player"]);
        }
    }
  }
  
  function craftItem() {
    if (craftingDictionary[possible[posIndex]]) {
      const { itemsNeeded, amountsNeeded, required } = craftingDictionary[possible[posIndex]];

      let success = false;
      if (adjacent.includes(required) || required == "") {
        for (let i = 0; i < canCraft.length; i++) {
          if (canCraft[i] == possible[posIndex]) {
            for (let j = 0; j < itemsNeeded.length; j++) {
              for (let x = 0; x < amountsNeeded[j]; x++) {
                removeInventory(itemsNeeded[j]);
              }
            }
            addInventory(possible[posIndex]);
            canCraft.splice(possible[posIndex], 1);
            checkCraftingPossibility(possible[posIndex]);
            tooltip.innerHTML = `${possible[posIndex]} crafted!`;
            success = true;
            break;
          }
        }
      }
      
      // Display message if unsuccessful
      if (!success && !adjacent.includes(required) && required != "") {
        let itemsAndAmounts = '';
        for (let i = 0; i < itemsNeeded.length; i++) {
          itemsAndAmounts += `${amountsNeeded[i]} ${itemsNeeded[i]}`;
          if (i < itemsNeeded.length - 1) {
            itemsAndAmounts += ', ';
          }
        }
        tooltip.innerHTML = `You need\n[${itemsAndAmounts}],\n[${required} required]`;
      } else if (!success) {
        let itemsAndAmounts = '';
        for (let i = 0; i < itemsNeeded.length; i++) {
          itemsAndAmounts += `${amountsNeeded[i]} ${itemsNeeded[i]}`;
          if (i < itemsNeeded.length - 1) {
            itemsAndAmounts += ', ';
          }
        }
        tooltip.innerHTML = `You need\n[${itemsAndAmounts}]`;
      }
    }
  }
  
  function abbreviateQuest(y,x) {
    // Abbreviate quest requirements
    if (current_map[moveY + y][moveX + x] in quests) {
      const items = quests[current_map[moveY + y][moveX + x]].qrequired;
      const compressedItems = [];

      let currentItem = items[0];
      let itemCount = 1;

      for (let i = 1; i < items.length; i++) {
        if (items[i] === currentItem) {
          itemCount++;
        } else {
          compressedItems.push(`${itemCount}${currentItem}`);
          currentItem = items[i];
          itemCount = 1;
        }
      }

      compressedItems.push(`${itemCount}${currentItem}`);

      const compressedText = ` [${compressedItems.join(", ")}]`;
      return compressedText;
    }
  }
  
  function showFistEmojiTemporarily(emoji) {
    if (direction == "left") {
      const playerCell =
        gridElement.children[
          (playerPosition.y - 1) * GRID_NUMBER + (playerPosition.x - 2)
        ];
      playerCell.textContent = emoji;
    } else if (direction == "right") {
      const playerCell =
        gridElement.children[
          (playerPosition.y - 1) * GRID_NUMBER + playerPosition.x
        ];
      playerCell.textContent = emoji;
    } else if (direction == "up") {
      const playerCell =
        gridElement.children[
          (playerPosition.y - 2) * GRID_NUMBER + (playerPosition.x - 1)
        ];
      playerCell.textContent = emoji;
    } else if (direction == "down") {
      const playerCell =
        gridElement.children[
          playerPosition.y * GRID_NUMBER + (playerPosition.x - 1)
        ];
      playerCell.textContent = emoji;
    }
    
    // Start Punching
    if (emoji == "🏹") {
      shoot(dim(),"➶","➶","➴","↢","➵");
    } else if (emoji == "🔫") {
      shoot(dim(),"•","'","'​","-","-​");
    } else if (emoji == "🪄") {
      magic(dim(),"✨",3);
      hunger(-1);
    } else if (emoji == "🎸") {
      magic(dim(),"✨",3);
      if (Math.random() < 0.75) {
        magic(dim(),"🎵",4);
      } else {
        magic(dim(),"🎶",4);
      }
    } else {
      startPunching(dim(),"up", 3, 4);
      startPunching(dim(),"down", 5, 4);
      startPunching(dim(),"left", 4, 3);
      startPunching(dim(),"right", 4, 5);
    }
    
    // Special reforges
    if (inventoryValue[0][currentSlot - 1] == "☘") {
      if (Math.random() < 0.08) {
        magic(dim(),"☘",2);
      } else if (Math.random() < 0.02) {
        magic(dim(),"🍀",3);
      }
    }
    if (inventoryValue[0][currentSlot - 1] == "📖") {
      if (Math.random() < 0.1) {
        magic(dim(),"🌀",4);
        if (FOOD_HEALTH > 0) {
          hunger(1);
        }
      } else if (Math.random() < 0.1) {
        magic(dim(),"🍀",4);
        if (FOOD_HEALTH > 0) {
          hunger(1);
        }
      } else if (Math.random() < 0.02) {
        magic(dim(),"⭐",10);
        PLAYER_EMOJI = "🤩";
        if (FOOD_HEALTH > 0) {
          hunger(2);
        }
      }
    }
    if (inventoryValue[0][currentSlot - 1] == "📚") {
      if (Math.random() < 0.1) {
        magic(dim(),"❄️​",4);
        if (FOOD_HEALTH > 0) {
          hunger(1);
        }
      } else if (Math.random() < 0.1) {
        magic(dim(),"🔥​",4);
        if (FOOD_HEALTH > 0) {
          hunger(1);
        }
      } else if (Math.random() < 0.2) {
        magic(dim(),"🐰",4);
        if (FOOD_HEALTH > 0) {
          hunger(1);
        }
      } else if (Math.random() < 0.2) {
        magic(dim(),"🐸",10);
        if (FOOD_HEALTH > 0) {
          hunger(2);
        }
      }
    }

    // After a short delay, reset the player emoji back to its original state
    setTimeout(() => {
      const playerCell =
        gridElement.children[
          (playerPosition.y - 1) * GRID_NUMBER + (playerPosition.x - 1)
        ];
      playerCell.textContent = PLAYER_EMOJI;
    }, 1000); // Adjust the time in milliseconds as needed for the desired duration of the fist emoji display
  }
  
  function swapItems(matrix, row1, col1, row2, col2) {
    if (
      row1 >= 0 && row1 < matrix.length &&
      col1 >= 0 && col1 < matrix[0].length &&
      row2 >= 0 && row2 < matrix.length &&
      col2 >= 0 && col2 < matrix[0].length &&
      showInv != ""
    ) {
      // Swap the items using a temporary variable
      const temp = matrix[row1][col1];
      matrix[row1][col1] = matrix[row2][col2];
      matrix[row2][col2] = temp;
    }
  }
  
  let currentCoordinate = "";

  function movePlayer(event) {
    const key = event.key;
    let dx = 0;
    let dy = 0;
    
    if (key === "ArrowUp" || key === "w" || key === "W") {
      if (!boss_mode) {moveY --;}
      else {dy --;}
      direction = "up";
      time ++;
    } else if (key === "ArrowDown" || key === "s" || key === "S") {
      if (!boss_mode) {moveY ++;}
      else {dy ++;}
      direction = "down";
      time ++;
    } else if (key === "ArrowLeft" || key === "a" || key === "A") {
      if (!boss_mode) {moveX --;}
      else {dx --;}
      direction = "left";
      time ++;
    } else if (key === "ArrowRight" || key === "d" || key === "D") {
      if (!boss_mode) {moveX ++;}
      else {dx ++;}
      direction = "right";
      time ++;
    } else if (key === "k") {
      if (direction == "right" || direction == "down") {
        showFistEmojiTemporarily("👉");
      } else {showFistEmojiTemporarily("👈")}
    } else if (key === "u") {
      showFistEmojiTemporarily("👆");
    } else if (key === "i") {
      showFistEmojiTemporarily("🤘");
    } else if (key === "o") {
      showFistEmojiTemporarily("✌️");
    } else if (key === "p") {
      showFistEmojiTemporarily("🫶");
    }
    else if (key == "\\") {
      // Save stuff
      inputBox.value = "i"+Inventory+"v"+inventoryValue+"a"+armor;
      let charArray = inputBox.value.split("");

      // Iterate through the array and increase ASCII value by one
      for (let i = 0; i < charArray.length; i++) {
        let char = charArray[i];
        let charCode = char.charCodeAt(0);
        charArray[i] = String.fromCharCode(charCode + encrypt);
      }

      // Join the modified characters back to form the new string
      inputBox.value = charArray.join("");

    } else if (event.key == "Enter") {
        let encryptedString = inputBox.value;

        // Convert the encrypted string to an array of characters
        let charArray = encryptedString.split("");

        // Iterate through the array and decrease ASCII value by one
        for (let i = 0; i < charArray.length; i++) {
          let char = charArray[i];
          let charCode = char.charCodeAt(0);
          charArray[i] = String.fromCharCode(charCode - encrypt);
        }

        // Join the decrypted characters back to form the original string
        let decryptedString = charArray.join("");
        const inputBoxValue = decryptedString;

        // Extract the inventory and inventoryValue data from inputBoxValue
        const [first, temp] = inputBoxValue.slice(1).split("v"); // i,v
        const [second, third] = temp.split("a");
        const inventoryData = first.split(",");
        const inventoryValueData = second.split(",");
        const armorData = third.split(",");

        const numRows = 6;
        const numCols = 9;

        // Create the Inventory matrix (matrix1)
        let matrix1 = [];
        for (let i = 0; i < numRows; i++) {
          matrix1.push(inventoryData.slice(i * numCols, (i + 1) * numCols));
        }

        // Create the inventoryValue matrix (matrix2)
        let matrix2 = [];
        for (let i = 0; i < numRows; i++) {
          matrix2.push(inventoryValueData.slice(i * numCols, (i + 1) * numCols));
        }

        Inventory = matrix1;
        inventoryValue = matrix2;
        armor = armorData;

        console.log(Inventory);
        console.log(inventoryValue);
        console.log(armor);
        inputBox.value = "";
    }
    
    // Moving Up and Down between maps
      else if (event.shiftKey && event.code === "Space" && !boss_mode) {
      if (testFor(wings,1) && level >= 0 && level < 2) {level--;}
      else if (testFor("🚀",1) && level > 0 && level < 3) {level--;}
      else if (testFor("🕹️",1) && level > -2 && level < 3) {level--;}
    }
    else if (event.keyCode === 32 || event.code === "Space") {
      if (testFor(wings,1) && level >= 0 && level < 1) {level++;}
      else if (testFor("🚀",1) && level >= 0 && level < 2) {level++;}
      else if (testFor("🕹️",1) && level >= -2 && level < 2) {level++;}
    }
    // Crafting Stuff
    else if (key == "n") {
      if (posIndex == possible.length - 1 || possible.length == 0) {
        posIndex = 0;
      } else {posIndex++;}
      openInventory();
    } else if (key == "m") {
      if (posIndex == 0) {
        posIndex = possible.length - 1;
      } else {posIndex--;}
      openInventory();
    } else if (key == "z") {
      if (currentIndex == baseEmote.length - 1) {
        currentIndex = 0;
      } else {currentIndex++;}
      PLAYER_EMOJI = baseEmote[currentIndex];
    } else if (key == "q") {
      if (tractorMode) {
        tractorMode = false;
        PLAYER_EMOJI = "🤠";
        addInventory("🚜");
      }
    }
    
    // Number-related presses
    if (!isNaN(key)) {
      currentCoordinate += key;
      HAND_EMOJI = Inventory[0][key - 1];
      currentSlot = key;
      openBracket = key;
      
      // Show Item Name
      let item = "";
      if (HAND_EMOJI in objectProperties) {
        item = objectProperties[HAND_EMOJI].name
      }
      if (HAND_EMOJI in foodProperties) {
        item = `${foodProperties[HAND_EMOJI].name}  [${foodProperties[HAND_EMOJI].nutrition}${HAND_EMOJI}]`;
      }
      if (HAND_EMOJI in armorProperties) {
        item = `${armorProperties[HAND_EMOJI].name}  [${armorProperties[HAND_EMOJI].protection}🛡️]`;
      }
      if (HAND_EMOJI in weaponProperties) {
        item = `${weaponProperties[HAND_EMOJI].name}  [${weaponProperties[HAND_EMOJI].damage}${weaponProperties[HAND_EMOJI].itemType}]`;
      }
      if (HAND_EMOJI in bosses) {
        item = `${bosses[HAND_EMOJI].name}  [${bosses[HAND_EMOJI].health}⚔] [${bosses[HAND_EMOJI].loot}]`;
      }
      itemName.innerHTML = item;
    } else {
      currentCoordinate = "";
    }
    
    // Swap Inventory / Box
    if (currentCoordinate.length === 4) {
      let slotRow = parseInt(currentCoordinate[0], 10) - 1;
      let slotCol = parseInt(currentCoordinate[1], 10) - 1;
      let row = parseInt(currentCoordinate[2], 10) - 1;
      let column = parseInt(currentCoordinate[3], 10) - 1;

      ifBox(slotRow,slotCol,row,column);
      currentCoordinate = "";
      
      openInventory();
    }

    // Jpress, hand-related stuff, what tile player is currently on
    if (event.button == 0 || key === "j" || key === "J") {
      Jpress = true;
      raisedShield = false;
      tooltip.innerHTML = "";
      showFistEmojiTemporarily(HAND_EMOJI);
      
      // Eating
      if (HAND_EMOJI in foodProperties && saturation < MAX_SATURATION && FOOD_HEALTH < MAX_FOOD_HEALTH && !adjacent.includes("🧑‍🌾")) {
        hunger(foodProperties[HAND_EMOJI].nutrition);
        removeInventory(HAND_EMOJI);
        
        // Special effects properties
        if (foodProperties[HAND_EMOJI].effect == "health4") {
          if (playerHealth + 4 > MAX_PLAYER_HEALTH) {
            playerHealth = MAX_PLAYER_HEALTH;
          } else {playerHealth += 4;}
        } else if (foodProperties[HAND_EMOJI].effect == "health2") {
          if (playerHealth + 2 > MAX_PLAYER_HEALTH) {
            playerHealth = MAX_PLAYER_HEALTH;
          } else {playerHealth += 2;}
        } else if (foodProperties[HAND_EMOJI].effect == "regeneration") {
          regeneration = 100;
        } else if (foodProperties[HAND_EMOJI].effect == "fireres") {
          fireRes = 100;
        }
      }
      
      // Inventory Management
      const clickArea = document.getElementById('healthBar');
      clickCounter ++;

      // You can use JavaScript to dynamically set the text content of the hover-text element 
      
      clickArea.addEventListener('click', function(event) {
        const mouseX = Math.max(0, Math.min(event.clientX, corner.getBoundingClientRect().width));
        const mouseY = Math.max(0, Math.min(event.clientY, corner.getBoundingClientRect().height));
  
        if (clickCounter % 2 == 0) {pos1 = [iRow,iCol]}
        else {
          pos2 = [iRow,iCol];

          let s1Row = pos1[0]
          let s1Col = pos1[1]
          let s2Row = pos2[0]
          let s2Col = pos2[1]

          // If the chest is open
          if (s1Col <= 8 && s2Col <= 8) {
            if (s2Row >= 7 && s1Row <= 5) {
              s2Row -=7;
              ifBox(s1Row,s1Col,s2Row,s2Col);
            } else if (s1Row >= 7 && s2Row <= 5) {
              s1Row -=7;
              ifBox(s2Row,s2Col,s1Row,s1Col);
            } else if (s1Row <= 5 && s2Row <= 5) {
              ifBox(s1Row,s1Col,s2Row,s2Col);
            }
          }
          openInventory();
        }
      }, { once: true });
      
      return;
    } else if (event.button == 2 || key === "l" || key === "L") {
      if (HAND_EMOJI in objectProperties) {
        build(dim(),HAND_EMOJI);
      } 
      
      // Specific Interactions
      if (adjacent.includes("🐔") && HAND_EMOJI == "🧺" && !testFor("🥚",3)) {
        updateAdjacent();
        addInventory("🥚");
      }
      if (adjacent.includes("🐄") && HAND_EMOJI == "🪣") {
        updateAdjacent();
        removeInventory("🪣");
        addInventory("🥛");
      }
      if (adjacent.includes("🔐") && HAND_EMOJI == "🗝") {
        updateAdjacent();
        removeInventory("🗝");
        setBlock(dim(),3,4,"🔐","🔓");
        setBlock(dim(),5,4,"🔐","🔓");
        setBlock(dim(),4,3,"🔐","🔓");
        setBlock(dim(),4,5,"🔐","🔓");
      }
      if (adjacent.includes("🔒") && HAND_EMOJI == "🔑") {
        updateAdjacent();
        removeInventory("🔑");
        setBlock(dim(),3,4,"🔒","🔓");
        setBlock(dim(),5,4,"🔒","🔓");
        setBlock(dim(),4,3,"🔒","🔓");
        setBlock(dim(),4,5,"🔒","🔓");
      }
      
      if (adjacent.includes("🌊") && Inventory[0][currentSlot - 1] == "🪣") {
        removeInventory("🪣");
        addInventory("💧");
      }
      
      // Fishing
      if (adjacent.includes("🌊") && Inventory[0][currentSlot - 1] == "🎣" && fishing == maxFishing) {
        fishing --;
      }
      if (adjacent.includes("🌊") && Inventory[0][currentSlot - 1] == "»🎣«") {
        let rng = Math.floor(Math.random() * 3);
        switch (rng) {
          case 0:
            addInventory("🐟"); break;
          case 1:
            addInventory("🐠"); break;
          case 2:
            addInventory("🐡"); break;
        }
        Inventory[0][currentSlot - 1] = "🎣";
        fishing = 0;
      }
      
      // Quests
      for (let item in quests) {
        let thing = quests[item];
        
        if (adjacent.includes(item) && thing.qrequired.includes(HAND_EMOJI)) {
          const requiredIndex = thing.qrequired.indexOf(HAND_EMOJI);
          
          if (requiredIndex !== -1) {
            thing.qrequired.splice(requiredIndex, 1);
            removeInventory(HAND_EMOJI);
            console.log(thing.qrequired);
            if (thing.qrequired.length === 0) {              
              addInventory(thing.output);

              if (`quest${thing.currentQuest}` in thing) {
                objectProperties[item].description = thing[`quest${thing.currentQuest}`][0];
                thing.output = thing[`quest${thing.currentQuest}`][1];
                const remainingRequired = thing[`quest${thing.currentQuest}`].slice(2);
                thing.qrequired.push(...remainingRequired);

                thing.currentQuest++;
              }
            }
          }
        }
      }

      // Equip Armor
      for (let item in armorProperties) {
        if (item == HAND_EMOJI && armorProperties[HAND_EMOJI]) {
          let slot = armorProperties[HAND_EMOJI].slot;
          if (armor[slot] != "") {
            addInventory(armor[slot]);
            armor[slot] = HAND_EMOJI;
            removeInventory(HAND_EMOJI);
          } else {
            armor[slot] = HAND_EMOJI;
            removeInventory(HAND_EMOJI);
          }
          if (showInv != "") {openInventory();}
        }
      }
      
      if (armor[4] == "🛡️") {
        RHAND_EMOJI = "🛡️";
        raisedShield = true;
      } else {
        RHAND_EMOJI = "🤚";
        raisedShield = false;
      }
      
      showFistEmojiTemporarily(RHAND_EMOJI);
      let q1 = abbreviateQuest(3, 4) ?? "";
      let q2 = abbreviateQuest(5, 4) ?? "";
      let q3 = abbreviateQuest(4, 3) ?? "";
      let q4 = abbreviateQuest(4, 5) ?? "";
      
      if (direction == "up") {
      tooltip.innerHTML = `<b>${objectProperties[current_map[moveY + 3][moveX + 4]].name}</b><br>${objectProperties[current_map[moveY + 3][moveX + 4]].description ?? ""} ${q1}`;

      } else if (direction == "down") {
      tooltip.innerHTML = `<b>${objectProperties[current_map[moveY + 5][moveX + 4]].name}</b><br>${objectProperties[current_map[moveY + 5][moveX + 4]].description ?? ""} ${q2}`;

        
      } else if (direction == "left") {
      tooltip.innerHTML = `<b>${objectProperties[current_map[moveY + 4][moveX + 3]].name}</b><br>${objectProperties[current_map[moveY + 4][moveX + 3]].description ?? ""} ${q3}`;
        
      } else if (direction == "right") {
      tooltip.innerHTML = `<b>${objectProperties[current_map[moveY + 4][moveX + 5]].name}</b><br>${objectProperties[current_map[moveY + 4][moveX + 5]].description ?? ""} ${q4}`;
        
      }
      return;
    } else if (key == "c") {
        craftItem();
    } else if (key == "e") {
      // Inventory Stuff
        if (showInv == "") {
          openInventory();
        } else {showInv = "";}
    } else {
      Jpress = false;
      tooltip.innerHTML = "";
      durability = 0;
      clickCounter = 0;
      raisedShield = false;
    }

    if (HAND_EMOJI == "") {
      HAND_EMOJI = "👊";
    }

    playerTile = current_map[moveY + 4][moveX + 4];
    updateAdjacent();
    
    if (showInv != "") {
      openInventory();
    }
    
    // Boss related stuff
    if (boss_mode) {
      
      let newPlayerX = playerPosition.x + dx;
      let newPlayerY = playerPosition.y + dy;
      // Check if the new player position is within the limited visible area
      if (newPlayerX >= 1 && newPlayerX <= GRID_NUMBER && newPlayerY >= 1 && newPlayerY <= GRID_NUMBER) {
        playerPosition.x = newPlayerX;
        playerPosition.y = newPlayerY;
        drawGrid();
      }
    }
    
    if (playerTile == "🕳️") {
      goBack();
      level = -1;
    } else if (playerTile == "🪜") {
      goBack();
      level = 0;
    } else if (playerTile == "🏠" || playerTile == "🏚️" || playerTile == "🏢" || playerTile == "🛖") {
      goBack();
      if (level == 0) {
        level = 3;
      } else if (level == -1) {
        level = -3;
      }
    } else if (playerTile == "🚪") {
      goBack();
      if (level == 3) {
        level = 0;
      } else if (level == -3) {
        level = -1;
      }
    } else if (playerTile == "🏰") {
      goBack();
      if (level == -1) {
        level = -3;
      } else if (level == -3) {
        level = -1;
      }
    } else if (playerTile == "⛩️") {
      goBack();
      if (level == -3) {
        level = -2;
      } else if (level == -2) {
        level = -3;
      }
    } else if (playerTile == "🌎") {
      goBack();
      level = 1;
    } 
    
    // Explosives
    else if (playerTile == "💥") {
      setBlock(dim(),4,4,"💥"," ");
    } else if (playerTile == "🧨") {
      damage(4);
      PLAYER_EMOJI = "😵‍💫";
      setBlock(dim(),4,4,"🧨","💥");
      setBlock(dim(),3,4," ","💥");
      setBlock(dim(),5,4," ","💥");
      setBlock(dim(),4,3," ","💥");
      setBlock(dim(),4,5," ","💥");

      setTimeout(function(){
        setBlock(dim(),4,4,"💥"," ");
        setBlock(dim(),3,4,"💥"," ");
        setBlock(dim(),5,4,"💥"," ");
        setBlock(dim(),4,5,"💥"," ");
        setBlock(dim(),4,3,"💥"," ");
      },400)
    } else if (playerTile == "💣") {
      damage(4);
      PLAYER_EMOJI = "😵‍💫";
      setBlock(dim(),4,4,"💣","💥");
      setBlock(dim(),3,4," ","💥");
      setBlock(dim(),5,4," ","💥");
      setBlock(dim(),4,3," ","💥");
      setBlock(dim(),4,5," ","💥");

      setTimeout(function(){
        setBlock(dim(),4,4,"💥"," ");
        setBlock(dim(),3,4,"💥"," ");
        setBlock(dim(),5,4,"💥"," ");
        setBlock(dim(),4,5,"💥"," ");
        setBlock(dim(),4,3,"💥"," ");
      },400)
    }
    // Tractor-things
    else if (playerTile == "🚜") {
      tractorMode = true;
      setBlock(dim(),4,4,"🚜"," ")
      tooltip.innerHTML = "Press 'Q' to escape."
    } else if (tractorMode) {
      for (let emoji in farmCrops) {
        if (playerTile === emoji) {
          const crop = farmCrops[emoji];
          if (setBlock(dim(), 4, 4, emoji, crop.seed)) {
            addInventory(emoji);
          }
          break; // Exit the loop after finding a match
        }
      }
    }
    else if (playerTile == "🗑️") {
      removeInventory(HAND_EMOJI);
    } else if (playerTile == "❄️" || playerTile == "🌨️") {
      PLAYER_EMOJI = "🥶";
      burning = 0;
    } else if (adjacent.includes("🌊")) {
      burning = 0;
    } else if (playerTile == "🌋" || playerTile == "🔥") {
      burning = 20;
    } else if (playerTile == "🌵" || playerTile == "🌪") {
      damageTick = 80;
      damage(1);
    }
   
    if (playerTile == "🛏️") {
      PLAYER_EMOJI = "🛌";
      time -=10;
    } else if (playerTile != "🛏️" && PLAYER_EMOJI == "🛌") {PLAYER_EMOJI = "😄"}
    if (playerTile in objectProperties) {
      if (!objectProperties[playerTile].canBeWalkedOn) {goBack();}
    }
    
    drawGrid();
  }

  function moveEvents() {
    if (boss_mode) {
      const dx = playerPosition.x - bossPosition.x;
      const dy = playerPosition.y - bossPosition.y;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
     
      drawGrid();

      // Move towards player in the direction of the maximum absolute difference
      if (boss_move && !win) {
        if (absDx > absDy) {
          bossPosition.x += dx > 0 ? 1 : -1;
        } else {
          bossPosition.y += dy > 0 ? 1 : -1;
        }
      }
      
      // Specific Boss Properties
      if (currentBoss == "🤖") {
        if (Math.random() < 0.06) {
          boss_move = false;

          const interval = setInterval(function() {
            bossShoot("⚙");
          }, 50);

          setTimeout(function() {
            clearInterval(interval);
            boss_move = true;
          }, 2000);
        }
      }
      
      if (currentBoss == "🐀") {
        if (Math.random() < 0.05) {
          boss_move = false;
          
          setInterval(function() {
            currentProjectiles.push( ["🐭",bossPosition.x,bossPosition.y,4,1,"boss",10] );
          }, 500);
          setTimeout(function() {
            boss_move = true;
            
          }, 3000);
        }
      }
      
      if (currentBoss == "🤡") {
        if (Math.random() < 0.05) {
          bossPosition = {x:1,y:1};
          currentProjectiles.push( ["🤡",9,1,4,3,"boss",10] );
          currentProjectiles.push( ["🤡",1,9,4,1,"boss",10] );
          currentProjectiles.push( ["🤡",9,9,4,1,"boss",10] );
        }
      }
      
      if (currentBoss == "🪬") {
        if (Math.random() < 0.1) {
          let rng1 = Math.floor(Math.random() * 9) + 1;
          let rng2 = Math.floor(Math.random() * 9) + 1;
          bossPosition = {x:rng1,y:rng2};
        } else if (Math.random() < 0.1) {
          let new1 = bossPosition.x += 2;
          bossPosition.x = new1;
        } else if (Math.random() < 0.1) {
          let new1 = bossPosition.x -= 2;
          bossPosition.x = new1;
        } else if (Math.random() < 0.1) {
          let new2 = bossPosition.y += 2;
          bossPosition.y = new1;
        } else if (Math.random() < 0.1) {
          let new2 = bossPosition.y -= 2;
          bossPosition.y = new1;
        }
      }
      
      if (currentBoss == "🐲") {
        let rng = 0.1;
        if (MAX_BOSS_HEALTH / 2 >= bossHealth) {
            BOSS_EMOJI = "🐉";
            rng = 0.04;
            if (Math.random() < 0.2) {
            boss_move = false;

            const interval = setInterval(function() {
              bossShoot("🔥");
            }, 50);

            setTimeout(function() {
              clearInterval(interval);
              boss_move = true;
            }, 2000);
          }
        }
        
        if (Math.random() < rng) {
          currentProjectiles.push(["⛈",1,2,3,3,"boss",100]);
          currentProjectiles.push(["🌧",1,4,3,3,"boss",100]);
          currentProjectiles.push(["🌩",1,6,3,3,"boss",100]);
          currentProjectiles.push(["⛈",1,8,3,3,"boss",100]);
        } else if (Math.random() < rng) {
          currentProjectiles.push(["⛈",9,1,2,3,"boss",100]);
          currentProjectiles.push(["🌧",9,3,2,3,"boss",100]);
          currentProjectiles.push(["🌩",9,5,2,3,"boss",100]);
          currentProjectiles.push(["⛈",9,7,2,3,"boss",100]);
          currentProjectiles.push(["🌧",9,9,2,3,"boss",100]);
        } 
      }
      
      if (currentBoss == "👽") {
        if (Math.random() < 0.1) {
          let y = [1,1,1,1,1,1,1,1,1];
          let x = [1,2,3,4,5,6,7,8,9];
          const randomIndex = Math.floor(Math.random() * x.length);
          x.splice(randomIndex, 1);
          y.splice(randomIndex, 1);
          console.log(y)
          
          for (let i = 0; i < x.length; i++) {
            currentProjectiles.push(["👾",x[i],y[i],1,5,"boss",100]);
          }
        }
      }
      
      if (currentBoss == "👹") {
        if (MAX_BOSS_HEALTH / 2 >= bossHealth) {
          burning = 50;
        }
        if (Math.random() < 0.2) {
          boss_move = false;

          const interval = setInterval(function() {
            bossShoot("🔥");
          }, 50);

          setTimeout(function() {
            clearInterval(interval);
            boss_move = true;
          }, 2000);
        }
      }

      if (bossHealth <= 0) {
        // Boss is defeated
        BOSS_EMOJI = "☠️";
        PLAYER_EMOJI = "🥳";
        win = true;
        playerPosition = { x: 5, y: 5 };
        boss_mode = false;
        for (let i = 0; i < BOSS_LOOT.length; i++) {
          addInventory(BOSS_LOOT[i]);
        }
      }

      if (playerHealth == 1) {
        PLAYER_EMOJI = "😵‍💫";
      }
      
      if (!win) {
        // Boss loses health if punched & gets angry
        if (direction == "up" && Jpress && playerPosition.x === bossPosition.x && playerPosition.y - 1 === bossPosition.y) {
          BOSS_EMOJI = ANGRY;
          bossHealth -= weaponProperties[HAND_EMOJI].damage;
        } else if (direction == "down" && Jpress && playerPosition.x === bossPosition.x && playerPosition.y + 1 === bossPosition.y) {
          BOSS_EMOJI = ANGRY;
          bossHealth -= weaponProperties[HAND_EMOJI].damage;
        } else if (direction == "left" && Jpress && playerPosition.x - 1 === bossPosition.x && playerPosition.y === bossPosition.y) {
          BOSS_EMOJI = ANGRY;
          bossHealth -= weaponProperties[HAND_EMOJI].damage;
        } else if (direction == "right" && Jpress && playerPosition.x + 1 === bossPosition.x && playerPosition.y === bossPosition.y) {
          BOSS_EMOJI = ANGRY;
          bossHealth -= weaponProperties[HAND_EMOJI].damage;
        } else {
          BOSS_EMOJI = BOSS;
        }
      }
            
      // Calculate projectiles
      for (let proj = 0; proj < currentProjectiles.length; proj++) {
        let obj = currentProjectiles[proj];
        if (obj[3] == 0) {
          obj[2]--;
        } else if (obj[3] == 1) {
          obj[2]++;
        } else if (obj[3] == 2) {
          obj[1]--;
        } else if (obj[3] == 3) {
          obj[1]++;
        } else if (obj[3] == 4) {
          const dxx = playerPosition.x - obj[1];
          const dyy = playerPosition.y - obj[2];

          const absDxx = Math.abs(dxx);
          const absDyy = Math.abs(dyy);

          if (absDxx > absDyy) {
            obj[1] += dxx > 0 ? 1 : -1;
          } else {
            obj[2] += dyy > 0 ? 1 : -1;
          }
          if (Math.random() < 0.4) {
            let rng = Math.floor(Math.random() * 4);
            switch (rng) {
              case 0:
                obj[1] --; break;
              case 1:
                obj[1] ++; break;
              case 2:
                obj[2] --; break;
              case 3:
                obj[2] ++; break;
            }
          }
          obj[6] --;
          if (obj[6] == 0) {
            currentProjectiles.splice(proj, 1);
          }
        }

        if (obj[1] === bossPosition.x && obj[2] === bossPosition.y && obj[5] == "player") {
          if (bossHealth - obj[4] <= 0) {
            bossHealth = 0;
          } else {
            bossHealth -= obj[4];
          }
          BOSS_EMOJI = ANGRY;
        } else if (obj[1] === playerPosition.x && obj[2] === playerPosition.y && obj[5] == "boss") {
          if (projRegester == 0) {damage(obj[4]);}
          } else {BOSS_EMOJI = BOSS;}
        if (obj[1] <= 0 || obj[1] > GRID_NUMBER || obj[2] <= 0 || obj[2] > GRID_NUMBER) {
          currentProjectiles.splice(proj, 1);
        }
      }
      
    }
    drawGrid();
  }

  document.addEventListener("mousedown", movePlayer);
  document.addEventListener("keydown", movePlayer);
  setInterval(moveEvents, speed);

  drawGrid();
});
