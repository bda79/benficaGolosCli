const ImageUtils = {
    validateImage: function(img) {
        const fileTypes = "jpeg|jpg|png|gif|svg";
        const fieldSize = 1024 * 1024;

        if (!img) {
            return "Invalid Image.";
        }
        else if (!img.name.match(/\.(jpeg|jpg|png|gif|svg)$/)) {
            return `Invalid Image extension! Must be (${fileTypes})`;
        }
        else if (!img.size > fieldSize) {
           return `Image is to big! Max (${fieldSize}).`
        }
        
        return null;
    },
    getImage: function(path) {
        const server = process.env.REACT_APP_SERVER;//'http://localhost:5000';
        return `${server}/${path}`;
    }

}

module.exports.ImageUtils = ImageUtils;