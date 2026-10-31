import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-module-placeholder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss']
})
export class PlaceholderComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected readonly moduleTitle = signal<string>('HR Module');
  protected readonly moduleDescription = signal<string>('This enterprise module is part of the approved HRGenius blueprint.');
  protected readonly modulePhase = signal<string>('Phase 2');

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['title']) this.moduleTitle.set(data['title']);
      if (data['description']) this.moduleDescription.set(data['description']);
      if (data['phase']) this.modulePhase.set(data['phase']);
    });
  }
}
