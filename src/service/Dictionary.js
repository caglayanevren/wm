import axios from 'axios';
import { initDB } from 'react-indexed-db';
import { useIndexedDB } from 'react-indexed-db';

export class Dictionary{
    entries = [];

    constructor(){
        let dbConfig = {
            name: 'DB',
            version: 1,
            objectStoresMeta: [
              {
                store: 'dictionary',
                storeConfig: { keyPath: 'id', autoIncrement: false },
                storeSchema: [
                  { name: 'list', keypath: 'list', options: { unique: false } },
                ]
              }
            ]
          };      
          initDB(dbConfig);
          const { add } = useIndexedDB('dictionary');
          const { getAll } = useIndexedDB('dictionary');
          this.getAll = getAll.bind(this);
          this.getAll().then(dict=>{
            if (dict.length === 0){
              axios({method: 'post',url: 'http://localhost:8080/dict'}).then(obj => {add({id:0,list:obj.data}); this.entries = obj.data})
            }
            else{
                console.log(JSON.stringify(dict[0].list));
                this.entries = dict[0].list;
                console.log(this.entries)
            }
          })       
    }



    binarySearch(arr, word, start, end) { 
       
        // Base Condtion 
        if (start > end) return false; 
       
        // Find the middle index 
        let mid = Math.floor((start + end) / 2);
        let val = arr[mid].id;
        // Compare mid with given key x 
        let compare = word.localeCompare(val);
        if (compare === 0) return arr[mid].desc; 
              
        // If element at mid is greater than x, 
        // search in the left half of mid 
        if(compare === -1)  
            return this.binarySearch(arr, word, start, mid - 1); 
        else      
            // If element at mid is smaller than x, 
            // search in the right half of mid 
            return this.binarySearch(arr, word, mid + 1, end); 
    } 

    lookup(word){
        console.log("looking up..." + word.toLocaleLowerCase("TR"))
        let w = this.binarySearch(this.entries,word.toLocaleLowerCase("TR"),0,this.entries.length - 1);
        return w;
    }

    isEmpty(){
        return (this.entries.length === 0)
    }
}

export default Dictionary;