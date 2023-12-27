const today=new Date();
const options = {  year: 'numeric', month: 'short', day: 'numeric' };
const CurrentDate = today.toLocaleDateString('en-US',options);
const CurrentTime= today.toLocaleString('en-US');


const storeJoinedDate=(timestamp)=>{
    const today=new Date(timestamp);
    return today.toLocaleDateString('en-US',options);

}


export {CurrentDate,CurrentTime,storeJoinedDate};