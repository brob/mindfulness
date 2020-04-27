import { currentUser } from './auth';

var faunadb = require('faunadb'),
q = faunadb.query;
const client = new faunadb.Client({ secret: "fnADqDZd9BACFNF3YrwId76AFmDbFwZ2OUnnVkp2" })


async function getLatestFromFauna(userObj) {
    let latestFromFauna = await client.query(
        q.Call(
            q.Function("getLatestUserMindful"),
            userObj.sub
        )
    )

    return { date: latestFromFauna.latestTime, ...latestFromFauna.latestMindful }
}

async function getSomeFromFauna(userObj, count) {
    let faunaRes = await client.query(
        q.Call("getSomeUserMindfuls", userObj.sub, count)
    )   

    return faunaRes
}

async function buildQueryRefs(refArray) {
    let dataFromRefs = refArray.map( ref => {
        return q.Get(ref)
    })
    return dataFromRefs
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
    const dataForFauna = {
        user: currentUser.sub,
        faunaRef: newMindful.ref
    }

    let faunaRes = await client.query(
        q.Create(
            q.Collection('user_things'),
            {
                data: dataForFauna
            }
        )
    )

    return faunaRes
}

export {getLatestFromFauna, getRandomMindfulFromFauna, getSomeFromFauna, storeMindfulInFauna}