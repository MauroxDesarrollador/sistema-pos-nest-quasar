
const crypto = require('crypto');

async function parserPassword(password) {
    return await crypto.createHash('md5').update(password).digest('hex');
}
export {
    parserPassword
};