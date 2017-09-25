var bestBuild = [null, null, null, null, null, null, null, null, null, null];
var bestEsper = null;
var bestValue = 0;
var selectedEspers;

onmessage = function(e) {
    selectedEspers = e.data[3];
    findBestBuildForCombination(0,[null, null, null, null, null, null, null, null, null, null], e.data[0], e.data[1], e.data[2]);
    postMessage({"bestBuild":bestBuild, "bestEsper":bestEsper, "bestValue":bestValue});
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
                    if (canAddMoreOfThisItem(build, item, index)) {
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
        numberOfItemCombination++
        for (var esperIndex in selectedEspers) {
            value = calculateValue(build, selectedEspers[esperIndex]);
            if (value > bestValue) {
                bestBuild = build.slice();
                bestValue = value;
                bestEsper = selectedEspers[esperIndex];
                logBuild(bestBuild, bestEsper);
            }    
        }
    } else {
        findBestBuildForCombination(index + 1, build, typeCombination, dataWithConditionItems, fixedItems);
    }
}