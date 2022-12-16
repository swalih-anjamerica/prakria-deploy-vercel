import pusherServer from "../../lib/pusher";

const trigger=async(params)=>{
    try{
        const {channel, event, data}=params;
        await pusherServer.trigger(channel, event, {...data, created:new Date()});
    }catch(e){
        console.log(e);
    }
}

const pusherUtils={
    trigger
}

export default pusherUtils;