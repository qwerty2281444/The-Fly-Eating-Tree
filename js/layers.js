addLayer("w", {
    name: "wings", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#b8b8b8",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "wings", // Name of prestige currency
    baseResource: "flies", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('w', 14)) mult = mult.times(upgradeEffect('w', 14))
        if (hasUpgrade('w', 21)) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    
    upgrades: {
        11: {
            title: "Bit flies!",
            description: "Double your Flies eaten.",
            cost: new Decimal(1),
        },

        12: {
            title: "Salty flies!",
            description: "1.5x flies eaten",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("w", 11) },
        },

        13: {
            title: "Sweet flies!",
            description: "Wings eaten boost flies eaten",
            cost: new Decimal(5),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("w", 12) },
        },

        14: {
            title: "Spicy flies!",
            description: "flies eaten boost wings eaten",
            cost: new Decimal(10),
            effect() {
                return player.points.add(1).pow(0.15)
            },

            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("w", 13) },
        },

        21: {
            title: "Fried flies!",
            description: "Double your wings eaten.",
            cost: new Decimal(30),
            unlocked() { return hasUpgrade("w", 14) },
        },

        22: {
            title: "Boiled flies!",
            description: "Triple your flies eaten.",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("w", 21) },
        },

        23: {
            title: "Stewed flies!",
            description: "Wings eaten boost flies eaten, again",
            cost: new Decimal(150),
            effect() {
                return player[this.layer].points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("w", 22) },
        },

        24: {
            title: "Roasted flies!",
            description: "Flies eaten boost flies eaten, again",
            cost: new Decimal(1000),
            effect() {
                return player.points.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("w", 23) },
        },

        },
    hotkeys: [
        {key: "w", description: "W: Tear flies for wings", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})

addLayer("f", {
    name: "farms", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#52432eff",
    branches: ["w"],
    requires: new Decimal("1e10"), // Can be a function that takes requirement increases into account
    resource: "farms", // Name of prestige currency
    baseResource: "flies", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
	effect() {
		return Decimal.pow();
	},
	effectDescription() {
		return "which are boosting flys eaaten "+format(tmp.f.effect) + "x"
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    
    upgrades: {
        11: {
            title: "Bit flies!",
            description: "Double your Flies eaten.",
            cost: new Decimal(1),
        },
        },
    hotkeys: [
        {key: "f", description: "f: Make a fly farm", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.w.unlocked}
})
