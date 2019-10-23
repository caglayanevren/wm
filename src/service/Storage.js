export class Storage{
    gameList = [];
    constructor(){
        this.gameList = JSON.parse(localStorage.getItem("gameList"));
        if (this.gameList === null){
            this.gameList = [];
        }
    }
    saveGameState(state){
        let i = this.getById(state.id);
        if (i === -1)
            this.gameList.push(state);
        else
            this.gameList[i] = state;
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
        return this.gameList;
    }
}

export default Storage;