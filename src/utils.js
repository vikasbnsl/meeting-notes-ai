import path from 'path';
import os from 'os';

export const desktopPath = path.join(os.homedir(), 'Desktop');
export const wavPath = path.join(desktopPath, 'recording.wav');
export const transcriptPath = path.join(desktopPath, 'transcript.txt');
