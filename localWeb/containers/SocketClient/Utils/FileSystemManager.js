const fs = require('fs');

class FileSystemManager {

    constructor() {

    }

    readFile(file_path) {
        if (!fs.existsSync(file_path)) {
            console.log(file_path + " does not exist");
            return null;
        }
        else {
            var file_content = fs.readFileSync(file_path).toString();
            return file_content;
        }
    }

    writeFile(file_path, data) {
        console.log("Writing to : " + file_path);
        try {
            var writeStream = fs.createWriteStream(file_path);
            writeStream.write(data);
            writeStream.end();
        }
        catch(exception) {
            console.log("Error while writing to : " + file_path);
            console.log(exception);
        }
    }
}

exports.FileSystemManager = FileSystemManager;