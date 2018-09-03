const app = require("./application");

require("http").createServer(app).listen(
    (process.env.PORT || 80),
    () => console.log(`Приложение было запущено на ${process.env.PORT || 80} порту`)
);