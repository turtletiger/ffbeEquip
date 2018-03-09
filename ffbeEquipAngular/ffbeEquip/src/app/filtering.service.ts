import { Injectable } from '@angular/core';
import { Constants } from "./constants";

@Injectable()
export class FilteringService {

  constructor() { }

  filter(data, onlyShowOwnedItems = true, stat = "", baseStat = 0, searchText = "", selectedUnitId = null, types = [], elements = [], ailments = [], killers = [], accessToRemove = [], additionalStat = "", showNotReleasedYet = false, showItemsWithoutStat = false) : Array<Object> {
      var result = [];
      for (var index = 0, len = data.length; index < len; index++) {
        var item = data[index];
        //if (!onlyShowOwnedItems || itemInventory && itemInventory[item.id]) {
          if (showNotReleasedYet || !item.access.includes("not released yet")) {
            if (types.length == 0 || types.includes(item.type)) {
              if (elements.length == 0 || (item.element && this.matches(elements, item.element)) || (elements.includes("noElement") && !item.element) || (item.resist && this.matches(elements, item.resist.map(function(resist){return resist.name;})))) {
                if (ailments.length == 0 || (item.ailments && this.matches(ailments, item.ailments.map(function(ailment){return ailment.name;}))) || (item.resist && this.matches(ailments, item.resist.map(function(res){return res.name;})))) {
                  if (killers.length == 0 || (item.killers && this.matches(killers, item.killers.map(function(killer){return killer.name;})))) {
                    if (accessToRemove.length == 0 || this.haveAuthorizedAccess(accessToRemove, item)) {
                      if (additionalStat.length == 0 || this.hasStat(additionalStat, item)) {
                        if (searchText.length == 0 || this.containsText(searchText, item)) {
                          //if (!selectedUnitId || !exclusiveForbidAccess(item, selectedUnitId)) {
                            if (stat.length == 0 || showItemsWithoutStat || this.hasStat(stat, item)) {
                              this.calculateValue(item, baseStat, stat, ailments, elements, killers);
                              result.push(item);
                            }
                          //}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        //}
      }
      return result;
  }

  matches(array1 : Array<Object>, array2: Array<Object>) : boolean {
    var match = false;
    for(var i = array1.length; i--;) {
      if (array2.includes(array1[i])) {
        match = true;
      }
    }
    return match;
  };

  private hasStat(stat, item) : boolean {
    return item[stat] || item[stat+'%'] || (stat == 'inflict' && (item.element || item.ailments || item.killers)) || (stat == 'resist' && item.resist);
  };

  private hasStats(additionalStat : Array<any>, item) {
    var match = true;
    for (var i = additionalStat.length; i--;) {
      if (!item[additionalStat[i]] && !item[additionalStat[i] + '%']) {
        match = false;
      }
    }
    return match;
  };

  private haveAuthorizedAccess(forbiddenAccessList, item) {
    var hasAccess = false;
    if (forbiddenAccessList.includes("unitExclusive") && item.exclusiveUnits) {
      return false;
    }
    for (var i = item.access.length; i--;) {
      hasAccess = hasAccess || this.isAccessAllowed(forbiddenAccessList, item.access[i]);
    }
    return hasAccess;
  };

  private isAccessAllowed = function(forbiddenAccessList, access) {
    var accessAllowed = true;
    for (var i = forbiddenAccessList.length; i--;) {
      var tokens = forbiddenAccessList[i].split('/');
      for (var j = tokens.length; j--;) {
        if (access.startsWith(tokens[j]) || access.endsWith(tokens[j])) {
          accessAllowed = false;
        }
      }
    }
    return accessAllowed;
  }

  private containsText = function(text, item) {
    var self = this;
    var result = true;
    text.split(" ").forEach(function (token) {
      result = result && item.searchString.match(new RegExp(self.escapeRegExp(token),'i'));
    });
    return result;
  };

  private escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  private calculateValue(item, baseStat, stat, ailments, elements, killers) {
    var calculatedValue = 0;
    if (item[stat] && stat != "evade") {
      calculatedValue = item[stat];
    }
    if (item[stat + '%']) {
      calculatedValue += item[stat+'%'] * baseStat / 100;
    }
    if (item[stat] && stat == "evade") {
      if (item.evade.physical) {
        calculatedValue = item.evade.physical;
      }
      if (item.evade.magical && item.evade.magical > calculatedValue) {
        calculatedValue = item.evade.magical;
      }
    }
    if (stat == 'inflict' && (item.ailments || item.killers)) {
      var maxValue = 0;
      for (var i = item.ailments.length; i--;) {
        if ((ailments.length == 0 || ailments.includes(item.ailments[i].name)) && item.ailments[i].percent > maxValue) {
          maxValue = item.ailments[i].percent;
        }
      }
      for (var i = item.killers.length; i--;) {
        if ((killers.length == 0 || killers.includes(item.killers[i].name))) {
          if (item.killers[i].physical > maxValue) {
            maxValue = item.killers[i].physical;
          }
          if (item.killers[i].magical > maxValue) {
            maxValue = item.killers[i].magical;
          }
        }
      }
      calculatedValue = maxValue;
    }
    if (stat == 'resist' && (item.resist)) {
      var maxValue = 0;
      for (var i = item.resist.length; i--;) {
        var res = item.resist[i];
        if (Constants.ailmentList.includes(res.name) && (ailments.length == 0 || ailments.includes(res.name)) && res.percent > maxValue) {
          maxValue = res.percent;
        }
        if (Constants.elementList.includes(res.name) && (elements.length == 0 || elements.includes(res.name)) && res.percent > maxValue) {
          maxValue = res.percent;
        }
      }
      calculatedValue = maxValue;
    }
    item['calculatedValue'] = calculatedValue;
  }
}
