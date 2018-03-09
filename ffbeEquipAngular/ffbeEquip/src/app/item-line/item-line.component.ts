import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item-line',
  templateUrl: './item-line.component.html',
  styleUrls: ['./item-line.component.css']
})
export class ItemLineComponent implements OnInit {

  @Input() item;

  constructor() { }

  ngOnInit() {
  }

}
