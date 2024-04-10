import * as fs from 'fs';

export class FS {
	static deleteFile(filePath: string): void {
		if (fs.existsSync(filePath)) {
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error('Error deleting file:\n', err);
				} else {
					console.log('File deleted successfully.');
				}
			});
		}
	}
}