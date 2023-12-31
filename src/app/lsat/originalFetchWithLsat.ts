import MemoryStorage from "../utils/Storage";
import NoStorage from "../utils/Storage";
import { WebLNProvider } from '@webbtc/webln-types';

export * as Storage from "../utils/Storage";
const memoryStorage = new MemoryStorage();

export const originalFetchWithLsat = async (originalFetch:any, url: string, fetchArgs: Record<string, any>, options: Record<string, any>) => {
  if (!options) {
    options = {};
  }
  const webln: WebLNProvider = options.webln || (globalThis as any).webln;
  if (!webln) {
    throw new Error("WebLN is missing");
  }
  let store = options.store || memoryStorage;
  if (!fetchArgs) {
    fetchArgs = {};
  }
  fetchArgs.cache = 'no-store';
  fetchArgs.mode = 'cors';
  if (!fetchArgs.headers) {
    fetchArgs.headers = {};
  }
  const cachedLsatData = store.getItem(url);
  if (cachedLsatData && !isJWTValid(cachedLsatData)) {
    const data = JSON.parse(cachedLsatData);
    fetchArgs.headers["Authorization"] = `LSAT ${data.mac}:${data.preimage}`;
    return await originalFetch(url, fetchArgs)
  } else if (isJWTValid(cachedLsatData)) {
    console.log("LSAT expired, removing from cache");
    store.setItem(url, null);
  }

  fetchArgs.headers["Accept-Authenticate"] = "LSAT";
  const initResp = await originalFetch(url, fetchArgs);
  const header = initResp.headers.get('www-authenticate');
  if (!header) {
    return initResp
  }

  const parts = header.split(",");
  const mac = parts[0].replace("LSAT macaroon=", "").trim();
  const inv = parts[1].replace("invoice=", "").trim();

  await webln.enable();
  const invResp = await webln.sendPayment(inv);

  store.setItem(url, JSON.stringify({
    'mac': mac,
    'preimage': invResp.preimage
  }));

  fetchArgs.headers["Authorization"] = `LSAT ${mac}:${invResp.preimage}`;
  return await originalFetch(url, fetchArgs);
}

const isJWTValid = (jwt?: string) => {
    if (!jwt) {
        return true;
    }
    const parts = jwt.split(".");
    const payload = JSON.parse(atob(parts[1]));
    //check if expired
    console.log("JWT payload", payload);
    return Math.floor(Date.now() / 1000) > payload.exp;
}

export default originalFetchWithLsat;