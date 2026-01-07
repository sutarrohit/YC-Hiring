import fs from 'fs';
import path from 'path';

export function ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
}

export function saveToJson(data: any, filePath: string) {
    ensureDirectoryExistence(filePath);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function loadFromJson(filePath: string) {
    if (!fs.existsSync(filePath)) return null;
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content || content.trim() === '') return null;
        return JSON.parse(content);
    } catch (error) {
        console.warn(`Warning: Failed to parse JSON from ${filePath}. Returning null.`);
        return null;
    }
}
