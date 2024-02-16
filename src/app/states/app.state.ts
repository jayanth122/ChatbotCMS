import { CounterState } from "./counter/counter.reducer";
import { AuthState } from "./auth/auth.reducer";

export interface AppState {
    counter: CounterState,
    auth: AuthState
}