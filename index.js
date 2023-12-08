const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require("axios");
const app = express();
const date = new Date().getHours();
const { Hercai } = require('hercai');
require('dotenv').config();

const herc = new Hercai();

// Body parser middleware
app.use(bodyParser.json({
    limit: '50mb',
    extended: false,
}));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.log(err));

app.post('/webhook', (req, res) => {
    var waktu = date < 12 ? 'Selamat Pagi' : date < 18 ? 'Selamat Siang' : 'Selamat Malam',
        type = req.body.dataType,
        chat = req.body.data.message.body,
        dari = req.body.data.message.from,
        mid = req.body.data.message.id.id,
        arane = req.body.data.message._data.notifyName
    if (/c.us/g.test(dari)) {
        if (type == 'message' && chat == "1") {
            replyPesan(dari, mid, '*Kira-kira apa sih kegiatan Karang Taruna Winduaji terdekat ini?*\r\n' +
 '\r\n' +
'Nah, jadi dalam waktu dekat ini Karang Taruna Winduaji akan mengadakan Malam Keakraban pada tanggal 9-10 Desember 2023 yang bertempat di Wisata Sirah Pemali, Kec. Paguyangan, Kab. Brebes.\r\n' +
 '\r\n' +
'Bukan hanya sekadar seru-seruan, tapi sekaligus akan ada pemaparan program kerja dari masing-masing divisi. \r\n' +
 '\r\n' +
'So, stay tune!');
        } else if (type == 'message' && chat == "2") {
            replyPesan(dari, mid, 'Halo sobat Karang Taruna 🙌🏻\r\n' +
 '\r\n' +
'*Ingin tahu tentang keanggotaan kami?*\r\n' +
'*Jumlahnya berapa ya kira-kira?*\r\n' +
 '\r\n' +
'Baik, untuk total anggota Karang Taruna Winduaji berjumlah 33 orang yang tersebar di lima dusun yaitu dari RW 001 sampai RW 005 dengan background yang berbeda-beda. Namun, perbedaan itulah yang membawa kami untuk bersama melakukan perubahan.\r\n' +
 '\r\n' +
'*Kalau struktur organisasinya ada apa aja?*\r\n' +
 '\r\n' +
'Nah, bicara soal struktur organisasi tentu ada kepengurusan inti dari mulai ketua, wakil, sekretaris, dan bendahara. \r\n' + 'Namun, ada juga Wakil Ketua Bidang Kelembagaan dan Pendukung yang membawahi 3 bidang antara lain bidang Humas, Publikasi, dan Dokumentasi, Hubungan Kerja Sama, serta Pendidikan dan Pelatihan. \r\n' + 'Selain itu, terdapat Wakil Ketua Bidang Program Kerja yang membawahi 4 bidang antara lain bidang Pembinaan Mental Rohani, Ekonomi Produktif, Pelayanan Sosial, serta Olahraga dan Seni Budaya.\r\n' +
 '\r\n' +
'Oleh karena itu, untuk kamu yang tertarik bergabung dengan kami, silahkan hubungi Customer Service kami sekarang juga (khusus yang berdomisili di Desa Winduaji tercinta).');
        } else if (type == 'message' && chat == "3") {
            replyPesan(dari, mid, 'Halo?\r\n' +
 '\r\n' +
'*Kamu ingin lebih banyak tahu tentang Karang Taruna Winduaji?*\r\n' +
'*Masih penasaran dengan kegiatan-kegiatan kami?*\r\n' +
 '\r\n' +
'Yap! Kamu bisa mengunjungi akun media sosial resmi kami di :\r\n' +
 '\r\n' +
'Instagram | *@karangtaruna.winduaji*\r\n' +
'Facebook | *Karang Taruna Winduaji*\r\n' +
'Tiktok | *@kartunwinduaji23*\r\n' +
 '\r\n' +
'So, ikuti terus perjalanan kami!\r\n' +
'And please, support us on social media 🙌🏻');
        } else if (type == 'message' && chat == "4") {
replyPesan(dari, mid, 'Ini adalah kontak CS kami yang bisa kamu hubungi,\r\n');
            replyPesanKontak(dari, mid, '6288985042844');
            replyPesanKontak(dari, mid, '6288983212915');
        } else if (type == 'message' && chat.charAt(0) == "#") {
herc.question({model:"v3-beta",content:chat.substring(1)}).then(response => {
console.log(response.reply);
replyPesan(dari, mid, response.reply);

/* The module will reply based on the message! */

}); 
        } else if (type == 'message') {
            replyPesan(dari, mid, waktu + ' ' + arane + ',\r\n' +
                'Saya *Karang Taruna Winduaji*.\r\n' +
                'Apa yang bisa kami bantu hari ini?\r\n' +
                '\r\n' +
                'Ketik 1️⃣ : Info Kegiatan\r\n' +
                'Ketik 2️⃣ : Info Keanggotaan\r\n' +
                'Ketik 3️⃣ : Info Sosmed\r\n' +
                'Ketik 4️⃣ : Chat dengan Anggota\r\n' +
                '\r\n' +
                '_Ketik # diikuti pertanyaan, kami akan membalas semua pertanyaan kamu :)_\r\n' +
                '\r\n' +
                'Untuk melanjutkan, silahkan Ketik sesuai tujuan kamu!');
        }
    }
    console.log(req.body.dataType);
    console.log(req.body.data.message.body);
    console.log(req.body.data.message.from);
    console.log(req.body.data.message.id.id);
    console.log(req.body);
    res.status(200).json({
        message: 'Webhook received'
    });
});

function replyPesan(cid, mid, data) {
    axios.post(process.env.WAPI+'/message/reply/kartun', {
            "chatId": cid,
            "messageId": mid,
            "contentType": "string",
            "content": data
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'sukipli'
            }
        })
        .then(function(response) {
            console.log(response.status);
        })
        .catch(function(error) {
            if (error.response) {
                console.log('Server responded with status code:', error.response.status);
                console.log('Response data:', error.response.data);
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Error creating request:', error.message);
            }
        });
}

function replyPesanKontak(cid, mid, data) {
    axios.post(process.env.WAPI+'/client/sendMessage/kartun', {
            "chatId": cid,
  "contentType": "Contact",
  "content": {
    "contactId": data+"@c.us"
  }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'sukipli'
            }
        })
        .then(function(response) {
            console.log(response.status);
        })
        .catch(function(error) {
            if (error.response) {
                console.log('Server responded with status code:', error.response.status);
                console.log('Response data:', error.response.data);
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Error creating request:', error.message);
            }
        });
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));