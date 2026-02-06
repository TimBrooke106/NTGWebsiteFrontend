import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router";

@Component({
  selector: 'app-about-preview',
  imports: [RouterLinkActive,RouterLink, RouterModule],
  templateUrl: './about-preview.html',
  styleUrl: './about-preview.css',
})
export class AboutPreview {

}
