import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  itemListUrl = '/assets/GL/data.json';

  itemList : BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);

  constructor(private http: HttpClient) {
    this.http.get<Array<Object>>(this.itemListUrl).subscribe(data => {
      this.prepareSearch(data);
      this.itemList.next(data)
    });
  }

  prepareSearch(data) {
    for (var index in data) {
      var item = data[index];
      var textToSearch = item["name"];

      if (item.jpname) {
        textToSearch += item["jpname"];
      }

      //textToSearch += "|" + getStatDetail(item);
      if (item["evade"]) {
        if (item.evade.physical) {
          textToSearch += "|" + "Evade physical " + item.evade.physical + "%";
        }
        if (item.evade.magical) {
          textToSearch += "|" + "Evade magical " + item.evade.magical + "%";
        }
      }
      if (item["resist"]) {
        for (var i = item["resist"].length; i--;) {
          textToSearch += "|" + item["resist"][i].name;
        }
      }
      if (item["ailments"]) {
        for (var i = item["ailments"].length; i--;) {
          textToSearch += "|" + item["ailments"][i].name;
        }
      }
      /*if (item["exclusiveUnits"]) {
        textToSearch += "|Only ";
        var first = true;
        $(item.exclusiveUnits).each(function(index, exclusiveUnitId) {
          if (units[exclusiveUnitId]) {
            if (first) {
              first = false;
            } else {
              textToSearch += ", ";
            }
            textToSearch += units[exclusiveUnitId].name;
          }
        });
      }*/
      if (item["exclusiveSex"]) {
        textToSearch += "|Only " + item["exclusiveSex"];
      }
      if (item["condition"]) {
        textToSearch += "|Only " + item["condition"];
      }
      if (item.mpRefresh) {
        textToSearch += "|Recover MP (" + item.mpRefresh + "%) per turn";
      }
      if (item["special"]) {
        for (var i = item["special"].length; i--;) {
          textToSearch += "|" + item["special"][i];
        }
      }
      if (item.singleWielding) {
        textToSearch += "|" + "Increase equipment ATK (" + item.singleWielding["atk"] + "%) when single wielding";
      }
      if (item.singleWieldingGL) {
        textToSearch += "|" + "Increase equipment ATK (" + item.singleWieldingGL["atk"] + "%) when single wielding";
      }
      if (item.killers) {
        for (var i = item["killers"].length; i--;) {
          textToSearch += "|" + item["killers"][i].name;
        }
      }

      if (item.jumpDamage) {
        textToSearch += "|" + "Increase damage dealt by jump attacks by "+ item.jumpDamage + "%";
      }
      if (item.lbFillRate) {
        textToSearch += "|" + "Increase LB gauge fill rate (" + item.lbFillRate + "%)";
      }
      if (item.lbPerTurn) {
        var value;
        if (item.lbPerTurn.min == item.lbPerTurn.max) {
          value = item.lbPerTurn.min;
        } else {
          value = item.lbPerTurn.min + "-" + item.lbPerTurn.max;
        }
        textToSearch += "|" + "Increase LB gauge each turn (" + value + ")";
      }
      if (item.evoMag) {
        textToSearch += "|" + "Increase Esper summon damage by "+ item.evoMag + "%";
      }
      /*if (item["tmrUnit"] && units[item["tmrUnit"]]) {
        textToSearch += "|" + units[item["tmrUnit"]].name;
      }
      if (item["stmrUnit"] && units[item["stmrUnit"]]) {
        textToSearch += "|" + units[item["stmrUnit"]].name;
      }*/
      for (var index in item.access) {
        textToSearch += "|" + item.access[index];
      }
      item.searchString = textToSearch;
    }
  }
}
