export const getVideoThumbail = (videoUrl) => {
    return new Promise((resolve, reject) => {
        try {
            if (!videoUrl) return resolve(null);
            const video = document.createElement("video");
            const seektime = 0.0;
            video.src = videoUrl;
            video.load();
            video.addEventListener("loadedmetadata", () => {
                if (video.duration < seektime) return resolve();
                setTimeout(() => {
                    video.currentTime = seektime;
                }, 200);
                video.addEventListener("seeked", () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    let dataUrl = canvas.toDataURL("image/jpeg");
                    resolve(dataUrl);
                })
            })
        } catch (e) {
            resolve(null);
        }
    })
}