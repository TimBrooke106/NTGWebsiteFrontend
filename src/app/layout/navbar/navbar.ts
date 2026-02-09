import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html'
})
export class navbar {
  @ViewChild('mainNavCollapse', { static: false }) mainNavCollapse?: ElementRef<HTMLElement>;

  constructor(private router: Router) {
    // Close menu on route change as well (covers back/forward, programmatic nav, etc.)
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.closeMobileMenu();
    });
  }

  closeMobileMenu() {
    const el = this.mainNavCollapse?.nativeElement;
    if (!el) return;

    // Only hide if currently shown
    if (el.classList.contains('show')) {
      const collapse = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
      collapse.hide();
    }
  }
}
