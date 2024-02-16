import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BotSelectionComponent } from '../bot-selection/bot-selection.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterModule, BotSelectionComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})
export class LayoutComponent {

}