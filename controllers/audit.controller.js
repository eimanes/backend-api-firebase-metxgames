import { Storage } from '@google-cloud/storage';

const storage = new Storage();

const getHistory = async (req, res) => {
    try {
        const fileName = req.query.fileName;
        const file = storage.bucket(bucketName).file(fileName);
        const fileContents = await file.download();
        return res.status(200).send(fileContents[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
    
};

const updateHistory = async (req, res) => {
    try {
        // Retrieve the file contents from Cloud Storage
    const bucketName = 'your-bucket-name';
    const fileName = req.query.fileName;
    const file = storage.bucket(bucketName).file(fileName);
    const fileContents = await file.download();
  
    // Return the file contents
    return res.status(200).send(fileContents[0]);
        
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
    
};

export default {getHistory, updateHistory};
