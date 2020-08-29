import { db as firestore } from './Firebase';
import publicIp from 'public-ip';

export function getOverviews(callback, date) {
    const ref = firestore.collection('calendar').doc(date)
    ref.onSnapshot(res => res.data() ? callback(res.data().list) : callback([]))
}

export async function getScoreboard(callback, id) {
    console.log(id)
    const ref = firestore.collection('games').doc(id)
    ref.onSnapshot(res => res.data() && callback(res.data().overview))
}
export async function setStreaming(id, link) {
    const ip = await publicIp.v4();
  return await firestore.collection("streaming").doc(id).set({link:link, ip: ip});
}

export async function getTeam(callback, id) {
    const ref = firestore.collection('teams').doc(id)
    ref.onSnapshot(res => res.data() ? callback(res.data()) : callback([]))
}

export async function getTeamList(callback) {
    const ref = firestore.collection('teamsOverviews').doc("overviews")
    ref.onSnapshot(res => res.data() ? callback(res.data().list) : callback([]))
}

export async function getStandings(callback) {
    const ref = firestore.collection('standings').doc("all")
    ref.onSnapshot(res => res.data() ? callback(res.data().list) : callback([]))
}

export async function getGameInfo(callback, category, id) {
    const ref = firestore.collection('games').doc(id)
    ref.onSnapshot(res => {
        const data = res.data()
        if (data) {
            if (category === 'home') callback(data.homePlayers);
            else if (category === 'away') callback(data.awayPlayers);
            else if (category === 'meta') callback(data.meta);
            else if (category === 'stats') callback(data.stats);
            else if (category === 'entries') callback(data.entries);
            else if (category === 'fast') callback(data.fast);
        } else callback([])
    })

}

export function getGameCategory(callback, id) {
    const ref = firestore.collection('categories').doc(id)
    ref.onSnapshot(res => res.data() ? callback(res.data().list) : callback([]))
}
