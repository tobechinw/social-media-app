Author: Nwachukwu Tobechukwu

There was an issue with the code in the 'fomantic-ui-css/semantic.min.css' file. After doing 'npm install', open up the .css file and search for ';;'. There should be a match
and thereafter, remove one of the colons and it should run just fine.
I ran into some errors while trying to redirect the user to the homepage after logging in and figured it was because of an update in the react-router. This should be
fixed if you type in 'npm install react-router-dom@5.2.0' and 'npm install react-router@5.2.0', which downgrades the version of the react router.