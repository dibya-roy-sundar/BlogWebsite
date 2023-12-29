const today=new Date();
const options = {  year: 'numeric', month: 'short', day: 'numeric' };


const storeJoinedDate=(timestamp)=>{
    const today=new Date(timestamp);
    return today.toLocaleDateString('en-US',options);

}


export {storeJoinedDate};