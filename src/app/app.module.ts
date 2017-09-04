import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpModule} from '@angular/http';
import {AppContainerComponent} from './app-container/app-container.component';
import {SchedulerModule} from './scheduler-main/scheduler-main.module';
import {SchedulerAppRoutingModule} from './app.routing.module';

@NgModule({
    declarations: [
        AppContainerComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FlexLayoutModule,
        SchedulerModule,
        SchedulerAppRoutingModule,
    ],
    providers: [],
    bootstrap: [AppContainerComponent]
})
export class SchedulerAppModule {
}
