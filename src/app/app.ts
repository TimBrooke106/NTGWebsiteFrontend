import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Shell } from "./layout/shell/shell";

@Component({
  standalone: true,
  imports: [Shell],
  selector: 'app-root',
  template: '<app-shell></app-shell>',
})
export class App {}
