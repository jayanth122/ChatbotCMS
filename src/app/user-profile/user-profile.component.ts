import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular'; 
import { Observable } from 'rxjs';
import { select } from '@ngrx/store';
import { selectUserDetails } from '../states/auth/auth.selector';
import { Store } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { setUserDetails } from '../states/auth/auth.action';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule, LucideAngularModule, AsyncPipe],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails$: Observable<any>;

  constructor(private authService: AuthService, private store: Store<AppState>) {
    this.userDetails$ = this.store.select(selectUserDetails);
  }

  ngOnInit() {
    this.authService.getUserInfo().subscribe(
      (response: any) => {
        this.store.dispatch(setUserDetails({ userDetails: response.data })); 
      },
      (error: any) => {
        console.error('Error retrieving user details:', error);
      }
    );
  }
}

