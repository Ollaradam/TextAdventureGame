// server/server.js
const {MongoClient} = require('mongodb');
const fs = require('fs');

const Educator = require('./educator_model.mjs');
const userInput = {
    name: "testname",
    email: "testemail@email.com",
    password: "badpassword",
}
const educatorUser = new Educator(userInput);

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */

    const uri = fs.readFileSync('mongouri.txt', 'utf8');


    const client = new MongoClient(uri);
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Users");
        educatorUser.save()
            .then(function (models) {
                console.log(models);
            })
            .catch(function (err) {
                console.log(err);
            });
        dbo.collection("Educators").insertOne(educatorUser, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

main().catch(console.error);