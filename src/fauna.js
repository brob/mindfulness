import { currentUser, client } from './auth';
const AUTH_PROP_KEY = "https://faunad.com/id/secret";
var faunadb = require('faunadb'),
q = faunadb.query;


async function getUserClient(currentUser) {
    return new faunadb.Client({ secret: currentUser[AUTH_PROP_KEY]})
}


async function getLatestFromFauna(userObj) {
    const client = await getUserClient(userObj);

    let latestFromFauna
    try {
        latestFromFauna = await client.query(
            q.Call("getLatestUserMindful", q.Identity())
        )
        return { date: latestFromFauna.latestTime / 1000, ...latestFromFauna.latestMindful }
    } catch(err) {
        latestFromFauna.error
        return latestFromFauna

    }
}

async function getSomeFromFauna(userObj, count) {
    const client = await getUserClient(currentUser);

    let faunaRes = await client.query(
        q.Call("getSomeUserMindfuls", q.Identity(), count)
    )   

    return faunaRes
}

async function getRandomMindfulFromFauna() {
    const client = await getUserClient(currentUser);

    try {
        let mindfulThings = await client.query(
            q.Paginate(
                q.Documents(q.Collection('mindful_things'))
            )
        )
        let randomMindful = mindfulThings.data[Math.floor(Math.random()*mindfulThings.data.length)];
        
        return await client.query(q.Get(randomMindful))

    } catch (error) {
        console.log(error)
    }   
}

async function storeMindfulInFauna(newMindful) {
    const client = await getUserClient(currentUser);
    const dataForFauna = {
        user: await client.query(q.Identity()),
        faunaRef: newMindful.ref
    }
    try {
    let faunaRes = await client.query(
        q.Call('addUserMindful', dataForFauna)
    )
    return faunaRes

    } catch (error) {
        console.log(error);
    }

}

export {getLatestFromFauna, getRandomMindfulFromFauna, getSomeFromFauna, storeMindfulInFauna}