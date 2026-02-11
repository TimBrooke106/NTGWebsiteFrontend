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
  @ViewChild('mainNav', { static: true }) mainNav!: ElementRef<HTMLElement>;

  go(path: string) {
    // full page load (like a refresh) to the new route
    window.location.href = path;
  }

  @ViewChild('navCollapse') navCollapse!: ElementRef;

  closeNavbar() {
    const el = this.navCollapse?.nativeElement;
    if (!el) return;

    // Bootstrap 5 collapse instance
    const bsCollapse = (window as any).bootstrap?.Collapse?.getOrCreateInstance(el);
    bsCollapse?.hide();
  }
}
