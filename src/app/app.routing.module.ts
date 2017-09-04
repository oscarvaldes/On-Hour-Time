import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SchedulerComponent} from './scheduler-main/scheduler-main.component';


const appRoutes: Routes = [
    {path: '', component: SchedulerComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class SchedulerAppRoutingModule {
}
