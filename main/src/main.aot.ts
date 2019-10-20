import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from './app/app.module.ngfactory';

/**
 * Main file for run Angular application in AOT mode.
 */
enableProdMode();

platformBrowser()
        .bootstrapModuleFactory(AppModuleNgFactory);
