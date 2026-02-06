import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router";

@Component({
  selector: 'app-services-preview',
  imports: [RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './services-preview.html',
  styleUrl: './services-preview.css',
})
export class ServicesPreview {

}
