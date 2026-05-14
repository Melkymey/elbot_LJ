import axios from "axios";

export default async function ({ cmd, q, reply, sock, jid, msg }: any) {
    if (cmd === "tiktok") {
        if (!q) return reply("Masukkan URL TikTok!");
        try {
            reply("Sedang mendownload TikTok, mohon tunggu...");
            const tkRes = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(q)}`);
            if (tkRes.data && tkRes.data.video) {
                const videoUrl = tkRes.data.video.noWatermark || tkRes.data.video.watermark;
                await sock.sendMessage(jid, { video: { url: videoUrl }, caption: "Download Berhasil!" }, { quoted: msg });
            } else {
                reply("Gagal mendownload video tersebut.");
            }
        } catch (e: any) {
            console.error("TikTok Downloader Error:", e.message);
            reply("Error saat mendownload TikTok. Pastikan URL valid.");
        }
        return true;
    }

    if (cmd === "ytmp3" || cmd === "ytmp4") {
        if (!q) return reply("Masukkan URL YouTube!");
        try {
            const isAudio = cmd === "ytmp3";
            reply(`Sedang mendownload YouTube ${isAudio ? 'Audio' : 'Video'}...`);
            const ytApi = `https://api.siputzx.my.id/api/dwnld/${isAudio ? 'ytmp3' : 'ytmp4'}?url=${encodeURIComponent(q)}`;
            const ytRes = await axios.get(ytApi);
            
            if (ytRes.data.status) {
                 const mediaUrl = ytRes.data.data.dl || ytRes.data.data.download;
                 if (isAudio) {
                    await sock.sendMessage(jid, { audio: { url: mediaUrl }, mimetype: 'audio/mpeg' }, { quoted: msg });
                 } else {
                    await sock.sendMessage(jid, { video: { url: mediaUrl } }, { quoted: msg });
                 }
            } else {
                reply("Gagal mendownload YouTube tersebut. Mungkin video terlalu panjang atau private.");
            }
        } catch (e: any) {
            console.error("YouTube Downloader Error:", e.message);
            reply("Error saat mendownload YouTube.");
        }
        return true;
    }
    
    return false;
}
