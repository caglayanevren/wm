export class Storage{
    gameList = [];
    
    constructor(){
        let version = "0";
        this.gameList = JSON.parse(localStorage.getItem("gameList"));
        if (this.gameList === null){
            this.gameList = [];
        } 
        version = localStorage.getItem("version");
        if (version === null){
            version = "0";
            this.setVersion(version);
        }       
    }

    getVersion(){
        let version = localStorage.getItem("version");
        if (version === null){
            version = "0";
        }  
        return version             
    }
    setVersion(version){
        localStorage.setItem("version",version);
    }

    saveGameState(state){
        var i = 0;

        for(i = 0; i < this.gameList.length; i++){
            let g = this.gameList[i];
            if (g.score * g.clearedLetterCount / 100 <= state.score * state.clearedLetterCount / 100){
                this.gameList.splice(i, 0, state);
                break;
            }
        }
        if (i === this.gameList.length && i < 6){
            this.gameList.push(state);
        }
        else if (this.gameList.length > 6){ 
            this.gameList.splice(6,this.gameList.length - 6);
        }
        localStorage.setItem("gameList",JSON.stringify(this.gameList));
    }
    getById(id){
        for(const[i,g] of this.gameList.entries()){
            if (g.id === id){
                return i;
            }
        }
        return -1
    }
    getGames(){
        this.gameList = JSON.parse(localStorage.getItem("gameList"));
        return (this.gameList === null ? [] : this.gameList);
    }
    getProfile(){
        let profile = localStorage.getItem("profile");
        if (profile != null){
            return JSON.parse(profile);
        }
        return null;
    }
    saveDict(dict){
        localStorage.setItem("dict",JSON.stringify(dict));
    }



}

export default Storage;