import {Component, OnInit, Output, EventEmitter, HostBinding} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {AppService} from '@services/app.service';
import {Observable} from "rxjs";
import {UiState} from "@/store/ui/state";
import {Store} from "@ngrx/store";
import {AppState} from "@/store/state";
import {ToggleControlSidebar, ToggleSidebarMenu} from '@/store/ui/actions';

const BASE_CLASSES = 'navbar-white navbar-light main-header navbar navbar-expand';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>();
  @HostBinding('class') classes: string = BASE_CLASSES;
  public ui: Observable<UiState>;
  public searchForm: FormGroup;

  constructor(private appService: AppService,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.classes = `${BASE_CLASSES} ${state.navbarVariant}`;
    });
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
  }

  logout() {
    this.appService.logout();
  }

  onToggleMenuSidebar() {
    this.store.dispatch(new ToggleSidebarMenu());
  }

  onToggleControlSidebar() {
    this.store.dispatch(new ToggleControlSidebar());
  }
}
