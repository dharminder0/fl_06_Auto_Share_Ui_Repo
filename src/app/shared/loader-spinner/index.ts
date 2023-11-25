
import { NgModule, ModuleWithProviders } from '@angular/core';
import { LoaderSpinnerComponent } from './loader-spinner.component';
import { LoaderService } from './loader-spinner.service';


export * from './loader-spinner.service';
export * from './loader-spinner.component';

@NgModule({
  imports: [],
  declarations: [LoaderSpinnerComponent],
  exports: [LoaderSpinnerComponent],
  providers: [LoaderService]
})
export class LoaderSpinnerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LoaderSpinnerModule,
      providers: [LoaderService]
    };
  }
}
