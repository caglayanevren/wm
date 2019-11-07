

export class Dictionary{
    entries = [];

    constructor(){
    }



    binarySearch(arr, word, start, end) { 
       
        // Base Condtion 
        if (start > end) return false; 
       
        // Find the middle index 
        let mid = Math.floor((start + end) / 2);
        let val = arr[mid].id;
        val = val.toLocaleLowerCase("tr")
        // Compare mid with given key x 
        
        let compare = word.localeCompare(val,"tr");
        console.log(word + " --- > comparing to " + val  + "  = " + compare)
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

        let w = this.binarySearch(this.entries,word.toLocaleLowerCase("tr"),0,this.entries.length - 1);
        return w;
    }

    isEmpty(){
        return (this.entries.length === 0)
    }
}

export default Dictionary;