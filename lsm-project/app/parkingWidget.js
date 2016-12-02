var handlebars = require('handlebars'),
    fs = require('fs'),
    http = require('http'),
    request = require('request');

/*
 * ### general settings ####
 */
//directory name for download image from server and compile the HTML template
var directory = '/Users/marcodefelice/Documents/workspace/test/';
//if present: download an image from server ELSE set default name
var imageName = Date.now() + '.png';
var topImageName = 'white.png';
var templateName = 'template.html';
var compiledTemplate = 'template.html';
var options = {
    hostname: 'localmachine.it',
    path: '/model.json',
    port: 80,
    method: 'GET',
    json: true
};
/*
 * ### end general settings ####
 */

//Download image from server and not from client
var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

var req = http.request(options, function (res) {

    //start calling JSON form server
    res.setEncoding('utf8');
    res.on('data', function (result) {
        try {
            var data = JSON.parse(result);
            //overrite image name
            var imageUrl = data.vendor.map;
            if (imageUrl) {
                download(imageUrl, directory + imageName, function () {
                    console.log("Downloade from " + imageUrl + " image: done");
                    console.log("Image name " + directory + imageName + ": done");
                });
            } else {
                imageName = topImageName;
            }

            // loop into Parkings arrays for set correct message
            // indoorSpace 		 -- outdoorSpace
            // insuranceIncluded -- insuranceExcluded
            data.parkings.forEach(function (i) {
                var indoor = i.indoor;
                var indoorSpace = data.dictionary.indoorSpace;
                var outdoorSpace = data.dictionary.outdoorSpace;

                var insurance = i.insurance;
                var insuranceIncluded = data.dictionary.insuranceIncluded;
                var insuranceExcluded = data.dictionary.insuranceExcluded;

                //setting up the correct message
                i.indoor = indoor ? indoorSpace : outdoorSpace;
                i.insurance = insurance ? insuranceIncluded : insuranceExcluded;

            })
            //if JSON parse is true, send complete : true
            data.complete = true;
            data.vendor.map = imageName;
            console.log("[LOG] - Parsing JSON complete: \n", data);
        } catch (e) {
            var data = {
                error: true,
                errorText: 'Si è verificato un errore, riprova più tardi'
            }
            console.log("[ERROR] - Error to parsing JSON: \n", e);
        }

        //read a handlebars template from directory
        fs.readFile(directory + templateName,
            'utf-8',
            function (error, source) {
                var template = handlebars.compile(source);
                var htmlCompiled = template(data);
                //compile the template in the same directory ?
                //TODO: change the directory if necessary
                fs.writeFile(directory + compiledTemplate,
                    htmlCompiled,
                    function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
            });
    });
});

req.on('error', function (e) {
    console.log('[ERROR] - problem with request: ' + e.message);
});

req.end();

			