import { join } from 'path';

/**
 * Convert file to base64 image file string.
 *
 * @param {Express.Multer.File} file - The file object.
 * @return {string} The image base64 string.
 */
export const convertFileToBase64 = (file: Express.Multer.File): string =>
  `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

/**
 * Get path with specific path name.
 * @param {string[]} paths - The specific path nam.
 * @returns {string} The path to file/folder
 */
export const pathJoin = (...paths: string[]): string => join(process.cwd(), ...paths);

/**
 * Return asset path.
 * @param {string[]} dirNames - The folder names.
 * @returns {string} The folder path in assets folder.
 */
export const getAssetPath = (...dirNames: string[]): string => pathJoin('assets', ...dirNames);

/**
 * Return image file path.
 * @param {string} fileName - The file name.
 * @returns {string} The specific image file in images asset folder.
 */
export const getImagesAssetPath = (fileName: string): string => getAssetPath('images', fileName);

/**
 * Return template file path.
 * @param {string} fileName - The file name.
 * @returns {string} The specific template file in templates asset folder.
 */
export const getMailTemplatesAssetPath = (fileName: string): string => getAssetPath('templates', fileName);
