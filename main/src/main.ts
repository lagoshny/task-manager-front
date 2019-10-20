import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import * as environment from './evironment';

if (environment.isProduction()) {
    enableProdMode();
}

platformBrowserDynamic()
        .bootstrapModule(AppModule);
