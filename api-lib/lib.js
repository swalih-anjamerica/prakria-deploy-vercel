

export const ncOpts = {

    onError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end(`${req.method} not found `);
        
    },
    
}


