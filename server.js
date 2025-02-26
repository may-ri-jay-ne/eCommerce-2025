// mongo project password c3dIQ9PtfHCsRRyr
// user url mongodb+srv://uzochukwufaustina:c3dIQ9PtfHCsRRyr@cluster2.xwqhl.mongodb.net/

const express = require('express');

const PORT = 2602;

const app = express();
app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`Server is listening to PORT: ${PORT}`)
})