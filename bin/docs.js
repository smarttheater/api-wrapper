// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, no-undef
var aglio = require('aglio');

var options = {
    filterInput: true, // Filter \r and \t from the input
    theme: 'default', // Theme name to load for rendering
    themeVariables: 'streak', // Built-in color scheme or path to LESS or CSS
    themeCondenseNav: true, // Condense single-action navigation links
    themeFullWidth: true, // Use the full page width
    themeTemplate: 'triple', // Layout name or path to custom layout file
    themeStyle: 'default' // Built-in style name or path to LESS or CSS
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
aglio.renderFile('./docs/src/pages/index.md', './docs/dist/index.html', options, function (err, html, warnings) {

    if (err) {
        // eslint-disable-next-line no-console, no-undef
        return console.log(err);
    }

    if (warnings) {

        // eslint-disable-next-line no-console, no-undef
        console.log(warnings);
    }
});
