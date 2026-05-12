import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import type { Node, NvlOptions, Relationship } from "@neo4j-nvl/base";
import { NVL } from "@neo4j-nvl/base";
import {
  ZoomInteraction,
  PanInteraction,
} from "@neo4j-nvl/interaction-handlers";

@Component({
  selector: "app-root",
  templateUrl: "./app.html",
  standalone: true,
  imports: [],
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild("nvlContainer", { static: true })
  nvlContainer!: ElementRef<HTMLDivElement>;

  private nvl?: NVL;
  private zoom?: ZoomInteraction;
  private pan?: PanInteraction;

  ngAfterViewInit(): void {
    this.initializeNVL();
  }

  ngOnDestroy(): void {
    this.zoom?.destroy?.();
    this.pan?.destroy?.();
    this.nvl?.destroy?.();
  }

  private initializeNVL(): void {
    const container = this.nvlContainer.nativeElement;

    const nodes: Node[] = [
      { id: "0", caption: "graphs" },
      { id: "1", caption: "everywhere" },
    ];

    const relationships: Relationship[] = [
      { from: "0", to: "1", id: "0-1", caption: "are" },
    ];

    const options: NvlOptions = {
      initialZoom: 2.6,
      // disableWebWorkers: true
    };

    try {
      this.nvl = new NVL(container, nodes, relationships, options);
      this.zoom = new ZoomInteraction(this.nvl);
      this.pan = new PanInteraction(this.nvl);
    } catch (error) {
      console.error("Failed to initialize NVL:", error);
    }
  }
}
