// items.js
(function() {
  // -----------------------------
  // Helper function: Return a random element from an array.
  // -----------------------------
  function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // =======================
  // ITEM PROPERTIES
  // =======================

  // Define the item types and their associated image URLs.
  const itemTypes = [
    "Sword", "Shield", "Armor", "Ring", "Amulet",
    "Potion", "Scroll", "Boots", "Helmet", "Gloves",
    "Bow", "Staff", "Katana", "Dagger", "Knuckles", "TreasureBox"
  ];

  const itemImages = {
    "Sword": "https://cdn.midjourney.com/8486d8d1-d762-42dd-96d3-f56d4eceedeb/0_0.png",
    "Shield": "https://cdn.midjourney.com/baf88de6-16e0-49be-a428-d49ecaa009e7/0_3.png",
    "Armor": "https://cdn.midjourney.com/daaadd33-d950-4ec1-bd04-fa0e4cc9195d/0_0.png",
    "Ring": "https://cdn.midjourney.com/ffe4dc34-3a89-446e-9f52-e58d48657e6f/0_2.png",
    "Amulet": "https://cdn.midjourney.com/88509651-db45-42ec-a0cc-908b1055aec1/0_1.png",
    "Potion": "https://cdn.midjourney.com/dad6176e-ad77-40a0-ad88-9b22577a284b/0_0.png",
    "Scroll": "https://cdn.midjourney.com/2eb7b1e3-01be-4134-894f-f72de2dfde9c/0_1.png",
    "Boots": "https://cdn.midjourney.com/3a4521d1-cf5e-4859-996f-34277256d5ab/0_1.png",
    "Helmet": "https://cdn.midjourney.com/547eda90-d8a1-407d-916f-a2ef3e5bc271/0_3.png",
    "Gloves": "https://cdn.midjourney.com/9ac3241c-92ae-43d9-bf7a-18fd322817f5/0_1.png",
    "Bow": "https://cdn.midjourney.com/a3d2d2a3-e528-49ef-9ea4-3768b9c94f50/0_2.png",
    "Staff": "https://cdn.midjourney.com/aadca1bc-2df9-47d6-bb03-ea237d3b1578/0_0.png",
    "Katana": "https://cdn.midjourney.com/9dfdcca6-157b-43ba-ae59-dfc6a1a6a1ec/0_1.png",
    "Dagger": "https://cdn.midjourney.com/d5854b59-20b8-4064-8109-7b7ece86576f/0_0.png",
    "Knuckles": "https://cdn.midjourney.com/2aaa1d85-3cc4-4677-b97c-52e63d806e17/0_0.png",
    "TreasureBox": "https://cdn.midjourney.com/ff27a0cd-f04d-4897-963d-ea67c8233cb9/0_1.png"
  };

  // Define possible materials and their overlay colors.
  const materials = ["Iron", "Steel", "Wood", "Obsidian", "Crystal", "Gold", "Silver", "Bronze", "Emerald", "Sapphire"];
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

  // Define adjectives and their glow colors.
  const adjectives = ["Ancient", "Mystic", "Cursed", "Divine", "Glorious", "Enchanted", "Forgotten", "Fabled", "Ethereal", "Shadow"];
  const adjectiveGlow = {
    "Ancient": "#4B3F44",
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

  // Define rarities and their corresponding colors.
  const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
  const rarityColors = {
    "Common": "#B0B0B0",
    "Uncommon": "#3CB371",
    "Rare": "#1E90FF",
    "Epic": "#8A2BE2",
    "Legendary": "#FF4500"
  };

  // =======================
  // ITEM GENERATION
  // =======================
  function generateRandomItem() {
    const adjective = randomElement(adjectives);
    const material = randomElement(materials);
    const itemType = randomElement(itemTypes);
    const rarity = randomElement(rarities);
    const image = itemImages[itemType] || "";
    let level = Math.floor(Math.random() * 100) + 1;
    if (rarity === "Epic" || rarity === "Legendary") {
      level = Math.floor(Math.random() * 50) + 51; // Level between 51 and 100.
    }
    const basePower = Math.floor(Math.random() * 11) + 5; // Between 5 and 15.
    let rarityMultiplier = 1;
    switch(rarity) {
      case "Uncommon": rarityMultiplier = 1.2; break;
      case "Rare": rarityMultiplier = 1.5; break;
      case "Epic": rarityMultiplier = 2; break;
      case "Legendary": rarityMultiplier = 3; break;
      default: rarityMultiplier = 1; break;
    }
    const power = Math.floor(basePower * level * rarityMultiplier);
    const name = `${adjective} ${material} ${itemType}`;
    // Ensure TreasureBox power is always 0.
    const finalPower = (itemType === "TreasureBox") ? 0 : power;
    return {
      name: name,
      adjective: adjective,
      material: material,
      itemType: itemType,
      rarity: rarity,
      level: level,
      power: finalPower,
      image: image,
      upgradeLevel: 0,
      craftedStatus: null,
      render: function() {
        // Create the main container.
        const itemDiv = document.createElement("div");
        itemDiv.style.position = "relative";
        itemDiv.style.width = "80px";
        itemDiv.style.height = "80px";
        itemDiv.style.margin = "5px";
        itemDiv.style.border = "1px solid #DDD";
        // Use the image URL or a placeholder.
        itemDiv.style.backgroundImage = `url('${this.image || "https://via.placeholder.com/80"}')`;
        itemDiv.style.backgroundSize = "cover";
        itemDiv.style.backgroundRepeat = "no-repeat";
        itemDiv.style.backgroundPosition = "center";
        
        // Add a material overlay with 10% opacity.
        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = materialColors[this.material] || "transparent";
        overlay.style.opacity = "0.1";
        itemDiv.appendChild(overlay);
        
        // Title overlay: font color is based on rarity, with glow based on adjective.
        const title = document.createElement("div");
        title.innerText = this.name;
        title.style.position = "absolute";
        title.style.bottom = "0";
        title.style.left = "0";
        title.style.right = "0";
        title.style.fontSize = "8px";
        title.style.textAlign = "center";
        title.style.backgroundColor = "rgba(0,0,0,0.5)";
        title.style.color = rarityColors[this.rarity] || "#FFF";
        title.style.padding = "2px 0";
        title.style.textShadow = "0 0 5px " + (adjectiveGlow[this.adjective] || "#FFD700");
        itemDiv.appendChild(title);
        itemDiv._title = title;
        
        // Hover effects with modal on hover.
        itemDiv.style.transition = "transform 0.2s, box-shadow 0.2s";
        itemDiv.addEventListener("mouseover", function(e) {
          // Visual feedback without hiding element
          itemDiv.style.transform = "scale(1.05)";
          itemDiv.style.boxShadow = "0 0 10px " + (rarityColors[this.rarity] || "#FFD700");
          itemDiv.style.zIndex = "1001"; // Bring item to front
          if(itemDiv._title) { itemDiv._title.style.opacity = "0"; }
          
          // Create and display modal with item details.
          const modal = document.createElement("div");
          modal.style.position = "absolute";
          modal.style.backgroundColor = "rgba(0,0,0,0.9)";
          modal.style.color = rarityColors[this.rarity] || "#FFF";
          modal.style.padding = "8px";
          modal.style.borderRadius = "4px";
          modal.style.zIndex = "1000";
          modal.style.border = `2px solid ${rarityColors[this.rarity] || "#FFF"}`;
          modal.style.boxShadow = `0 0 10px ${adjectiveGlow[this.adjective] || "#FFD700"}`;
          modal.style.width = "140px";
          modal.style.fontSize = "0.9em";
          modal.style.fontFamily = "Arial, sans-serif";
          modal.style.fontWeight = "bold";
          modal.style.textTransform = "uppercase";
          modal.innerHTML = `<div style="color:${rarityColors[this.rarity] || "#FFF"}">` +
                           `<img src="${this.image}" style="width:50px;height:50px;display:block;margin:0 auto;border:2px solid ${rarityColors[this.rarity] || "#FFF"}"><br>` + 
                           this.getDescription() + `</div>`;
          document.body.appendChild(modal);
          itemDiv._modal = modal;
          const rect = itemDiv.getBoundingClientRect();
          // Position modal centered under cursor with offset
          const modalWidth = 160;
          modal.style.top = (e.clientY + window.scrollY + 15) + "px";
          modal.style.left = Math.min(
            e.clientX + window.scrollX - modalWidth/2, 
            window.innerWidth - modalWidth - 10
          ) + "px";
          modal.style.textShadow = "0 0 3px " + (adjectiveGlow[this.adjective] || "#FFD700");
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
          if(itemDiv._title) { itemDiv._title.style.display = "block"; }
        });
        return itemDiv;
      },
      getDescription: function() {
        return `<strong>Name:</strong> ${this.name}<br>
                <strong>Rarity:</strong> ${this.rarity}<br>
                <strong>Level:</strong> ${this.level}<br>
                <strong>Power:</strong> ${this.power}<br>
                <strong>Upgrade:</strong> +${this.upgradeLevel}`;
      }
    };
  }

  // =======================
  // SORTING FUNCTION
  // Automatically sort items: Legendary first, then Epic, Rare, Uncommon, Common.
  // =======================
  function sortItems(inventory) {
    const order = { "Legendary": 0, "Epic": 1, "Rare": 2, "Uncommon": 3, "Common": 4 };
    return inventory.sort((a, b) => order[a.rarity] - order[b.rarity]);
  }

  // =======================
  // EXPEDITION FUNCTION
  // =======================
  // Returns an array of random items.
  function Expedition(numItems) {
    numItems = numItems || Math.floor(Math.random() * 5) + 1;
    const loot = [];
    for (let i = 0; i < numItems; i++) {
      loot.push(generateRandomItem());
    }
    return loot;
  }

  // ----------------------
  // Expose functions globally.
  // ----------------------
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      generateRandomItem: generateRandomItem,
      sortItems: sortItems,
      Expedition: Expedition
    };
  } else {
    window.generateRandomItem = generateRandomItem;
    window.sortItems = sortItems;
    window.Expedition = Expedition;
  }
})();
