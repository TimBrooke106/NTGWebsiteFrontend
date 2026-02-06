import { Component } from '@angular/core';
import { Hero } from "./sections/hero/hero";
import { StatsStrip } from "./sections/stats-strip/stats-strip";
import { AboutPreview } from "./sections/about-preview/about-preview";
import { ServicesPreview } from "./sections/services-preview/services-preview";
import { CtaBanner } from "./sections/cta-banner/cta-banner";

@Component({
  selector: 'app-home',
  imports: [Hero, StatsStrip, AboutPreview, ServicesPreview, CtaBanner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
