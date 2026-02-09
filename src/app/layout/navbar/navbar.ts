import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

declare const bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [RouterModule],
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('mainNavCollapse') mainNavCollapse!: ElementRef<HTMLElement>;
  private collapseInstance: any;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Create/get the Collapse instance
    this.collapseInstance = bootstrap.Collapse.getOrCreateInstance(
      this.mainNavCollapse.nativeElement,
      { toggle: false }
    );

    // Also close it on EVERY route change (super reliable)
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.closeMobileMenu());
  }

  closeMobileMenu(): void {
    if (!this.collapseInstance) return;

    // Only hide if it's currently shown
    if (this.mainNavCollapse?.nativeElement.classList.contains('show')) {
      this.collapseInstance.hide();
    }
  }
}
