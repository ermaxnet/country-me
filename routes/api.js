module.exports = function(router) {
    router.get("/", (req, res, next) => {
        res.json({ path: "api" });
    });
    return router;
};