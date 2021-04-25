import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get( "/filteredimage", async ( req, res ) => {
    
    // 1. validate the image_url query
    var image_url = req.query.image_url as string;
    console.log("IMAGE_URL: " + image_url);

    var isUrlValid = validateURL(image_url);

    if (isUrlValid) {

      // 2. call filterImageFromURL(image_url) to filter the image
      var image_path = await filterImageFromURL(image_url);

      var options = {
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      };

      // 3. send the resulting file in the response
      res.sendFile(image_path, options, function (err) {
        if (err) {
          res.status(400).send('ERROR 400: The image is not available or cannot be accessed.')
        } else {
          // 4. deletes any files on the server on finish of the response
          deleteLocalFiles([image_path]);          
        }
      });
    }
    else {
      res.status(404).send('ERROR 404: The URL could not be found.')
    }
  });

  function validateURL(pURL: string) {
    try {
      new URL(pURL);
    } catch (e) {
      console.error(e);
      return false;
    }
    
    return true;
  }
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();