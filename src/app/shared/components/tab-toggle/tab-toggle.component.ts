import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface TabToggle {
  key: string;  
  label: string; 
}

@Component({
  selector: 'app-tab-toggle',
  standalone: true,
  imports: [],
  templateUrl: './tab-toggle.component.html',
  styleUrl: './tab-toggle.component.scss'
})
export class TabToggleComponent implements OnInit {
 
  @Input() public tabs: TabToggle[] = [];
  @Input() public activeTabKey: string = '';
  @Output() public tabSelected = new EventEmitter<string>();

  
  public ngOnInit(): void {
    if (!this.activeTabKey && this.tabs.length > 0) {
      this.activeTabKey = this.tabs[0].key;
    }
  }

 
  public selectTab(tabKey: string): void {
    if (this.activeTabKey !== tabKey) {
      this.activeTabKey = tabKey;
      this.tabSelected.emit(this.activeTabKey);
    }
  }
}