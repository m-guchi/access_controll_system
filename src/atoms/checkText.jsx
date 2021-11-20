export const checkTextNullOrSpace = (text) => {
    if(!text || !text.match(/\S/g) || text.length<1){
        return true;
    }else{
        return false;
    }
}