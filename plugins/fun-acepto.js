import fs from 'fs';
import path from 'path';

const sendMarriageMessage = async (m, conn, name1, name2, action) => {
  let str = `${name1} ${action} a ${name2}! Felicidades!`.trim();
  let imgs = [
    'https://qu.ax/OpVX.mp4', 
    'https://qu.ax/ChmG.mp4', 
    'https://qu.ax/yUBa.mp4'
  ];
  let img = imgs[Math.floor(Math.random() * imgs.length)];
  conn.sendMessage(m.chat, { 
    video: { url: img }, 
    gifPlayback: true, 
    caption: str, 
    mentions: [m.sender] 
  }, { quoted: m });
};

const updateUserStatus = (user1, user2, status) => {
  global.db.data.users[user1].casado = status;
  global.db.data.users[user2].casado = status;
  if (status) {
    global.db.data.users[user1].pareja = user2;
    global.db.data.users[user2].pareja = user1;
  } else {
    global.db.data.users[user1].pareja = null;
    global.db.data.users[user2].pareja = null;
  }
};

let marriageHandler = async (m, { conn, usedPrefix }) => {
  if (!m.isGroup) throw 'Este comando solo funciona en grupos';
  
  let who = m.mentionedJid[0] || m.quoted?.sender || false;
  if (!who) throw 'Etiqueta o menciona a alguien';

  let name = conn.getName(who);
  let name2 = conn.getName(m.sender);

  if (global.db.data.users[m.sender].casado || global.db.data.users[who].casado) {
    throw 'Uno de los dos ya está casado';
  }

  await sendMarriageMessage(m, conn, name2, name, 'se ha casado con');
  updateUserStatus(m.sender, who, true);
};

marriageHandler.help = ['casarse @tag'];
marriageHandler.tags = ['fun'];
marriageHandler.command = ['casarse', 'marry'];
marriageHandler.group = true;

let acceptanceHandler = async (m, { conn, usedPrefix }) => {
  if (!m.isGroup) throw 'Este comando solo funciona en grupos';

  let who = m.mentionedJid[0] || m.quoted?.sender || false;
  if (!who) throw 'Etiqueta o menciona a alguien';

  let name = conn.getName(who);
  let name2 = conn.getName(m.sender);

  if (global.db.data.users[m.sender].pareja === who && global.db.data.users[who].pareja === m.sender) {
    throw 'Ya estás casado con esta persona';
  }

  await sendMarriageMessage(m, conn, name2, name, 'ha aceptado la proposición de');
  updateUserStatus(m.sender, who, true);
};

acceptanceHandler.help = ['acepto @tag'];
acceptanceHandler.tags = ['fun'];
acceptanceHandler.command = ['acepto', 'yes'];
acceptanceHandler.group = true;

let divorceHandler = async (m, { conn, usedPrefix }) => {
  if (!m.isGroup) throw 'Este comando solo funciona en grupos';

  let who = m.mentionedJid[0] || m.quoted?.sender || false;
  if (!who) throw 'Etiqueta o menciona a alguien';

  let name = conn.getName(who);
  let name2 = conn.getName(m.sender);

  if (global.db.data.users[m.sender].pareja !== who || global.db.data.users[who].pareja !== m.sender) {
    throw 'No estás casado con esta persona';
  }

  let str = `${name2} y ${name} se han divorciado.`.trim();
  let imgs = [
    'https://qu.ax/ChmG.mp4', 
    'https://qu.ax/yUBa.mp4', 
    'https://qu.ax/OpVX.mp4'
  ];
  let img = imgs[Math.floor(Math.random() * imgs.length)];
  conn.sendMessage(m.chat, { 
    video: { url: img }, 
    gifPlayback: true, 
    caption: str, 
    mentions: [m.sender] 
  }, { quoted: m });

  updateUserStatus(m.sender, who, false);
};

divorceHandler.help = ['divorciarse @tag'];
divorceHandler.tags = ['fun'];
divorceHandler.command = ['divorciarse', 'divorce'];
divorceHandler.group = true;

export { marriageHandler, acceptanceHandler, divorceHandler };