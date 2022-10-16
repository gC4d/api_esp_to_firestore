//Importações
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, addCollection, QuerySnapshot } = require('firebase-admin/firestore');

const dayjs = require('dayjs');
const express = require('express');
const port = process.env.port || 3000;
const moment = require('moment');
let today = dayjs();

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
// Envia por protocolo http no método post
app.post('/data', async (req, res) => {
    console.log('dentro da tela de post');

    var exist = true;
    var subcollection = String(req.body.id);

    const querySnapshot = await db.collection('criador').doc('caixas').collection(subcollection).limit(1).get();

    if(querySnapshot.empty){
        exist = false;
    }

    if(!exist){
        var index = {
            indexDoc: 0
        }
        const docRef = db.collection('criador').doc('caixas').collection(subcollection);
        docRef.doc("indexDoc").set(index);

        exist = true;
    }
    if(exist){
        //Pegando o valor do index para poder atribuir no novo documento
        const indexes = await db.collection('criador').doc('caixas').collection(subcollection).doc("indexDoc").get();
        var nIndex = {};
        nIndex = indexes.data();

        var xIndex = nIndex['indexDoc'] + 1; //Incrementando o valor do index

        //console.log(nIndex['indexDoc']);

        //Dando update no novo valor do index para que possa ser coletado novamente
        const indeRef = await db.collection('criador').doc('caixas').collection(subcollection).doc("indexDoc").update({
            "indexDoc": xIndex
        })


        const docRef = db.collection('criador').doc('caixas').collection(subcollection);
        var time = new Date().toLocaleDateString().replace('/','-').replace('/','-');
        console.log(time.toString());
        var data = {
            nh3 : req.body.nh3,
            co2: req.body.co2,
            index: xIndex,
            time: time.toString(),
        }
        docRef.add(data)
        res.send({
            nh3 : req.body.nh3,
            co2: req.body.co2,
            index: xIndex,
            time: time.toString(),
            status: 'POST data sukses!'
        })
    }
    
});
app.listen(port, ()=>{
    console.log('Connected')
});



