module.exports = {
    HOST: "localhost",
       USER: "postgres",
       PASSWORD: "postgres",
       DB: "",
       dialect: "mysql",
       pool: {
           max: 10,
           min: 2,
           acquire: 30000,
           idle: 30000,
       },
  };
