import { getGameInfo, getScoreboard } from '../API';
import fs from 'fs';

const dummyScoreboard = {
  'tournament': 'Testkampe ML - 2020-2021',
  'awayScore': 0,
  'homeTeam': 'Rødovre',
  'homeScore': 3,
  'homeShots': 3,
  'sheetURL': 'http://www.hockeyligaen.dk/gamesheet2.aspx?GameId=54553',
  'awayShots': 0,
  'inGameTime': 'Afsluttet',
  'gameID': 54553,
  'gameDate': '15-08-2020',
  'homePenalties': [],
  'homeLogo': 'Frederikshavn',
  'awayTeam': 'Hvidovre',
  'awayPenalties': [],
  'awayLogo': 'Aalborg',
  'simpleHomeTeam': 'Frederikshavn',
  'gameTime': '15:00',
  'ID': '5f3557ae4b8e7f6d7a31f8571498be55',
  'shouldHide': false,
  'simpleAwayTeam': 'Aalborg',
  'simpleTournament': 'Testkampe ML - 2020-2021'
};

export async function writeFile(directory: string, file: string, content: string) {
  console.log(`saving ${content} to ${file}`);

  if (!fs.existsSync(directory)) fs.mkdirSync(directory);
  await fs.writeFile(`${directory}/${file}.txt`, content, err => err && console.log(err));
}

export async function writeScoreboard(directory: string, game: any) {
  console.log(JSON.stringify(game));
  await writeFile(directory, 'homeScore', game.homeScore);
  await writeFile(directory, 'awayScore', game.awayScore);
  await writeFile(directory, 'homeTeam', game.homeTeam);
  await writeFile(directory, 'awayTeam', game.awayTeam);
  await writeFile(directory, 'homeShots', game.homeShots);
  await writeFile(directory, 'awayShots', game.awayShots);
}

function clearFile(directory: string, file: string, timer: number) {
  setTimeout(() =>
    writeFile(directory, file, '').then(() => console.log(`Cleared ${file}`)), timer * 1000);
}

export async function writePeriod(directory: string, entries: any[]) {
  const period = entries.length !== 0 ? `${entries.length}` : '1';

  await writeFile(directory, 'period', period);
}

export async function writeGoal(directory: string, entry: any, timer: number) {
  const s = `${entry.timestamp}: ${entry.status} ${entry.primaryText} (${entry.secondaryText})`;
  const file = entry.teamType.toLowerCase() + 'Goal';
  await writeFile(directory, file, s);
  clearFile(directory, file, timer);
}

export async function writePenalty(directory: string, entry: any, timer: number) {
  const s = `${entry.timestamp}: ${entry.secondaryText} - ${entry.primaryText} (${entry.status.replace('\n', ' ').toLowerCase()})`;
  const file = entry.teamType.toLowerCase() + 'Penalty';
  await writeFile(directory, file, s);
  clearFile(directory, file, timer);
}

class EntryManager {
  static manager = new EntryManager();
  static INSTANCE() : EntryManager{
    return this.manager;
  }
  entryLength = 0;

  setEntryLength(e : number){
    console.log("saved latest: " + JSON.stringify(e));
    this.entryLength = e
  }

  getEntryLength() : number {
    return this.entryLength
  }

}
export async function checkEntries(directory: string, data: any[], timer: number) {
  const entries = data.flatMap(x => x.entries);
  if (entries.length === 0) return;
  const latest = entries[0];

  if(EntryManager.INSTANCE().getEntryLength() === entries.length){
    console.log("Stuff changed but I do not have to react")
    return;
  }

  EntryManager.INSTANCE().setEntryLength(entries.length);

  if (latest.type !== 'Goal' && latest.type !== 'Penalty') return;

  if (latest.type === 'Goal') await writeGoal(directory, latest, timer);
  if (latest.type === 'Penalty') await writePenalty(directory, latest, timer);
}


export async function saveFiles(directory: string, timer: number, gameId: string) {
  dummyEntries(directory, true);
  getGameInfo((x: any) => checkEntries(directory, x, timer), 'fast', gameId);
  getGameInfo((x: any) => writePeriod(directory, x), 'entries', gameId);
  getScoreboard((x: any) => writeScoreboard(directory, x), gameId);
}

export async function dummyEntries(directory: string, clear = false) {
  await writeFile(directory, 'period', '2');

  await writeFile(directory, 'homePenalty', clear ? '' : '57:17: Cross-checking - #15 Carl Neill (2 min)');
  await writeFile(directory, 'awayPenalty', clear ? '' : '57:17: Cross-checking - #15 Carl Neill (2 min)');
  await writeFile(directory, 'homeGoal', clear ? '' : '39:19: 3 - 0 #40 Jesper Jensen (Uassisteret)');
  await writeFile(directory, 'awayGoal', clear ? '' : '39:19: 3 - 0 #40 Jesper Jensen (Uassisteret)');
}

export async function saveDummies(directory: string) {
  writeScoreboard(directory, dummyScoreboard);
  dummyEntries(directory);
}