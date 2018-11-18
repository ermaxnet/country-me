
class CountryApiException extends Error {
    constructor(message, code, innerError, request) {
        super(message);
        this.code = code;
        this.innerError = innerError;
        this.request = request;
    }
};

module.exports = CountryApiException;