import multer from 'multer';
import path from 'path';

const destination = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  destination,
  storage: multer.diskStorage({
    destination,
    filename(request, file, callback) {
      return callback(null, 'load.csv');
    },
  }),
};
