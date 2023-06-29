import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.scss']
})
export class LanguageDropdownComponent {
  @ViewChild('dropdownMenu', {static: false}) dropdownMenu;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.hideDropdownMenu();
    }
  }

  language: string = 'es-ES';


  constructor(private elementRef: ElementRef, private renderer: Renderer2, public translate: TranslateService) {

  }

  useLanguage(language: string): void {
    this.translate.use(language);
    console.log(language);
  }

  toggleDropdownMenu() {
    if (this.dropdownMenu.nativeElement.classList.contains('show')) {
      this.hideDropdownMenu();
    } else {
      this.showDropdownMenu();
    }
  }

  showDropdownMenu() {
    this.renderer.addClass(this.dropdownMenu.nativeElement, 'show');
  }

  hideDropdownMenu() {
    this.renderer.removeClass(this.dropdownMenu.nativeElement, 'show');
  }
}
