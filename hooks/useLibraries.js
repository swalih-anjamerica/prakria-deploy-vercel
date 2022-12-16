import { createContext, useContext, useEffect, useState } from "react";
import { getPusherKeysService } from "../services/dev";
import Pusher from "pusher-js";

const LibraryContext = createContext();

export const LibraryContextProvider = ({ children }) => {
    const values = getLibraryValues();

    return (
        <LibraryContext.Provider value={values}>
            {
                children
            }
        </LibraryContext.Provider>
    )
}

export const useLibraries = () => {
    return useContext(LibraryContext);
}

export const getLibraryValues = () => {
    const [pusher, setPusher] = useState(null);
    const [pusherSocketId, setPusherSocketId] = useState(null);

    useEffect(() => {
        initPusher();
        // return ()=>{
        //     pusher?.disconnect();
        // }
    }, [])
    
    const initPusher = async () => {
        try {
            const response = await getPusherKeysService();
            let pusherKeys = response.data;
            const pusher = new Pusher(pusherKeys?.PUSHER_APP_KEY, {
                cluster: pusherKeys?.PUSHER_CLUSTER,
                encrypted: true,
            });
            setPusher(pusher);
            pusher.connection.bind("connected", () => {
                setPusherSocketId(pusher.connection.socket_id);
            });

            pusher.connection.bind("disconnected", ()=>{
                console.log("Disconnected");
            })
        } catch (e) {
            console.log(e.message);
        }
    }

    return {
        pusher,
        pusherSocketId
    }
}