//Importações
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, addCollection, QuerySnapshot } = require('firebase-admin/firestore');

const express = require('express');
const port = process.env.port || 3000;

//configuração do servidor
const app = express();
app.use(express.json());
app.use(express.urlencoded());


//configuração do firebase
const serviceAccont = require('./autonebriosapp-firebase-adminsdk-tqex8-c09beca051.json');

initializeApp({
    credential: cert(serviceAccont),
});

const db = getFirestore();


//Criando rotas
app.get('/', (req, res) =>{
    res.send('<h1>Server is running</h1>');
    console.log(`Server is running on a PORT ${port}`)
})
app.get('/data/esp', async (req, res) => {
    console.log('dentro da tela de get')
    const docRef = db.collection('criador').doc('caixas').collection('caixa01');

    var data = {
        nh3 : req.body.nh3,
        co2: req.body.co2,
        time: new Date()
    }
    docRef.add(data)
    res.send({
        nh3 : req.body.nh3,
        co2: req.body.co2,
        time: new Date(),
        status: 'POST data sukses!'
    })
});

app.post('/data', async (req, res) => {
    console.log('dentro da tela de post')
    const docRef = db.collection('criador').doc('caixas').collection('caixa01');

    var data = {
        nh3 : req.body.nh3,
        co2: req.body.co2,
        time: new Date()
    }
    docRef.add(data)
    res.send({
        nh3 : req.body.nh3,
        co2: req.body.co2,
        time: new Date(),
        status: 'POST data sukses!'
    })
});
app.listen(port, ()=>{
    console.log('Connected')
});



