# Introduction 
Guide to creating an MFE workspace with a shell, remote and shared library
# References
1. [Module Federation with Angular](https://www.angulararchitects.io/aktuelles/the-microfrontend-revolution-part-2-module-federation-with-angular/)
1. [Dynamic Module Federation with Angular](https://www.angulararchitects.io/aktuelles/dynamic-module-federation-with-angular/)
1. [Building A Plugin-based Workflow Designer With Angular and Module Federation](https://www.angulararchitects.io/aktuelles/dynamic-module-federation-with-angular-2/)
1. [Angular Generate](https://angular.io/cli/generate)
1. [Angular Material](https://material.angular.io/guide/getting-started)
1. [Angular Workspace Shared Library](https://dev.to/pkdev/create-angular-apps-with-shared-library-2dl6)
1. [Shared Angular library without NPM](https://www.damirscorner.com/blog/posts/20220218-SharedAngularLibraryWithoutNpm.html)

# Ensure Angular CLI is installed
```console
npm install -g @angular/cli
```
# Workspace Structure

```console
ng new temel --no-create-application --directory ./
ng generate library temel-lib
ng generate application shell
? Would you like to add Angular routing? (y/N) Y
? Which stylesheet format would you like to use?
SCSS   [ https://sass-lang.com/documentation/syntax#scss                ]

ng generate application mfe1
? Would you like to add Angular routing? (y/N) Y
? Which stylesheet format would you like to use?
# SCSS   [ https://sass-lang.com/documentation/syntax#scss                ]

ng add @angular/material
# The package @angular/material@15.x.y will be installed and executed.
# Would you like to proceed? (Y/n) Y
? Choose a prebuilt theme name, or "custom" for a custom theme:
# Indigo/Pink        [ Preview: https://material.angular.io?theme=indigo-pink ]
? Set up global Angular Material typography styles? (y/N) Y
? Include the Angular animations module? (Use arrow keys)
# Include and enable animations
```

## Angular Material Modules

Create the following ts file at the root of the workspace
```ts
// ./material.modules.ts
import {NgModule} from '@angular/core';
import {A11yModule} from '@angular/cdk/a11y';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';
import {CdkMenuModule} from '@angular/cdk/menu';
import {DialogModule} from '@angular/cdk/dialog';

@NgModule({
  exports: [
    A11yModule,
    CdkAccordionModule,
    ClipboardModule,
    CdkMenuModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    DialogModule,
  ]
})
export class MaterialModules {}
```

Add the material modules to the app.module.ts for every project using material.

```ts

...
import { MaterialModules } from '../../../../material.module';
...

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    // material
    MaterialModules,
    ...
  ],
  providers: [
    ...
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


# Adding module federation

Ref 2: Activating Dynamic Module Federation for host Angular Projects 
```console
ng add @angular-architects/module-federation --project shell --port 4200 --type dynamic-host

# The package @angular-architects/module-federation@15.0.2 will be installed and executed.
# Would you like to proceed? (Y/n) Y
```

Ref 1: Activating Module Federation for remote Angular Projects 
```console
ng add @angular-architects/module-federation --project mfe1 --port 4201 --type remote

# The package @angular-architects/module-federation@15.0.2 will be installed and executed.
# Would you like to proceed? (Y/n) Y
```


Update package.json scripts (these are found in the articles supporting github repo)

From refs 1 and 8
```json 
  "scripts": {

    ...
    "postinstall": "npm --prefix ../temel-lib ci && ng build temel-lib",
    "prebuild": "ng build temel-lib",
    "watch:my-lib": "ng build temel-lib --watch --configuration development",
    "start:shell": "ng serve shell  -o --port 5000",
    "start:mfe1": "ng serve mfe1 -o --port 3000",
    "start:all": "concurrently \"npm run start:shell\" \"npm run start:mfe1\" ",
    "build:shell": "ng build shell --prod",
    "build:mfe1": "ng build mfe1 --prod",
    "serve:dist": "concurrently \"serve dist/shell -l 5000 -s\" \"serve dist/mfe1 -l 3000 -s\" ",

    ....
    },
```

## Using the lib

Ref 8.

Due to the following in tsconfig.ts the library is shared between the projects.

tsconfig.ts
```ts
{
  ....
  "compilerOptions": {
    ....
  "paths": {
    "temel-lib": [
      "dist/temel-lib"
    ]
  },

  ....
}
```


```ts
import { temelLibComponent } from 'temel-lib';
```

## Structure

create the following structure

```
workspace
|
|--projects
 |
 |--temel-lib
 | |--src
 |   |--services
 |   |--components
 |--shell
 | |--src
 |   |--app
 |     |--components
 |     |--pages
 |     |--router
 |--mfe1
 |     |--components
 |     |--pages
 |     |--router
```

## routers
move app-routing.module.ts in both shell and mfe1 to app/router

# Generating within Angular
Ref 
## components

ng generate component {path-in-project}/{component-name} --project={project-name}

Note: path-in-project is likely components/, layouts/ or pages/

## services
ng generate component {path-in-project}/{component-name} --project={project-name}

## scaffolding shell

```
ng generate component layouts/default-layout --project=shell
ng generate component pages/not-found-page --project=shell
ng generate component pages/login-page --project=shell
ng generate component pages/environment-page --project=shell
ng generate component pages/dashboard-page --project=shell
```

Add 
```ts
// projects/shell/src/app//router/app.routes.ts

import { Routes } from '@angular/router';
// Layouts
import { DefaultLayoutComponent } from '../layouts/default-layout/default-layout.component';
// Pages
import { DashboardPageComponent } from '../pages/dashboard-page/dashboard-page.component';
import { EnvironmentPageComponent } from '../pages/environment-page/environment-page.component';
import { NotFoundPageComponent } from '../pages/not-found-page/not-found-page.component';

// import { loadRemoteModule } from '@angular-architects/module-federation';

export const APP_ROUTES: Routes = [
    {
      path: '',
      component: DefaultLayoutComponent,
      children: [
        
        { path: 'environment', component: EnvironmentPageComponent, pathMatch: 'full' },
        { path: 'not-found', component: NotFoundPageComponent, pathMatch: 'full' }
      ]
    },
    {
        path: 'portal',
        component: DashboardPageComponent,
      },
    // Module federation importing from routes
    // {
    //   path: 'booking',
    //   loadChildren: () =
    //     loadRemoteModule({
    //       type: 'module',
    //       remoteEntry: 'http://localhost:4201/remoteEntry.js',
    //       exposedModule: './routes'
    //     })
    //     .then(m =m.MFE1_ROUTES)

    //     //import('mfe1/routes').then(m =m.MFE1_ROUTES)
    // },
    // Module federation matching component tot a route
    // {
    //   path: 'my-tickets',
    //   loadComponent: () =
    //     loadRemoteModule({
    //       type: 'module',
    //       remoteEntry: 'http://localhost:4201/remoteEntry.js',
    //       exposedModule: './Component'
    //     })
    //     .then(m =m.MyTicketsComponent)
    // },
    {
      path: '**',
      redirectTo: 'not-found'
    }

    // DO NOT insert routes after this one.
    // { path:'**', ...} needs to be the LAST one.

];

```

# Running the current state
At this point run the following to test the project works

terminal 1 (lib):
```
ng build temel-lib --prod // build production version of the library 
ng build temel-lib --watch // watch for any changes in library and build after changes are saved
```
Terminal 2 (mfe1):
```
ng serve mfe1 -o
```
Terminal 3 (shell):
```
ng serve shell -o
```

# Loading Remote Components (rather than routes)

In ./projects/shell/webpack.config.js within remotes: { } comment out mfe1

```js
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  remotes: {
    // omitted as we are going to pulling via standalone
    // "mfe1": "http://localhost:4200/remoteEntry.js",    
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});

```

## Adding Standalone components 

Look are Reference 2 and clone the repo to branch standalone-solution

```
git clone https://github.com/manfredsteyer/module-federation-plugin-example.git
git branch standalone-solution
```

### Look at:

#### MFE:
- mfe1/src/app/my-tickets
- mfe1/src/webpack.config
  ("./Component": "./projects/mfe1/src/app/my-tickets/my-tickets.component.ts",)

#### SHELL:
- shell/src/app/programmatic-loading

slight modification
```ts
import { loadRemoteModule } from '@angular-architects/module-federation';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-programmatic-loading',
  standalone: true,
  templateUrl: './programmatic-loading.component.html',
  styleUrls: ['./programmatic-loading.component.css']
})
export class ProgrammaticLoadingComponent implements OnInit {

  @ViewChild('placeHolder', { read: ViewContainerRef })
  viewContainer!: ViewContainerRef;

  constructor() {

   }

  ngOnInit(): void {
    this.load();
  }

  async load(): Promise<void{

      const m = await loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './Component'
      });
      
      const ref = this.viewContainer.createComponent(m.MyTicketsComponent);
      // const compInstance = ref.instance;
  }

}
```

## Starting the App
### Using ng cli
```
ng build temel-lib --prod // build production version of the library 
ng build temel-lib --watch // watch for any changes in library and build after changes are saved
ng serve mfe1 -o
ng serve shell -o
```

### using npm run
To just start a few applications, add their names as command line arguments:
```
npm run run:all shell mfe1
```
