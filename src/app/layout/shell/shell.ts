import { Component, NgZone } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { NavbarComponent } from '../navbar/navbar';
import { Footer } from '../footer/footer';
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, Footer],
  templateUrl: './shell.html',
  styleUrls: ['./shell.css'],
})
export class Shell {
  constructor(private router: Router, private zone: NgZone) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        // wait until Angular finishes rendering the new route
        this.zone.onStable.pipe(take(1)).subscribe(() => {
          // extra-safe: run after the browser paints
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            });
          });
        });
      });
  }
}
