# YoutubePlayer

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.2.

## Run the project

Create a docker image for the backend server:
```bash
cd ./backend
docker build . -t youtubeplayer-back
docker run -it --rm -p 8000:8000 youtubeplayer-back
```

Create a docker image for the frontend server:
```bash
cd ./frontend
docker build . -t youtubeplayer-front
docker run -it --rm -p 80:80 youtubeplayer-front
```

Open the app at [localhost:80](http://localhost:80).

## Frontend server

Change your directory to `frontend` to run the following commands.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Backend server

To run the backend server, go the `backend` directory and run `npm start`.

