(function() {
  console.log("expedition.js is running");

  // ===========================
  // 1) CSS & Styling
  // ===========================
  const styleElem = document.createElement("style");
  styleElem.innerHTML = `
    @keyframes blinkGold {
      0% { color: #FFD700; }
      50% { color: #FFF; }
      100% { color: #FFD700; }
    }
    @keyframes glowPurple {
      0% { text-shadow: 0 0 5px #8A2BE2; }
      50% { text-shadow: 0 0 20px #8A2BE2; }
      100% { text-shadow: 0 0 5px #8A2BE2; }
    }

    /* Custom scrollbar styling for #rightMenuContent for a pixelated look */
    #rightMenuContent::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }
    #rightMenuContent::-webkit-scrollbar-track {
      background: #222;
      border: 2px solid #FFD700;
    }
    #rightMenuContent::-webkit-scrollbar-thumb {
      background: #555;
      border: 2px solid #FFD700;
      border-radius: 0;
    }
    /* Firefox scrollbar styling */
    #rightMenuContent {
      scrollbar-width: auto;
      scrollbar-color: #555 #222;
    }

    /* Expedition Overlay for launching expeditions */
    #expeditionOverlay {
      position: fixed;
      top: 0; 
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: none; 
      z-index: 2000;
      align-items: center;
      justify-content: center;
    }
    #expeditionPopup {
      background: #222;
      border: 2px solid #FFD700;
      color: #FFD700;
      width: 320px;            /* a bit wider to prevent text overflow */
      padding: 10px 15px;      /* extra padding for spacing */
      box-sizing: border-box;  /* ensures width includes padding */
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      text-align: center;
      box-shadow: 4px 4px 0 #000;
      position: relative;
    }
    #expeditionPopup h3 {
      margin-bottom: 8px;
      font-size: 16px;
    }
    #expeditionPopup p {
      font-size: 11px; 
      line-height: 1.4;   /* better line spacing */
      margin: 0 0 10px 0; /* spacing below paragraph */
      text-align: left;   /* or keep center if you prefer */
    }
    #expeditionPopup button {
      background-color: #555;
      border: 1px solid #FFD700;
      color: #FFD700;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 2px 2px 0 #000;
      margin: 5px;
      font-family: 'Press Start 2P', monospace;
      font-size: 10px;
    }
    #expeditionPopup button:hover {
      background-color: #666;
    }

    /* Loot Overlay for showing items after success */
    #expeditionLootOverlay {
      position: fixed;
      top: 0; 
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: none; 
      z-index: 3000;
      align-items: center;
      justify-content: center;
    }
    #expeditionLootPopup {
      background: #222;
      border: 2px solid #FFD700;
      color: #FFD700;
      padding: 20px;
      width: 400px;
      box-shadow: 4px 4px 0 #000;
      position: relative;
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      text-align: center;
    }
    #expeditionLootPopup h3 {
      margin-bottom: 10px;
      font-size: 14px;
    }
    #expeditionLootPopup .loot-items {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin: 10px 0;
      max-height: 200px;
      overflow-y: auto;
    }
    #expeditionLootPopup button {
      background-color: #555;
      border: 1px solid #FFD700;
      color: #FFD700;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 2px 2px 0 #000;
      margin: 5px;
      font-family: 'Press Start 2P', monospace;
      font-size: 10px;
    }
    #expeditionLootPopup button:hover {
      background-color: #666;
    }
  `;
  document.head.appendChild(styleElem);

  // ===========================
  // 2) Item color/look definitions
  // ===========================
  const materialColors = {
    "Iron": "#4B4B4B",
    "Steel": "#6A6A6A",
    "Wood": "#8B4513",
    "Obsidian": "#2E2B2B",
    "Crystal": "#A8DADC",
    "Gold": "#FFD700",
    "Silver": "#C0C0C0",
    "Bronze": "#CD7F32",
    "Emerald": "#50C878",
    "Sapphire": "#0F52BA"
  };

  const adjectiveGlow = {
    "Ancient": "#4B4F44",
    "Mystic": "#6A4E9C",
    "Cursed": "#800000",
    "Divine": "#FFD700",
    "Glorious": "#FF8C00",
    "Enchanted": "#32CD32",
    "Forgotten": "#A9A9A9",
    "Fabled": "#B22222",
    "Ethereal": "#00FFFF",
    "Shadow": "#2F4F4F"
  };

  const rarityColors = {
    "Common": "#B0B0B0",
    "Uncommon": "#3CB371",
    "Rare": "#1E90FF",
    "Epic": "#8A2BE2",
    "Legendary": "#FF4500"
  };

  // ===========================
  // 3) Fallback resources
  // ===========================
  if (typeof resources === "undefined") {
    window.resources = {
      iron: 1000,
      bronze: 1000,
      silver: 1000,
      gold: 1000,
      diamond: 1000,
      population: 0,
      celestials: 0
    };
  }

  // A quick popup for smaller notifications
  function showPopupAlert(message) {
    const overlay = document.createElement("div");
    overlay.id = "customAlertOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "1000";

    const alertBox = document.createElement("div");
    alertBox.style.backgroundColor = "#222";
    alertBox.style.border = "2px solid #FFD700";
    alertBox.style.padding = "20px";
    alertBox.style.color = "#FFD700";
    alertBox.style.fontFamily = "'Press Start 2P', monospace";
    alertBox.style.fontSize = "14px";
    alertBox.style.textAlign = "center";
    alertBox.innerText = message;
    
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "OK";
    closeBtn.style.marginTop = "10px";
    closeBtn.style.padding = "5px 10px";
    closeBtn.style.backgroundColor = "#FFD700";
    closeBtn.style.border = "none";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.borderRadius = "4px";
    closeBtn.style.boxShadow = "2px 2px 0 #000";
    closeBtn.addEventListener("click", () => {
      overlay.remove();
    });
    alertBox.appendChild(closeBtn);
    
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
  }

  function styleButton(btn) {
    btn.style.backgroundColor = "#555";
    btn.style.border = "1px solid #FFD700";
    btn.style.color = "#FFD700";
    btn.style.padding = "5px 10px";
    btn.style.borderRadius = "4px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "2px 2px 0 #000";
    btn.style.fontFamily = "'Press Start 2P', monospace";
    btn.style.fontSize = "10px";
  }

  // ===========================
  // 4) Global inventory + loot
  // ===========================
  let playerInventory = JSON.parse(localStorage.getItem("playerInventory") || "[]");
  let expeditionLoot = JSON.parse(localStorage.getItem("expeditionLoot") || "[]");

  // Rehydrate item
  function rehydrateItem(itemData) {
    itemData.upgradeLevel = itemData.upgradeLevel || 0;
    return {
      name: itemData.name,
      adjective: itemData.adjective,
      material: itemData.material,
      itemType: itemData.itemType,
      rarity: itemData.rarity,
      level: itemData.level,
      power: itemData.power,
      image: itemData.image,
      upgradeLevel: itemData.upgradeLevel,
      description: itemData.description,
      render: function() {
        const itemDiv = document.createElement("div");
        itemDiv.style.position = "relative";
        itemDiv.style.width = "50px";
        itemDiv.style.height = "50px";
        itemDiv.style.margin = "5px";
        itemDiv.style.border = "1px solid #DDD";
        itemDiv.style.backgroundImage = `url('${this.image}')`;
        itemDiv.style.backgroundSize = "contain";
        itemDiv.style.backgroundRepeat = "no-repeat";
        itemDiv.style.backgroundPosition = "center";
        
        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = materialColors[this.material] || "transparent";
        overlay.style.opacity = "0.1";
        itemDiv.appendChild(overlay);
        
        const title = document.createElement("div");
        title.className = "item-title";
        title.innerText = this.name;
        title.style.position = "absolute";
        title.style.bottom = "0";
        title.style.left = "0";
        title.style.right = "0";
        title.style.fontSize = "8px";
        title.style.textAlign = "center";
        title.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        title.style.color = "#FFF";
        title.style.textShadow = `0 0 5px ${adjectiveGlow[this.adjective] || "#FFF"}`;
        // Remove simple title color change and add modal display on hover.
        itemDiv.addEventListener("mouseover", function(e) {
          // Hide the inventory item completely.
          itemDiv.style.opacity = "0";
          itemDiv.style.transform = "scale(1.05)";
          itemDiv.style.boxShadow = "0 0 10px " + (rarityColors[this.rarity] || "#FFD700");
          // Hide title overlay if present.
          title.style.display = "none";
          
          // Create and display modal with item details.
          const modal = document.createElement("div");
          modal.style.position = "absolute";
          modal.style.backgroundColor = "rgba(0,0,0,0.9)";
          modal.style.color = rarityColors[this.rarity] || "#FFF";
          modal.style.padding = "8px";
          modal.style.borderRadius = "4px";
          modal.style.zIndex = "4000";
          modal.style.border = `2px solid ${rarityColors[this.rarity] || "#FFF"}`;
          modal.style.fontSize = "0.8em";
          modal.style.fontFamily = "Arial, sans-serif";
          modal.style.fontWeight = "bold";
          modal.style.textTransform = "uppercase";
          modal.style.width = "140px";
          modal.innerHTML = `<div style="border-bottom:1px solid ${rarityColors[this.rarity] || "#FFF"}; margin-bottom:4px; padding-bottom:4px;">
                               <img src="${this.image}" style="width:50px;height:50px;display:block;margin:0 auto;">
                             </div>` 
                             + this.getDescription();
          document.body.appendChild(modal);
          itemDiv._modal = modal;
          const rect = itemDiv.getBoundingClientRect();
          modal.style.top = (rect.top + window.scrollY + itemDiv.offsetHeight) + "px";
          modal.style.left = (rect.left + window.scrollX - 20) + "px";
        }.bind(this));
        itemDiv.addEventListener("mouseout", function() {
          // Restore original appearance.
          itemDiv.style.opacity = "1";
          itemDiv.style.transform = "scale(1)";
          itemDiv.style.boxShadow = "none";
          if (itemDiv._modal) {
            document.body.removeChild(itemDiv._modal);
            itemDiv._modal = null;
          }
          title.style.display = "block";
        });
        itemDiv.appendChild(title);

        if (this.upgradeLevel > 0) {
          const upgradeLabel = document.createElement("div");
          upgradeLabel.innerText = "Upgrade +" + this.upgradeLevel;
          upgradeLabel.style.position = "absolute";
          upgradeLabel.style.top = "2px";
          upgradeLabel.style.left = "2px";
          upgradeLabel.style.fontSize = "8px";
          upgradeLabel.style.backgroundColor = "rgba(0,0,0,0.6)";
          upgradeLabel.style.color = "#FFD700";
          upgradeLabel.style.padding = "1px 3px";
          upgradeLabel.style.borderRadius = "2px";
          itemDiv.appendChild(upgradeLabel);
        }
        return itemDiv;
      },
      getDescription: function() {
        return `A ${this.rarity} item: ${this.name} (Level ${this.level}, Power ${this.power}, Upgrade +${this.upgradeLevel}).`;
      }
    };
  }

  // Weighted Rarity (Common=90, Uncommon=50, Rare=30, Epic=10, Legendary=5 => total=185)
  const rarityWeights = [
    { rarity: "Common", weight: 90 },
    { rarity: "Uncommon", weight: 50 },
    { rarity: "Rare", weight: 30 },
    { rarity: "Epic", weight: 10 },
    { rarity: "Legendary", weight: 5 }
  ];
  const totalWeight = rarityWeights.reduce((acc, rw) => acc + rw.weight, 0); // 185

  function chooseRarity() {
    let rnd = Math.floor(Math.random() * totalWeight) + 1;
    let cumulative = 0;
    for (let i = 0; i < rarityWeights.length; i++) {
      cumulative += rarityWeights[i].weight;
      if (rnd <= cumulative) {
        return rarityWeights[i].rarity;
      }
    }
    return "Common";
  }

  // Generate an item with forced rarity and adjusted stats
  function generateCustomItem() {
    // Use items.js random item logic
    let item = window.generateRandomItem();
    // Force chosen rarity
    const forcedRarity = chooseRarity();
    item.rarity = forcedRarity;

    // Adjust level (basing on forced rarity)
    let baseLevel = Math.floor(Math.random() * 100) + 1;
    switch (forcedRarity) {
      case "Uncommon": baseLevel = Math.max(baseLevel, 20); break;
      case "Rare": baseLevel = Math.max(baseLevel, 40); break;
      case "Epic": baseLevel = Math.max(baseLevel, 60); break;
      case "Legendary": baseLevel = Math.max(baseLevel, 80); break;
      default: break;
    }
    item.level = baseLevel;

    // Recompute power: (base power range 5..15) * level * rarity multiplier
    let basePwr = Math.floor(Math.random() * 11) + 5; // 5..15
    let rarityMult = 1;
    switch (forcedRarity) {
      case "Uncommon": rarityMult = 1.2; break;
      case "Rare": rarityMult = 1.5; break;
      case "Epic": rarityMult = 2; break;
      case "Legendary": rarityMult = 3; break;
      default: rarityMult = 1; break;
    }
    item.power = Math.floor(basePwr * item.level * rarityMult);

    return item;
  }

  // Save & update stats
  function saveData() {
    localStorage.setItem("playerInventory", JSON.stringify(playerInventory));
    localStorage.setItem("expeditionLoot", JSON.stringify(expeditionLoot));
    updateInventoryStats();
    updateResourceDisplay();
  }

  const statsContainer = document.createElement("div");
  statsContainer.style.display = "flex";
  statsContainer.style.flexDirection = "column";
  statsContainer.style.gap = "5px";
  statsContainer.style.marginBottom = "10px";

  const totalPowerDiv = document.createElement("div");
  totalPowerDiv.id = "totalPowerDiv";
  totalPowerDiv.style.fontFamily = "'Press Start 2P', monospace";
  totalPowerDiv.style.fontSize = "12px";
  totalPowerDiv.style.color = "#FFD700";

  const legendaryDiv = document.createElement("div");
  legendaryDiv.id = "legendaryDiv";
  legendaryDiv.style.fontFamily = "'Press Start 2P', monospace";
  legendaryDiv.style.fontSize = "12px";
  legendaryDiv.style.color = "#FFD700";

  statsContainer.appendChild(totalPowerDiv);
  statsContainer.appendChild(legendaryDiv);

  function updateInventoryStats() {
    let totalPower = 0;
    let legendaryCount = 0;
    playerInventory.forEach(itemData => {
      totalPower += itemData.power;
      if (itemData.rarity === "Legendary") legendaryCount++;
    });
    totalPowerDiv.innerText = `Kingdom Power: ${totalPower}`;
    legendaryDiv.innerText = `Legendary: ${legendaryCount}`;
    if (legendaryCount > 0) {
      legendaryDiv.style.animation = "blinkGold 1s infinite";
    } else {
      legendaryDiv.style.animation = "";
    }
  }

  function updateResourceDisplay() {
    console.log("Resources updated:", resources);
  }
  updateResourceDisplay();

  // ===========================
  // 5) Build the Right Menu
  // ===========================
  const rightMenuContainer = document.createElement("div");
  rightMenuContainer.id = "rightMenu";
  rightMenuContainer.style.position = "fixed";
  rightMenuContainer.style.top = "100px";
  rightMenuContainer.style.right = "60px";
  rightMenuContainer.style.width = "220px";
  rightMenuContainer.style.backgroundColor = "rgba(0,0,0,0.8)";
  rightMenuContainer.style.borderLeft = "2px solid #FFD700";
  rightMenuContainer.style.padding = "10px";
  rightMenuContainer.style.zIndex = "200";
  rightMenuContainer.style.color = "#FFD700";
  rightMenuContainer.style.display = "block";
  document.body.appendChild(rightMenuContainer);

  rightMenuContainer.appendChild(statsContainer);

  const tabButtonsContainer = document.createElement("div");
  tabButtonsContainer.style.display = "flex";
  tabButtonsContainer.style.justifyContent = "space-around";
  tabButtonsContainer.style.marginBottom = "10px";
  rightMenuContainer.appendChild(tabButtonsContainer);

  const expeditionTabBtn = document.createElement("button");
  expeditionTabBtn.innerText = "Expedition";
  styleButton(expeditionTabBtn);
  tabButtonsContainer.appendChild(expeditionTabBtn);

  const inventoryTabBtn = document.createElement("button");
  inventoryTabBtn.innerText = "Inventory";
  styleButton(inventoryTabBtn);
  tabButtonsContainer.appendChild(inventoryTabBtn);

  const tabContent = document.createElement("div");
  tabContent.id = "rightMenuContent";
  tabContent.style.maxHeight = "400px";
  tabContent.style.overflowY = "auto";
  rightMenuContainer.appendChild(tabContent);

  // ===========================
  // 6) Expedition Overlay
  // ===========================
  const expeditionOverlay = document.createElement("div");
  expeditionOverlay.id = "expeditionOverlay";
  expeditionOverlay.style.display = "none";
  expeditionOverlay.style.alignItems = "center";
  expeditionOverlay.style.justifyContent = "center";
  document.body.appendChild(expeditionOverlay);

  const expeditionPopup = document.createElement("div");
  expeditionPopup.id = "expeditionPopup";
  expeditionOverlay.appendChild(expeditionPopup);

  /**
   * Show the expedition popup with improved spacing
   */
  function showExpeditionPopup() {
    expeditionPopup.innerHTML = "";

    // Title
    const title = document.createElement("h3");
    title.innerText = "Choose Expedition Type";
    expeditionPopup.appendChild(title);

    // Info text with line breaks
    const info = document.createElement("p");
    info.innerHTML = `
      <strong>Normal</strong>: <br>(1–2 loots, ~5mins)<br>
      <strong>Hardcore</strong>: <br>(2–3 loots, ~1hr)<br>
      <strong>Suicidal</strong>: <br>(3–10 loots, ~24hr)<br>
      <br>
      <em>Drop Rates:</em><br>
      Common(90%)<br> Uncommon(50%)<br> Rare(30%)<br> Epic(10%)<br> Legendary(5%)
    `;
    expeditionPopup.appendChild(info);

    // Normal
    const normalBtn = document.createElement("button");
    normalBtn.innerText = "Normal";
    normalBtn.addEventListener("click", function() {
      startExpedition("Normal", { duration: 1, lootMin: 1, lootMax: 2 });
    });
    expeditionPopup.appendChild(normalBtn);

    // Hardcore
    const hardcoreBtn = document.createElement("button");
    hardcoreBtn.innerText = "Hardcore";
    hardcoreBtn.addEventListener("click", function() {
      startExpedition("Hardcore", { duration: 1, lootMin: 2, lootMax: 3 });
    });
    expeditionPopup.appendChild(hardcoreBtn);

    // Suicidal
    const suicidalBtn = document.createElement("button");
    suicidalBtn.innerText = "Suicidal";
    suicidalBtn.addEventListener("click", function() {
      startExpedition("Suicidal", { duration: 1, lootMin: 3, lootMax: 10 });
    });
    expeditionPopup.appendChild(suicidalBtn);

    // If leftover loot is present, let them keep it
    if (expeditionLoot.length > 0) {
      const keepAllBtn = document.createElement("button");
      keepAllBtn.innerText = "Keep All Loot";
      keepAllBtn.addEventListener("click", function() {
        keepAllLoot();
      });
      expeditionPopup.appendChild(keepAllBtn);
    }

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.addEventListener("click", function() {
      expeditionOverlay.style.display = "none";
    });
    expeditionPopup.appendChild(closeBtn);

    expeditionOverlay.style.display = "flex";
  }

  // ===========================
  // 7) Loot Overlay (for success)
  // ===========================
  const expeditionLootOverlay = document.createElement("div");
  expeditionLootOverlay.id = "expeditionLootOverlay";
  expeditionLootOverlay.style.display = "none";
  expeditionLootOverlay.style.alignItems = "center";
  expeditionLootOverlay.style.justifyContent = "center";
  document.body.appendChild(expeditionLootOverlay);

  const expeditionLootPopup = document.createElement("div");
  expeditionLootPopup.id = "expeditionLootPopup";
  expeditionLootOverlay.appendChild(expeditionLootPopup);

  // Close button for loot overlay
  const closeLootBtn = document.createElement("button");
  closeLootBtn.innerText = "Close";
  closeLootBtn.addEventListener("click", function() {
    expeditionLootOverlay.style.display = "none";
  });

  function showExpeditionLootOverlay(newLoot) {
    expeditionLootPopup.innerHTML = "";

    const title = document.createElement("h3");
    title.innerText = `Expedition Succeeded! Found ${newLoot.length} item(s).`;
    expeditionLootPopup.appendChild(title);

    const lootContainer = document.createElement("div");
    lootContainer.className = "loot-items";
    expeditionLootPopup.appendChild(lootContainer);

    newLoot.forEach(itemData => {
      const itemObj = rehydrateItem(itemData);
      lootContainer.appendChild(itemObj.render());
    });

    const keepAllBtn = document.createElement("button");
    keepAllBtn.innerText = "Keep All";
    keepAllBtn.addEventListener("click", function() {
      keepAllLoot();
      expeditionLootOverlay.style.display = "none";
    });
    expeditionLootPopup.appendChild(keepAllBtn);

    expeditionLootPopup.appendChild(closeLootBtn);
    expeditionLootOverlay.style.display = "flex";
  }

  // Simple fail overlay
  function showFailOverlay(modeName) {
    const overlayId = "expeditionFailOverlay";
    let failOverlay = document.getElementById(overlayId);
    if (!failOverlay) {
      failOverlay = document.createElement("div");
      failOverlay.id = overlayId;
      failOverlay.style.position = "fixed";
      failOverlay.style.top = "0";
      failOverlay.style.left = "0";
      failOverlay.style.width = "100%";
      failOverlay.style.height = "100%";
      failOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      failOverlay.style.display = "flex";
      failOverlay.style.alignItems = "center";
      failOverlay.style.justifyContent = "center";
      failOverlay.style.zIndex = "3500";
      document.body.appendChild(failOverlay);
    }
    failOverlay.innerHTML = "";

    const failBox = document.createElement("div");
    failBox.style.backgroundColor = "#222";
    failBox.style.border = "2px solid #FFD700";
    failBox.style.color = "#FFD700";
    failBox.style.padding = "20px";
    failBox.style.fontFamily = "'Press Start 2P', monospace";
    failBox.style.fontSize = "12px";
    failBox.style.textAlign = "center";
    failBox.style.boxShadow = "4px 4px 0 #000";
    failOverlay.appendChild(failBox);

    const msg = document.createElement("p");
    msg.innerText = `Expedition (${modeName}) failed. Better luck next time!`;
    failBox.appendChild(msg);

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    styleButton(closeBtn);
    closeBtn.addEventListener("click", function() {
      failOverlay.style.display = "none";
    });
    failBox.appendChild(closeBtn);

    failOverlay.style.display = "flex";
  }

  // ===========================
  // 8) Tab click events
  // ===========================
  expeditionTabBtn.addEventListener("click", function() {
    showExpeditionPopup();
  });
  inventoryTabBtn.addEventListener("click", function() {
    tabContent.innerHTML = "";
    renderInventoryTab();
  });

  function renderInventoryTab() {
    const heading = document.createElement("h3");
    heading.innerText = "Player Inventory";
    heading.style.fontFamily = "'Press Start 2P', monospace";
    heading.style.fontSize = "12px";
    heading.style.marginBottom = "10px";
    tabContent.appendChild(heading);

    const inventoryWrapper = document.createElement("div");
    inventoryWrapper.style.display = "flex";
    inventoryWrapper.style.flexWrap = "wrap";
    tabContent.appendChild(inventoryWrapper);

    const rehydratedInv = playerInventory.map(itemData => rehydrateItem(itemData));
    rehydratedInv.forEach(item => {
      inventoryWrapper.appendChild(item.render());
    });
  }

  // Transfer all loot to inventory
  function keepAllLoot() {
    expeditionLoot.forEach(item => {
      playerInventory.push(item);
    });
    expeditionLoot = [];
    saveData();
  }

  // ===========================
  // 9) Expedition logic
  // ===========================
  let currentExpedition = JSON.parse(localStorage.getItem("currentExpedition") || "null");

  function startExpedition(modeName, mode) {
    // mode might contain: { duration, lootMin, lootMax }
    currentExpedition = {
      modeName: modeName,
      mode: mode,
      startTime: Date.now()
    };
    localStorage.setItem("currentExpedition", JSON.stringify(currentExpedition));
    expeditionOverlay.style.display = "none";
    resumeExpedition();
  }

  function resumeExpedition() {
    currentExpedition = JSON.parse(localStorage.getItem("currentExpedition") || "null");
    if (!currentExpedition) return;

    const duration = currentExpedition.mode.duration;
    let elapsed = (Date.now() - currentExpedition.startTime) / 1000;
    let remaining = duration - elapsed;

    if (remaining <= 0) {
      finishExpedition(currentExpedition);
      return;
    }
    let timerOverlay = document.getElementById("expeditionTimerOverlay");
    if (!timerOverlay) {
      timerOverlay = document.createElement("div");
      timerOverlay.id = "expeditionTimerOverlay";
      timerOverlay.style.position = "fixed";
      timerOverlay.style.top = "0";
      timerOverlay.style.left = "0";
      timerOverlay.style.width = "100%";
      timerOverlay.style.height = "100%";
      timerOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      timerOverlay.style.display = "flex";
      timerOverlay.style.flexDirection = "column";
      timerOverlay.style.alignItems = "center";
      timerOverlay.style.justifyContent = "center";
      timerOverlay.style.zIndex = "1500";
      document.body.appendChild(timerOverlay);
    }

    let timerBox = document.getElementById("expeditionTimerBox");
    if (!timerBox) {
      timerBox = document.createElement("div");
      timerBox.id = "expeditionTimerBox";
      timerBox.style.backgroundColor = "#222";
      timerBox.style.border = "2px solid #FFD700";
      timerBox.style.padding = "20px";
      timerBox.style.fontFamily = "'Press Start 2P', monospace";
      timerBox.style.fontSize = "16px";
      timerBox.style.color = "#FFD700";
      timerBox.style.textAlign = "center";
      timerOverlay.appendChild(timerBox);

      // Cancel button
      const cancelExpeditionBtn = document.createElement("button");
      cancelExpeditionBtn.innerText = "Cancel Expedition";
      styleButton(cancelExpeditionBtn);
      cancelExpeditionBtn.style.marginTop = "10px";
      cancelExpeditionBtn.addEventListener("click", function() {
        cancelExpedition();
      });
      timerOverlay.appendChild(cancelExpeditionBtn);
    }

    timerBox.innerText = `Expedition in progress...\n${currentExpedition.modeName} Mode\nTime remaining: ${Math.ceil(remaining)} sec`;

    if (window.expeditionIntervalId) clearInterval(window.expeditionIntervalId);
    window.expeditionIntervalId = setInterval(() => {
      currentExpedition = JSON.parse(localStorage.getItem("currentExpedition") || "null");
      if (!currentExpedition) {
        clearInterval(window.expeditionIntervalId);
        if (timerOverlay) timerOverlay.remove();
        return;
      }
      let nowElapsed = (Date.now() - currentExpedition.startTime) / 1000;
      let remain = duration - nowElapsed;
      if (remain <= 0) {
        clearInterval(window.expeditionIntervalId);
        timerOverlay.remove();
        finishExpedition(currentExpedition);
      } else {
        timerBox.innerText = `Expedition in progress...\n${currentExpedition.modeName} Mode\nTime remaining: ${Math.ceil(remain)} sec`;
      }
    }, 1000);
  }

  function finishExpedition(expeditionState) {
    localStorage.removeItem("currentExpedition");
    currentExpedition = null;
    let modeName = expeditionState.modeName;
    let mode = expeditionState.mode;

    // For simplicity, do 100% success. If you prefer successChance, you can add it here.
    const success = true;
    if (success) {
      let count = Math.floor(Math.random() * (mode.lootMax - mode.lootMin + 1)) + mode.lootMin;
      let newLoot = [];
      for (let i = 0; i < count; i++) {
        let customItem = generateCustomItem();
        newLoot.push(customItem);
      }
      newLoot.forEach(item => {
        expeditionLoot.push(item);
      });
      saveData();
      showExpeditionLootOverlay(newLoot);
    } else {
      showFailOverlay(modeName);
    }
  }

  function cancelExpedition() {
    localStorage.removeItem("currentExpedition");
    currentExpedition = null;
    if (window.expeditionIntervalId) {
      clearInterval(window.expeditionIntervalId);
    }
    const timerOverlay = document.getElementById("expeditionTimerOverlay");
    if (timerOverlay) timerOverlay.remove();
    showPopupAlert("Expedition canceled.");
  }

  // ===========================
  // 10) Initialization on load
  // ===========================
  updateInventoryStats();
  resumeExpedition(); 
})();
