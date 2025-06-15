module.exports = (errorFunc) => {
    return (req, res, next) => {
        errorFunc(req, res, next).catch(next);
    };
};
