# Setup project AWK PlayApp

**Download npm dependencies:**

```
npm install or yarn install
```

**Download only production npm dependencies:**

```
npm install --only=prod
```

**Run localhost server:**

```
npm start
```

**Run localhost server with "serve" package:**
**_Note: this allow you to test the app as a Progresive Web App_**

```
npm run dev-serve
```

**Generate documentation file:**

```
npm run doc
```

**Generate documentation file and open docs in linux**

```
npm run doc:linux
```

**Generate documentation file and open docs in windows**

```
npm run doc:windows
```

## Code tree explanation

```
src
    |
    assets
    |     |
    |     fonts - (fonts used in project)
    |     |
    |     images - (in root folder we found common images)
    |     |    |
    |     |    games - (specific images used in game)
    |     styles - (common styles used in project)
    components
    |         |
    |         games - (components used in route "games")
    |         |
    |         shared - (common components)
    context - (component used for save global state, and shared
    |           resource   through the app)
    routes - (routes defined for each game)
    |
    utils - (files to load images, and set data for game)

```
