import { EOL, isWindows } from "./helpers";
import * as fs from 'fs';

export const HOSTS_FILE_PATH = isWindows() ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts';

const TIME_BLOCKER_START = '###TIME_BLOCKER_START';
const TIME_BLOCKER_END = '###TIME_BLOCKER_END';

//! For Tests
// const blockedDomains = ['twitter.com', 'www.facebook.com'];

// blockBlackList(blockedDomains);
// unblockBlackList();

export async function blockBlackList(domains: string[]): Promise<boolean> {
    const hostsFile = await readHostsFile();
    const hosts = hostsFile.split(EOL);
    const timeBlockerPositions = findTimeBlockerIndexes(hosts);
    let blockedDomains: string[] = [];

    if (timeBlockerPositions.start >= 0 && timeBlockerPositions.end > 0) {
        blockedDomains = hosts.splice(timeBlockerPositions.start, timeBlockerPositions.end + 1 - timeBlockerPositions.start);
        blockedDomains.shift();
        blockedDomains.pop();
    }

    const finalHostsContent = [
        ...hosts,
        TIME_BLOCKER_START,
        ...blockedDomains,
        ...domains.map(domain => `127.0.0.1 ${domain}`),
        TIME_BLOCKER_END,
    ].join(EOL);

    await writeHostsFile(finalHostsContent);

    return true;
}

export async function unblockBlackList(): Promise<boolean> {
    const hostsFile = await readHostsFile();
    const hosts = hostsFile.split(EOL);
    const timeBlockerPositions = findTimeBlockerIndexes(hosts);

    if (timeBlockerPositions.start < 0 || timeBlockerPositions.end < 0) {
        return true;
    }

    hosts.splice(timeBlockerPositions.start, timeBlockerPositions.end + 1 - timeBlockerPositions.start);
    const finalHostsContent = hosts.join(EOL);
    await writeHostsFile(finalHostsContent);
    return true;
}

function readHostsFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(HOSTS_FILE_PATH, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.toString());
            }
        })
    })
}

function writeHostsFile(content: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.writeFile(HOSTS_FILE_PATH, content, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve('Success');
            }
        })
    })
}

function findTimeBlockerIndexes(hosts: string[]) {
    const positions = {
        start: -1,
        end: -1
    }

    for (let x = 0; x < hosts.length; x++) {
        if (hosts[x].indexOf(TIME_BLOCKER_START) > -1) {
            positions.start = x;
        }

        if (hosts[x].indexOf(TIME_BLOCKER_END) > -1) {
            positions.end = x;
        }
    }

    if (positions.start > positions.end) {
        return { start: -1, end: -1 }
    }

    return positions;
}