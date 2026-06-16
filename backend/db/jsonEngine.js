import fs from 'fs/promises'
import { JSON_DB_PATH, connectDB } from './connection.js'
import { DEFAULT_BADGES } from './badgesConfig.js'

// ── MAP / OBJECT DEFENSIVE HELPERS ──────────────────────
export function hasVal(mapOrObj, key) {
  if (!mapOrObj) return false
  if (typeof mapOrObj.has === 'function') {
    return mapOrObj.has(key)
  }
  return mapOrObj[key] !== undefined
}

export function setVal(mapOrObj, key, val) {
  if (!mapOrObj) return
  if (typeof mapOrObj.set === 'function') {
    mapOrObj.set(key, val)
  } else {
    mapOrObj[key] = val
  }
}

export function deleteVal(mapOrObj, key) {
  if (!mapOrObj) return
  if (typeof mapOrObj.delete === 'function') {
    mapOrObj.delete(key)
  } else {
    delete mapOrObj[key]
  }
}

export function getSize(mapOrObj) {
  if (!mapOrObj) return 0
  if (typeof mapOrObj.size === 'number') {
    return mapOrObj.size
  }
  return Object.keys(mapOrObj).length
}

export function toObject(mapOrObj) {
  if (!mapOrObj) return {}
  if (typeof mapOrObj.entries === 'function') {
    return Object.fromEntries(mapOrObj.entries())
  }
  return mapOrObj
}

let dbLock = Promise.resolve();
let memoryDb = null;

export async function readJsonDB() {
  await connectDB()
  
  if (memoryDb) {
    // Return the shared in-memory reference to ensure synchronous mutations are atomic across requests
    return memoryDb;
  }
  
  // Wait for any pending initialization/writes
  await dbLock;
  if (memoryDb) return memoryDb; // Double-checked locking
  
  try {
    const data = await fs.readFile(JSON_DB_PATH, 'utf-8')
    memoryDb = JSON.parse(data)
    return memoryDb
  } catch (parseErr) {
    console.error('Corrupted db.json — resetting to empty database:', parseErr.message)
    const fresh = { users: [], waterLogs: {}, habits: [], habitDone: {}, journalEntries: [], intentions: [], badges: DEFAULT_BADGES, userBadges: [] }
    await fs.writeFile(JSON_DB_PATH, JSON.stringify(fresh, null, 2))
    memoryDb = fresh
    return memoryDb
  }
}

export async function writeJsonDB(db) {
  // `db` is expected to be `memoryDb` due to the shared reference.
  // We queue the serialization and disk write to ensure they don't interleave.
  dbLock = dbLock.then(async () => {
    // Serialize a snapshot of the current memoryDb state
    const data = JSON.stringify(db, null, 2);
    await fs.writeFile(JSON_DB_PATH, data);
  }).catch(err => {
    console.error('Failed to write db.json:', err);
  });
  
  await dbLock;
}
