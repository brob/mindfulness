import { currentUser, checkUser } from './auth';
const AUTH_PROP_KEY = "https://faunad.com/id/secret";
var faunadb = require('faunadb'),
q = faunadb.query;

async function getUserClient(currentUser) {
    return new faunadb.Client({ secret: currentUser[AUTH_PROP_KEY]})
}

async function getLatestFromFauna(userObj) {
    const client = await getUserClient(userObj);

    try {
        let latestFromFauna = await client.query(
            q.Call("getLatestUserMindful")
        )
        
        if (latestFromFauna.err) return latestFromFauna.err

        return { date: latestFromFauna.latestTime / 1000, ...latestFromFauna.latestMindful.mindful }
    } catch(err) {
        latestFromFauna.error = err
        return latestFromFauna
    }
}

async function getSomeFromFauna(count) {
    const authUser = await checkUser();
    const client = await getUserClient(authUser);

    let faunaRes = await client.query(
        q.Call("getSomeUserMindfuls", count)
    )   

    return faunaRes
}

async function getRandomMindfulFromFauna(userObj) {
    const client = await getUserClient(userObj);

    try {
        let mindfulThings = await client.query(
            q.Paginate(
                q.Documents(q.Collection('mindful_things'))
            )
        )
        let randomMindful = mindfulThings.data[Math.floor(Math.random()*mindfulThings.data.length)];
        let creation = await client.query(q.Call('addUserMindful', randomMindful));
        
        return creation.data.mindful;

    } catch (error) {
        console.log(error)
    }   
}

export {getLatestFromFauna, getRandomMindfulFromFauna, getSomeFromFauna}