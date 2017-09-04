import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SchedulerComponent} from './scheduler-main.component';

@NgModule({
    imports: [BrowserModule,FlexLayoutModule],
    declarations: [SchedulerComponent],
    exports: [SchedulerComponent],
    providers: []
})

export class SchedulerModule {
}
