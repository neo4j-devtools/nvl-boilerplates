import { Component, signal, AfterViewInit } from '@angular/core';
import type { Node, NvlOptions, Relationship } from "@neo4j-nvl/base";
import { NVL } from "@neo4j-nvl/base";
import {
  ZoomInteraction,
  PanInteraction,
} from "@neo4j-nvl/interaction-handlers";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: []
})
export class App implements AfterViewInit {
  protected readonly title = signal('vite');

  ngAfterViewInit(): void {
    const container = document.getElementById("nvl-container");
    const nodes: Node[] = [
      { id: "0", caption: "graphs" },
      { id: "1", caption: "everywhere" },
    ];
    const relationships: Relationship[] = [
      { from: "0", to: "1", id: "0-1", caption: "are" },
    ];
    const options: NvlOptions = { initialZoom: 2.6, disableWebWorkers: true };

    if (container) {
      const nvl = new NVL(container, nodes, relationships, options);
      const zoom = new ZoomInteraction(nvl);
      const pan = new PanInteraction(nvl);
    } else {
      console.error("Container element not found");
    }
  }
}
