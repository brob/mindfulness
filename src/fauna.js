import { currentUser } from './auth';

var faunadb = require('faunadb'),
q = faunadb.query;
const client = new faunadb.Client({ secret: "fnADqDZd9BACFNF3YrwId76AFmDbFwZ2OUnnVkp2" })




async function getLatestFromFauna(userObj) {
    console.log(userObj);
    let latestFromFauna = await client.query(
        q.Call(
            q.Function("getLatestUserMindful"),
            userObj.sub
        )
    )
    console.log(latestFromFauna);
    return { date: latestFromFauna.latestTime, ...latestFromFauna.latestMindful }
}

async function getRandomMindfulFromFauna() {
    let mindfulThings = await client.query(
        q.Paginate(
            q.Documents(q.Collection('mindful_things'))
        )
    )
    
    let randomMindful = mindfulThings.data[Math.floor(Math.random()*mindfulThings.data.length)]
    return client.query(q.Get(randomMindful))
}

async function storeMindfulInFauna(newMindful) {
    console.log(newMindful, currentUser);
    const dataForFauna = {
        user: currentUser.sub,
        faunaRef: newMindful.ref
    }
    console.log('fauna data', dataForFauna);
    let faunaRes = await client.query(
        q.Create(
            q.Collection('user_things'),
            {
                data: dataForFauna
            }
        )
    )
    console.log(faunaRes);
    return faunaRes

}

export {getLatestFromFauna, getRandomMindfulFromFauna, storeMindfulInFauna}