import * as path from 'path';
import {spawnSync} from 'child_process';

const libraryPath = path.join(__dirname, 'cli.js');
console.log("libraryPath", libraryPath);

const result = spawnSync('node', [libraryPath, 'execute'], {stdio: ['pipe', 'pipe', 'pipe'], encoding: 'utf-8'});
console.log("result", result);

if (result.error) {
    console.error(`Error: ${result.error.message}`);
} else {
    console.log(`Result:\n${result.stdout}`);
}