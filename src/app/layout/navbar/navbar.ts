import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Collapse } from 'bootstrap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  @ViewChild('navCollapse', { static: true }) navCollapse!: ElementRef<HTMLElement>;

  onNavItemClick() {
    // Only collapse on mobile (when toggler is visible)
    const togglerVisible = window.getComputedStyle(
      document.querySelector('.navbar-toggler') as HTMLElement
    ).display !== 'none';

    if (!togglerVisible) return;

    const bsCollapse = Collapse.getOrCreateInstance(this.navCollapse.nativeElement);
    bsCollapse.hide();
  }
}
