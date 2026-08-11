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
        if (hasMilestone('f',2) && !inChallenge('h', 12)) mult = mult.times(3)
        if (hasUpgrade('m',11)) mult = mult.times(5)
        if (hasUpgrade('m', 14)&& !inChallenge('h', 31)) mult = mult.times(upgradeEffect('m', 14));
        if (hasUpgrade('m', 24)&& !inChallenge('h', 31)) mult = mult.times(upgradeEffect('m', 24));
        if (hasChallenge('h', 11)) {
            mult = mult.pow(challengeEffect('h', 11))
        }
        if (hasUpgrade('m', 42)) mult = mult.times(upgradeEffect('m', 42));
        if (hasChallenge('h', 22)) {
            mult = mult.pow(challengeEffect('h', 22))
        };
        if (inChallenge('h', 31)) {
            mult = mult.pow(0.5)
        };
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration(){if (hasMilestone('f',4) && !hasMilestone('m',1)){
        return 0.01
    } else if(hasMilestone('m',1)){
        return 1
    }
    return 0},
    row: 0, // Row the layer is in on the tree (0 is the first row)

    autoUpgrade(){
        return hasMilestone('m', 2)
    },

    doReset(resettingLayer) {
        let keep = [];

        if(hasMilestone('p',1)) keep.push("upgrades");

        if(layers[resettingLayer].row > this.row) {
            layerDataReset("w",keep)
        }
    },
    
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
                let eff = player[this.layer].points.add(1).pow(0.5);
                eff = softcap(eff,new Decimal(1000),0.4)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("w", 12) },
        },

        14: {
            title: "Spicy flies!",
            description: "flies eaten boost wings eaten",
            cost: new Decimal(10),
            effect() {
                let eff = player.points.add(1).pow(0.15);
                eff = softcap(eff,new Decimal(1000),0.4);
                return eff
            },

            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("w", 13) },
        },

        21: {
            title: "Fried flies!",
            description: "Double your wings eaten.",
            cost: new Decimal(15),
            unlocked() { return hasUpgrade("w", 14) },
        },

        22: {
            title: "Boiled flies!",
            description: "Triple your flies eaten.",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade("w", 21) },
        },

        23: {
            title: "Stewed flies!",
            description: "Wings eaten boost flies eaten, again",
            cost: new Decimal(150),
            effect() {
                let eff = player[this.layer].points.add(1).pow(0.3);
                eff = softcap(eff,new Decimal(1000),0.4);
                return eff
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
    requires: new Decimal("1e5"), // Can be a function that takes requirement increases into account
    resource: "farms", // Name of prestige currency
    baseResource: "flies", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade("f", 13) && !inChallenge('h', 12)) {
            mult = mult.div(upgradeEffect("f", 13))
        }
        if (hasUpgrade("m", 23)) {
            mult = mult.div(upgradeEffect("m", 23))
        }
        if (hasUpgrade("m", 43)) {
            mult = mult.div(upgradeEffect("m", 43))
        }
        if (hasUpgrade("f", 15)) {
            mult = mult.div(upgradeEffect("f", 15))
        }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    canBuyMax() {
        return hasMilestone('m', 3)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    autoPrestige(){return hasChallenge('h', 12)},
    resetsNothing(){return hasChallenge('h', 12)},

    milestones : {
        1: {
            requirementDescription:"1 Fly Farm",
            effectDescription: "x4 Flies eaten",
            done() {return player.f.points.gte(1)}
        },
        2: {
            requirementDescription:"2 Fly Farm",
            effectDescription: "x3 Wings",
            done() {return player.f.points.gte(2)},
            unlocked() { return hasMilestone("f",1) },
        },
        3: {
            requirementDescription:"4 Fly Farm",
            effectDescription: "Unlock Poop. A good source of food for flies",
            done() {return player.f.points.gte(4)},
            unlocked() { return hasMilestone("f",2) },
        },
        4: {
            requirementDescription:"5 Fly Farm",
            effectDescription: "Generate 1% of wings you would gain on tearing flies",
            done() {return player.f.points.gte(5)},
            unlocked() { return hasMilestone("f",3) },
        },
        5: {
            requirementDescription:"10 Fly Farm",
            effectDescription: "Unlock Metabolism reset",
            done() {return player.f.points.gte(10)},
            unlocked() { return hasUpgrade("f",13) },
        },
    },
    doReset(resettingLayer) {
        let keep = [];

        if(hasMilestone('m',5)) keep.push("upgrades");
        if(hasMilestone('m',5)) keep.push("milestones");

        if(layers[resettingLayer].row > this.row) {
            layerDataReset("f",keep)
        }
    },

    upgrades: {
        11:{
            title: "Flies superfood",
            description: "Fly Farms boost flies eaten",
            effect() {
                return player.f.points.add(1).pow(3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            cost: new Decimal(6),
            unlocked() { return hasMilestone("f",4) },
        },
        12:{
            title: "More nutrious Poop",
            description: "Farms boost Poop",
            effect() {
                return player.f.points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            cost: new Decimal(7),
            unlocked() { return hasUpgrade("f",11) },
        },
        13:{
            title: "Flies make it cheap",
            description: "Flies reduce fly farms requirement",
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { return "/" + format(upgradeEffect(this.layer, this.id))+"x" }, 
            cost: new Decimal(8),
            unlocked() { return hasUpgrade("f",12) },
        },
        14:{
            title: "You missed them",
            description: "Farms Boost Flies",
            effect() {
                return player.f.points.add(1).pow(10)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            cost: new Decimal(39),
            unlocked() { return hasUpgrade("m",51) },
        },
        15:{
            title: "Farming in habitats",
            description: "Habitats reduce requirement of farms",
            effect() {
                return player.h.points.add(1).pow(35)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            cost: new Decimal(42),
            unlocked() { return hasUpgrade("f",14) },
        },
        21:{
            title: "Breeding Flies",
            description: "Flies boost itself",
            effect() {
                return player.points.add(1).pow(0.03)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            cost: new Decimal(44),
            unlocked() { return hasUpgrade("f",15) },
        },
        22:{
            title: "Fly selection",
            description: "Flies boost poop",
            effect() {
                return player.points.add(1).pow(0.02)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            cost: new Decimal(47),
            unlocked() { return hasUpgrade("f",21) },
        },
    },
    hotkeys: [
        {key: "f", description: "f: Make a fly farm", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.w.unlocked},
})

addLayer("p", {
    name: "poop", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#351e00",
    requires: new Decimal("1e4"), // Can be a function that takes requirement increases into account
    resource: "poop", // Name of prestige currency
    baseResource: "wings", // Name of resource prestige is based on
    baseAmount() {return player.w.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.3, // Prestige currency exponent
    branches: ["w"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        if (hasUpgrade('f', 12) && !inChallenge('h', 12)) mult = mult.times(upgradeEffect("f",12));
        if (hasUpgrade('m', 13)&& !inChallenge('h', 31)) mult = mult.times(upgradeEffect("m",13));
        if (hasUpgrade('m', 11)) mult = mult.times(2);
        if (hasUpgrade('m', 22)) mult = mult.times(5);
        if (hasUpgrade('m', 24)) mult = mult.times(upgradeEffect("m",24));
        if (hasChallenge('h', 21)) mult = mult.pow(1.02);
        if (hasUpgrade('f', 22)) mult = mult.times(upgradeEffect("f",22));
        if (inChallenge('h', 31)) {
            mult = mult.pow(0.5)
        };
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        if(!inChallenge('h', 21) && !inChallenge('h',41)){
            return player.p.points.add(1).pow(0.9)
        }
		
	},
	effectDescription() {
        if(!inChallenge('h', 21) && !inChallenge('h',41)){
            return "which are boosting flies eaten by "+format(tmp.p.effect) + "x"
        } else {
            if(inChallenge('h', 21)) {
                return "Poop is useless in desert"
            } else if(inChallenge('h', 41)) {
                return "Poop is frozen in pole"
            }
            
        }
		
	},
    passiveGeneration(){return hasChallenge("h",21)},
    row: 1, // Row the layer is in on the tree (0 is the first row)

    milestones: {
        1: {
            requirementDescription:"200 Poop",
            effectDescription: "Keep Fly upgrades on Farm and Poop Reset",
            done() {return player.p.points.gte(200)},
        },
    },

    buyables: {
    11: {
        title: "Feed Flies",
        cost(x = getBuyableAmount(this.layer, this.id)) {
            return new Decimal(100).mul(Decimal.pow(1.8, x))
        },
        purchaseLimit: 100,
        effect(x = getBuyableAmount(this.layer, this.id)) {
            return Decimal.pow(2, x)
        },
        display() {
            return `Cost: ${format(this.cost())}\nBought: ${getBuyableAmount(this.layer, this.id)}/100\nEffect: ${format(this.effect())}x`
        },
        canAfford() {
            return player.p.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)
        },
        buy() {
            player.p.points = player.p.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        buyMax() {
            if (!this.canAfford()) return

            let current = getBuyableAmount(this.layer, this.id)
            let base = new Decimal(100)
            let growth = new Decimal(1.8)


            let maxAffordable = player.p.points.div(base).log(growth).add(1).floor()
            let targetLevel = Decimal.min(maxAffordable, this.purchaseLimit)

            if (targetLevel.gt(current)) {
                setBuyableAmount(this.layer, this.id, targetLevel)
            }
        }
}
    },
    update(diff) {
        if (hasMilestone('m', 4)) {
            if (layers.p.buyables[11].canAfford()) {
                layers.p.buyables[11].buyMax()
            }
        }
    },
    hotkeys: [
        {key: "p", description: "P: Poop to feed some flies", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasMilestone("f",3)}
})

addLayer("m", {
    name: "metabolism", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0)
    }},
    color: "#0eac00",
    requires: new Decimal("1e5"), // Can be a function that takes requirement increases into account
    resource: "enzymes", // Name of prestige currency
    baseResource: "poop", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.3, // Prestige currency exponent
    branches: ["f"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1);
        if(hasUpgrade("m", 21)) mult = mult.times(2);
        if(hasUpgrade('m', 31)) mult = mult.times(upgradeEffect("m",31));
        if(hasUpgrade('m', 33)) mult = mult.times(upgradeEffect("m",33));
        if(hasUpgrade('m', 34)) mult = mult.times(upgradeEffect("m",34));
        if (hasChallenge('h', 22)) {
            mult = mult.times(10)
        };
        if(hasUpgrade('m', 44)) mult = mult.times(upgradeEffect("m",44));
        if(hasChallenge('h', 32)) mult = mult.pow(1.01);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    // effect() {
	// 	return player.p.points.add(1).pow(0.9)
	// },
	// effectDescription() {
	// 	return "which are boosting flies eaten by "+format(tmp.p.effect) + "x"
	// },
    // passiveGeneration(){return hasMilestone("f",1)},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    passiveGeneration(){if (hasChallenge('h',31)){
        return 0.0001
    }
    return 0},

    addPoints(gain) {
        player.m.points = player.m.points.add(gain)
        player.m.total = player.m.total.add(gain)
    },

    milestones: {
        1: {
            requirementDescription:"1 Total Enzyme",
            effectDescription: "Gain 100% of wings on reset, You've been waiting for this",
            done() {return player.m.total.gte(1)},
        },
        2: {
            requirementDescription:"3 Total Enzyme",
            effectDescription: "Autobuy Wings upgrades",
            done() {return player.m.total.gte(3)},
            unlocked() { return hasMilestone("m",1) },
        },
        3: {
            requirementDescription:"5 Total Enzyme",
            effectDescription: "Buy Max Fly Farms",
            done() {return player.m.total.gte(5)},
            unlocked() { return hasMilestone("m",2) },
        },
        4: {
            requirementDescription:"25 Total Enzyme",
            effectDescription: "Autobuy Poop buyable",
            done() {return player.m.total.gte(25)},
            unlocked() { return hasMilestone("m",3) },
        },
        5: {
            requirementDescription:"400 Total Enzyme",
            effectDescription: "Keep Farms Milestones and upgrades on reset",
            done() {return player.m.total.gte(400)},
            unlocked() { return hasMilestone("m",4) },
        },
        6: {
            requirementDescription:"5e6 Total Enzyme",
            effectDescription: "You are ready to move on, Unlock habitats",
            done() {return player.m.total.gte(5e6)},
            unlocked() { return hasMilestone("m",5) },
        },
    },

    upgrades:{
        11: {
            title: "Protease",
            description: "10x Flies, 5x wings, 2x Poop",
            cost: new Decimal(1),
        },
        12: {
            title: "Amilase",
            description: "Total enzymes boost flies eaten",
            effect() {
                return player.m.total.add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("m", 11) },
        },
        13: {
            title: "Chitinase",
            description: "Total enzymes boost poop",
            effect() {
                return player.m.total.add(1).pow(0.4)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            cost: new Decimal(4),
            unlocked() { return hasUpgrade("m", 12) },
        },
        14: {
            title: "Lipase",
            description: "Total Enzymes boost wings",
            effect() {
                return player.m.total.add(1).pow(0.6)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            cost: new Decimal(8),
            unlocked() { return hasUpgrade("m", 13) },
        },
        21: {
            title: "Pepsin",
            description: "2x Enzymes",
            cost: new Decimal(20),
            unlocked() { return hasUpgrade("m", 14) },
        },
        22: {
            title: "Lactase",
            description: "5x Poop",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade("m", 21) },
        },
        23: {
            title: "Trypsin",
            description: "Reduce Farm requirements based on enzymes",
            cost: new Decimal(200),
            effect() {
                return player.m.points.add(1).pow(0.4)
            },
            effectDisplay() { return "/" + format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("m", 22) },
        },
        24: {
            title: "Sucrase",
            description: "Poop boosts wings",
            cost: new Decimal(1000),
            effect() {
                return player.p.points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("m", 23) },
        },
        31: {
            title: "Papain",
            description: "Farms Boost enzymes",
            cost: new Decimal("1e4"),
            effect() {
                return player.f.points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("m", 24) },
        },
        32: {
            title: "Bromelaine",
            description: "Habitats Boost Flies Greatly",
            cost: new Decimal("1e9"),
            effect() {
                return player.h.points.pow(20)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasChallenge("h", 12) },
        },
        33: {
            title: "I ran out of Enzymes names",
            description: "Enzymes boost itself",
            cost: new Decimal("1e10"),
            effect() {
                return player.m.points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("m", 32) },
        },
        34: {
            title: "Prolactine",
            description: "Flies boost enzyme on a reduced rate",
            cost: new Decimal("3e12"),
            effect() {
                return player.points.add(1).pow(0.01)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("m", 33) },
        },
        41: {
            title: "Testostorone",
            description: "Wings Boost itself on a reduced rate",
            cost: new Decimal("2e15"),
            effect() {
                return player.w.points.add(1).pow(0.05)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("m", 34) },
        },
        42: {
            title: "Cortisol",
            description: "Habitats Boost Wings",
            cost: new Decimal("5e18"),
            effect() {
                return player.h.points.add(1).pow(15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("m", 41) },
        },
        43: {
            title: "Adrenaline",
            description: "Flies reduce Farm requirement again",
            cost: new Decimal("1e22"),
            effect() {
                return player.points.add(1).pow(0.03)
            },
            effectDisplay() { return "/" + format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return hasUpgrade("m", 42) },
        },
        44: {
            title: "Noradrenaline",
            description: "Flies Boost enzymes gain",
            cost: new Decimal("1e30"),
            effect() {
                return player.points.add(1).log10()
            },
            effectDisplay() { return player.points.add(1).log10()+"x" }, 
            unlocked() { return hasUpgrade("m", 43) },
        },
        51: {
            title: "Estrogen",
            description: "Unlock a new set of Farm Upgrades",
            cost: new Decimal("1e40"),
            unlocked() { return hasUpgrade("m", 44) },
        },
        
    },


    hotkeys: [
        {key: "m", description: "M: Digest your flies for enzymes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasMilestone('f', 5) || player.m.total.gte(1)},
})

addLayer("h", {
    name: "habitat", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#8d6c00",
    requires: new Decimal("1e70"), // Can be a function that takes requirement increases into account
    resource: "habitats", // Name of prestige currency
    baseResource: "wings", // Name of resource prestige is based on
    baseAmount() {return player.w.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    base:5e15,
    branches: ["f","p"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    // effect() {
	// 	return player.p.points.add(1).pow(0.9)
	// },
	// effectDescription() {
	// 	return "which are boosting flies eaten by "+format(tmp.p.effect) + "x"
	// },
    // passiveGeneration(){return hasMilestone("f",1)},
    row: 2, // Row the layer is in on the tree (0 is the first row)

    milestones: {
        1: {
            requirementDescription:"1 Habitat",
            effectDescription: "Unlock Temperate Forest Challenge",
            done() {return player.h.points.gte(1)},
        },
        2: {
            requirementDescription:"2 Habitats",
            effectDescription: "Unlock Steppe Challenge",
            done() {return player.h.points.gte(2)},
            unlocked() { return player.h.points.gte(1) },
        },
        3: {
            requirementDescription:"3 Habitats",
            effectDescription: "Unlock Desert Challenge",
            done() {return player.h.points.gte(3)},
            unlocked() { return player.h.points.gte(2) },
        },
        4: {
            requirementDescription:"4 Habitats",
            effectDescription: "Unlock Rainforest Challenge",
            done() {return player.h.points.gte(4)},
            unlocked() { return player.h.points.gte(3) },
        },
        5: {
            requirementDescription:"5 Habitats",
            effectDescription: "Unlock Tundra Challenge",
            done() {return player.h.points.gte(5)},
            unlocked() { return player.h.points.gte(4) },
        },
        6: {
            requirementDescription:"6 Habitats",
            effectDescription: "Unlock Death Valley Challenge",
            done() {return player.h.points.gte(6)},
            unlocked() { return player.h.points.gte(5) },
        },
        7: {
            requirementDescription:"7 Habitats",
            effectDescription: "Unlock Pole Challenge, this one will be very hard",
            done() {return player.h.points.gte(7)},
            unlocked() { return player.h.points.gte(6) },
        },
        // 8: {
        //     requirementDescription:"9 Habitats",
        //     effectDescription: "Unlock Volcano Challenge, ",
        //     done() {return player.h.points.gte(9)},
        //     unlocked() { return player.h.points.gte(7) },
        // },
    },

    challenges: {
        11: {
            name: "Temperate Forest",
            challengeDescription: "The mild climate dampens wing speed. Fly eating is raised to ^0.75.",
            unlocked() { return player.h.points.gte(1) },
            goalDescription: "Reach 1e38 Wings",
            canComplete() { return player.w.points.gte(1e38) },
            rewardDescription: "^1.01 Flies and Wings",
            rewardEffect() { return new Decimal(1.01) },
        },
        12: {
            name: "Steppe",
            challengeDescription: "Strong winds sweep away fly farm productivity. Fly Farms are useless",
            unlocked() { return player.h.points.gte(2) },
            goalDescription: "Reach 1e85 Wings",
            canComplete() { return player.w.points.gte("1e85") },
            rewardDescription: "Unlocks new Metabolism Upgrades and Automate Fly Farms and they reset nothing",
        },
        21: {
            name: "Desert",
            challengeDescription: "Extreme heat depletes resources. Poop is useless",
            unlocked() { return player.h.points.gte(3) },
            goalDescription: "Reach 1e84 Wings",
            canComplete() { return player.w.points.gte("1e84") },
            rewardDescription: "Generate 100% of poop on reset and ^1.02 poop",
        },
        22: {
            name: "Rainforest",
            challengeDescription: "Dense foliage hampers movement. Flies eaten is square rooted",
            unlocked() { return player.h.points.gte(4) },
            goalDescription: "Reach 1e75 Wings",
            canComplete() { return player.w.points.gte(1e75) },
            rewardDescription: "^1.03 Flies,Wings, 10x Enzymes",
            rewardEffect() { return new Decimal(1.03) },
        },
        31: {
            name: "Tundra",
            challengeDescription: "Freezing temperatures slow biological activity. ^0.5 Flies,Poop,Wings Enzyme upgrades 12,13,14,24 Do not work",
            unlocked() { return player.h.points.gte(5) },
            goalDescription: "Reach 1e22 Wings",
            canComplete() { return player.w.points.gte(1e22) },
            rewardDescription: "Passively generates 0.01% of Enzyme per second.",
        },
        32: {
            name: "Death Valley",
            challengeDescription: "Scorching, barren, and unforgiving. Flies ^0.1 and poop buyable is disabled.",
            unlocked() { return player.h.points.gte(6) },
            goalDescription: "Reach 1e17 Flies",
            canComplete() { return player.points.gte(1e17) },
            rewardDescription: "^1.01 Enzymes",
        },
        41: {
            name: "Pole",
            challengeDescription: "Sub-zero blizzard freeze poop and wings making them useless. Poop and Wings are useless also flies are ^0.2",
            unlocked() { return player.h.points.gte(7) },
            goalDescription: "Reach 1e80 Wings",
            canComplete() { return player.w.points.gte(1e80) },
            rewardDescription: "Unlock Varieties of Flies ENDGAME!",
        },
    },


    hotkeys: [
        {key: "h", description: "H: Move to another habitat", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasMilestone('m', 6) || player.h.points.gte(1)},
})

// addLayer("v", {
//     name: "Varieties",
//     symbol: "V",
//     row: 2,
//     type: "static",
//     branches: ["p"],
//     position:2,
//     color: "#DAA520",

//     resource: "Fly Varieties",
//     baseResource: "Fly Farms",
//     baseAmount() { return player.f.points },

//     // --- DOUBLE STATIC SCALING ---
//     requires: new Decimal(50),
//     base: 1.099,
//     exponent: 1,


//     startData() {
//         return {
//             unlocked: false,
//             points: new Decimal(0),
//         }
//     },

//     // Example unlock perks per Variety level
//     milestones: {
//         1: {
//             requirementDescription: "1 Variety: Fruit Fly",
//             done() { return player.v.points.gte(1) },
//             effectDescription: "bla bla blah",
//         },
//     },

//     effect() {
//         return Decimal.pow(4, player.v.points)
//     },
//     effectDescription() {
//         return `boosting Flies,Wings,Poop,Enzymes ${format(this.effect())}x.`
//     }
//     layerShown() {
//         return hasChallenge("h",41) || player.v.unlocked
//     },
// })