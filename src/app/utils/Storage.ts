export class MemoryStorage {
    storage;
  
    constructor(initial?: any) {
      this.storage = initial || {};
    }
  
    getItem(key: string) {
      return this.storage[key];
    }
  
    setItem(key: string, value: any) {
      this.storage[key] = value;
    }
  }
  
  export class NoStorage {
    constructor(initial?: any) {
    }
  
    getItem(key: string) {
      return null;
    }
  
    setItem(key: string, value: any) {
    }
  }
  
  export default MemoryStorage;