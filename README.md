CLIENT:\
Open Terminal:\
Change directory to client.\
npm i\
npm start

SERVER:\
Open new terminal:\
Change directory to server.\
npm i \
npm start

MONGODB:\
mongoose.connect(\
    "mongodb+srv://{name}:{password}@textadventurecluster.fpuqlbf.mongodb.net/TextAdventures?retryWrites=true&w=majority",\
    { useNewUrlParser: true, useUnifiedTopology: true }\
Make sure you include this full section "textadventurecluster.fpuqlbf.mongodb.net/TextAdventures?retryWrites=true&w=majority" or the db will not connect.\
Listening begins on port 3001.
