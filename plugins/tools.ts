import axios from "axios";

export default async function ({ cmd, q, reply, sock, jid, msg, prefix }: any) {
    if (cmd === "nulis") {
        if (!q) return reply(`Gunakan ${prefix}nulis <teks kamu>`);
        try {
            const nulisUrl = `https://api.siputzx.my.id/api/utils/nulis?text=${encodeURIComponent(q)}`;
            await sock.sendMessage(jid, { image: { url: nulisUrl }, caption: "Ini hasilnya kak!" }, { quoted: msg });
        } catch (e: any) {
            console.error("Nulis Plugin Error:", e.message);
            reply("Gagal memproses fitur nulis. Coba lagi nanti.");
        }
        return true;
    }

    if (cmd === "tr" || cmd === "translate") {
        if (!q) return reply(`Contoh: ${prefix}tr en Halo`);
        const trArgs = q.split(" ");
        const toLang = trArgs[0];
        const trText = trArgs.slice(1).join(" ");
        try {
            const trResult = await axios.get(`https://api.popcat.xyz/translate?to=${toLang}&text=${encodeURIComponent(trText)}`);
            reply(trResult.data.translated);
        } catch (e) {
            reply("Gagal menerjemahkan.");
        }
        return true;
    }

    if (cmd === "wiki") {
        if (!q) return reply("Masukkan apa yang ingin dicari di Wikipedia.");
        try {
            const wikiRes = await axios.get(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
            if (wikiRes.data && wikiRes.data.extract) {
                reply(`*Wikipedia: ${wikiRes.data.title}*\n\n${wikiRes.data.extract}`);
            } else {
                reply("Tidak ditemukan hasil di Wikipedia.");
            }
        } catch (e) {
            reply("Gagal mencari di Wikipedia.");
        }
        return true;
    }
    
    return false;
}
