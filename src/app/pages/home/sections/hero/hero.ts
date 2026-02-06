import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {

}
