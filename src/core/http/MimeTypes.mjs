/** MIME_TYPE_TABLE
 *
 * @ref https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
const MIME_TYPE_TABLE = {
    'bmp': 'image/bmp',
    'css': 'text/css',
    'csv': 'text/csv',
    'htm': 'text/html',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'glsl': 'text/plain',
    'gif': 'image/gif',
    'jpe': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'application/x-javascript',
    'json': 'application/json',
    'mjs': 'application/x-javascript',
    'mp3': 'audio/mpeg3',
    'ogg': 'audio/ogg',
    'pdf': 'application/pdf',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'text': 'text/plain',
    'tgz': 'application/x-compressed',
    'ttf': 'font/ttf',
    'tif': 'image/tiff',
    'tiff': 'image/tiff',
    'wasm': 'application/wasm',
    'wav': 'audio/wav', // 'audio/x-wav',
    'weba': 'audio/webm',
    'webm': 'video/webm',
    'webp': 'image/webp',
    'xml': 'application/xml', // 'text/xml',
    'zip': 'application/x-compressed'
};

/** MimeTypes
 *
 */
export class MimeTypes {

    /** getContentType
     *
     *	@param {String} input
     *	@param {Boolean} charsetUtf8
     */
    static getContentType(input, charsetUtf8 = false) {

        const extent = input.split('.').pop();

        let output = 'application/octet-stream';

        if (extent in MIME_TYPE_TABLE)
            output = MIME_TYPE_TABLE[extent];

        if (charsetUtf8)
            output += '; charset=UTF-8';

        return output;

    }

}
