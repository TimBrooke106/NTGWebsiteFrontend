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

  closeNavbar() {
    // Only close if it's currently shown (mobile state)
    if (this.mainNav.nativeElement.classList.contains('show')) {
      const instance = Collapse.getOrCreateInstance(this.mainNav.nativeElement);
      instance.hide();
    }
  }
}
