'use strict';

const azureStorage = require('azure-storage');

exports.uploadImage = async(container, image) => {
  
    filename = guid.raw().toString() + '.jpg';
    let rawdata = image;

    const blobService = azureStorage.createBlobService(config.containerConnectionString);

    let matches = rawdata.match('/^data:([A-Za-z-+\/]+);base64,(.+)$/');
    let type = matches[1];
    let buffer = new Buffer(matches[2], 'base64');

    await blobService.createBlockBlobFromText(container, filename, buffer, {
        contentType: type },
        function(error, result, response){
            if (error){
                filename = 'default-product.png'
            }
        });    

    return filename;
};
