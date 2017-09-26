var weaponList = ["dagger", "sword", "greatSword", "katana", "staff", "rod", "bow", "axe", "hammer", "spear", "harp", "whip", "throwing", "gun", "mace", "fist"];

var bestBuild = [null, null, null, null, null, null, null, null, null, null];
var bestEsper = null;
var bestValue = 0;
var selectedEspers;
var itemInventory;
var statToMaximize;
var selectedUnit;
var ennemyRaces;
var ennemyResist;
var innateElements;
var onlyUseOwnedItems = true;

onmessage = function(e) {
    if (e.data[0] == "init") {
        selectedEspers = e.data[1];
        itemInventory = e.data[2];
        statToMaximize = e.data[3];
        selectedUnit = e.data[4];
        ennemyRaces = e.data[5];
        ennemyResist = e.data[6];
        innateElements = e.data[7];    
    } else {
        bestValue = 0;
        findBestBuildForCombination(0,[null, null, null, null, null, null, null, null, null, null], e.data[1], e.data[2], e.data[3]);
        postMessage({"bestBuild":bestBuild, "bestEsper":bestEsper, "bestValue":bestValue,"index":e.data[4]});
    }
}

function findBestBuildForCombination(index, build, typeCombination, dataWithConditionItems, fixedItems) {
    if (fixedItems[index]) {
        tryItem(index, build, typeCombination, dataWithConditionItems, fixedItems[index], fixedItems);
    } else {
        if (index == 1 && isTwoHanded(build[0])) {
            build[index] == null;
            findBestBuildForCombination(index + 1, build, typeCombination, dataWithConditionItems, fixedItems);    
        } else {
            if (typeCombination[index]  && dataWithConditionItems[typeCombination[index]].length > 0) {
                var foundAnItem = false;
                for (var itemIndex in dataWithConditionItems[typeCombination[index]]) {
                    var item = dataWithConditionItems[typeCombination[index]][itemIndex];
                    if (canAddMoreOfThisItem(build, item, index, fixedItems)) {
                        if (index == 1 && isTwoHanded(item)) {
                            continue;
                        }
                        tryItem(index, build, typeCombination, dataWithConditionItems, item, fixedItems);
                        foundAnItem = true;
                    }
                }
                if (!foundAnItem) {
                    tryItem(index, build, typeCombination, dataWithConditionItems, null, fixedItems);
                }
                build[index] == null;
            } else {
                findBestBuildForCombination(index + 1, build, typeCombination, dataWithConditionItems, fixedItems);
            }
        }
    }
}

function tryItem(index, build, typeCombination, dataWithConditionItems, item, fixedItems) {
    build[index] = item;
    if (index == 9) {
        for (var esperIndex in selectedEspers) {
            value = calculateValue(build, selectedEspers[esperIndex]);
            if (value > bestValue) {
                bestBuild = build.slice();
                bestValue = value;
                bestEsper = selectedEspers[esperIndex];
            }    
        }
    } else {
        findBestBuildForCombination(index + 1, build, typeCombination, dataWithConditionItems, fixedItems);
    }
}

function canAddMoreOfThisItem(build, item, currentIndex, fixedItems) {
    var number = 0;
    for (var index = 0; index < currentIndex; index++) {
        if (build[index] && build[index].name == item.name) {
            if (!isStackable(item)) {
                return false;
            }
            number++;
        }
    }
    for (var index = currentIndex + 1; index < 10; index++) {
        if (fixedItems[index] && fixedItems[index].name == item.name) {
            if (!isStackable(item)) {
                return false;
            }
            number++;
        }
    }
    return getOwnedNumber(item) > number;
}

function isStackable(item) {
    return !(item.special && item.special.includes("notStackable"));
}

function isTwoHanded(item) {
    return (item.special && item.special.includes("twoHanded"));
}

function getOwnedNumber(item) {
    if (onlyUseOwnedItems) {
        if (itemInventory[item.name]) {
            return itemInventory[item.name];
        } else {
            return 0;
        }
    } else {
        return 4;
    }
}

function calculateValue(equiped, esper) {
    if ("atk" == statToMaximize) {
        var calculatedValues = calculateStatValue(equiped, esper);
        
        var cumulatedKiller = 0;
        var itemAndPassives = equiped.concat(selectedUnit.skills);
        if (esper != null) {
            itemAndPassives.push(esper);
        }
        for (var equipedIndex in itemAndPassives) {
            if (itemAndPassives[equipedIndex] && (areConditionOK(itemAndPassives[equipedIndex], equiped))) {
                if (ennemyRaces.length > 0 && itemAndPassives[equipedIndex].killers) {
                    for (var killerIndex in itemAndPassives[equipedIndex].killers) {
                        if (ennemyRaces.includes(itemAndPassives[equipedIndex].killers[killerIndex].name)) {
                            cumulatedKiller += itemAndPassives[equipedIndex].killers[killerIndex].physical;
                        }
                    }
                }
            }
        }
        
        // Element weakness/resistance
        var elements = innateElements.slice();
        if (equiped[0] && equiped[0].element && !elements.includes(equiped[0].element)) {
            elements.push(equiped[0].element);
        };
        if (equiped[1] && equiped[1].element && !elements.includes(equiped[1].element)) {
            elements.push(equiped[1].element);
        };
        var resistModifier = 0;
        
        if (elements.length > 0) {
            for (var element in ennemyResist) {
                if (equiped[0] && equiped[0].element && equiped[0].element == element || equiped[1] && equiped[1].element && equiped[1].element == element) {
                    resistModifier += ennemyResist[element] / 100;
                }
            }    
            resistModifier = resistModifier / elements.length;
        }
        
        // Killers
        var killerMultiplicator = 1;
        if (ennemyRaces.length > 0) {
            killerMultiplicator += (cumulatedKiller / 100) / ennemyRaces.length;
        }
        var result = (calculatedValues.right * calculatedValues.right + calculatedValues.left * calculatedValues.left) * (1 - resistModifier) * killerMultiplicator;
    
        return result;
    }
}

function calculateStatValue(equiped, esper) {
    
    if ("atk" == statToMaximize) {
        var result = {"right":0,"left":0,"total":0}; 
        var calculatedValue = 0   
        var baseValue = selectedUnit.stats.maxStats[statToMaximize] + selectedUnit.stats.pots[statToMaximize];
        var calculatedValue = baseValue;
        var itemAndPassives = equiped.concat(selectedUnit.skills);
        var cumulatedKiller = 0;
        
        for (var equipedIndex = 2; equipedIndex < itemAndPassives.length; equipedIndex++) {
            calculatedValue += calculateStateValueForIndex(equiped, itemAndPassives, equipedIndex, baseValue);
        }
        if (esper != null) {
            calculatedValue += esper[statToMaximize] / 100;
        }
        var right = calculateStateValueForIndex(equiped, itemAndPassives, 0, baseValue);
        var left = calculateStateValueForIndex(equiped, itemAndPassives, 1, baseValue);
        if (equiped[1] && weaponList.includes(equiped[1].type)) {
            result.right = calculatedValue + right;
            result.left = calculatedValue + left;
            result.total = calculatedValue + right + left;    
        } else {
            result.right = calculatedValue + right + left;
            result.total = result.right;
        }
        return result;   
    }
}

function calculateStateValueForIndex(equiped, itemAndPassives, equipedIndex, baseValue) {
    var value = 0;
    if (itemAndPassives[equipedIndex] && (equipedIndex < 10 || areConditionOK(itemAndPassives[equipedIndex], equiped))) {
        if (itemAndPassives[equipedIndex][statToMaximize]) {
            value += itemAndPassives[equipedIndex][statToMaximize];
        }
        if (itemAndPassives[equipedIndex][statToMaximize + '%']) {
            value += itemAndPassives[equipedIndex][statToMaximize+'%'] * baseValue / 100;
        }
    }
    return value;
}

function areConditionOK(item, equiped) {
    if (item.equipedConditions) {
        var found = 0;
        for (var conditionIndex in item.equipedConditions) {
            for (var equipedIndex in equiped) {
                if (equiped[equipedIndex] && equiped[equipedIndex].type == item.equipedConditions[conditionIndex]) {
                    found ++;
                    break;
                }
            }
        }
        if (found != item.equipedConditions.length) {
            return false;
        }
    }
    return true;
}