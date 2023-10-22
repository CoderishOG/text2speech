const { Telegraf} = require('telegraf');
const translate = require('translate-google');
const express=require('express');
require('dotenv').config();
const app=express();
app.get("/",(req,res)=>{
  res.send("hello");
})
const port=30002;
app.listen(port,()=>{
  console.log(`Service is running at http://localhost:${port}`)
})
const bot=new Telegraf(process.env.BOT_TOKEN)
const fs=require('fs')
const fetch=require('node-fetch') 
 bot.start((ctx)=>{
  ctx.reply(`Hello there ${ctx.message.from.first_name}!! and Welcome To Text to Speech Bot ❤️.


 👉🏻 Send me any text now to convert it into a speech 
 👉🏻 Use /help command if you need any help`)
 })
 bot.help((ctx)=>{
  ctx.reply(`Send any text upto 300 words then select a language and voice in which you want your speech. That's all !! `)
 })
 const userin={};
 const max_words=249;
// let inw="";  Creating an object gives a advantage over a normal variable in this case Suppose two users are using your bot so storing there input along with their ids keep there data separate!!
 bot.on('text',async (ctx)=>{
  userin[ctx.from.id]=ctx.message.text;
  const id=ctx.chat.id
  const check=userin[id].split(/\s+/);
  if(check.length>=max_words){
  ctx.reply("Your text input is exceeding 300 words count 😔")
  }
  else{
  const textButtons2 = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'English', callback_data: 'e' }],
       [ { text: 'Hindi', callback_data: 'h' }],
       [ { text: 'Japanese', callback_data: 'j' }],
      ],
    },
  };
  await ctx.reply('Select a language in which you want your speech : ',textButtons2)
  bot.action('e',async (ctx)=>{
    const textButtons = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Mary', callback_data: '_1' }],
         [ { text: 'Amy', callback_data: '_2' }],
         [ { text: 'Linda', callback_data: '_3' }],
         [ { text: 'John', callback_data: '_4' }],
        ],
      }, 
    };
    await ctx.reply('Select a voice : ',textButtons)
   bot.action('_1',(ctx)=>{
    getdata(ctx, 'Mary','en-us','en');
  })
   bot.action('_2',(ctx)=>{
    getdata(ctx, 'Amy','en-us','en');
  })
   bot.action('_3',(ctx)=>{
    getdata(ctx, 'Linda','en-us','en');
  })
   bot.action('_4',(ctx)=>{
    getdata(ctx, 'John','en-us','en');
  })
  })
  bot.action('j',async (ctx)=>{
    const textButtons = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Fumi', callback_data: '1_' }],
         [ { text: 'Akira', callback_data: '2_' }],
         [ { text: 'Airi', callback_data: '3_' }],
         [ { text: 'Hina', callback_data: '4_' }],
        ],
      },
    };
  await ctx.reply("Select a voice :",textButtons)
   bot.action('1_',(ctx)=>{
    getdata(ctx, 'Fumi','ja-jp','ja');
  })
   bot.action('2_',(ctx)=>{
    getdata(ctx, 'Akira','ja-jp','ja');
  })
   bot.action('3_',(ctx)=>{
    getdata(ctx, 'Airi','ja-jp','ja');
  })
   bot.action('4_',(ctx)=>{
    getdata(ctx, 'Hina','ja-jp','ja');
  })
  })
  bot.action('h',async (ctx)=>{
    const textButtons = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Puja', callback_data: '1' }],
         [ { text: 'Kabir', callback_data: '2' }],
        ],
      },
    };
    await ctx.reply('Select a voice : ',textButtons)
    bot.action('1',(ctx)=>{
      getdata(ctx,'Puja','hi-in','hi')
    })
    bot.action('2',(ctx)=>{
      getdata(ctx,'Kabir','hi-in','hi')
    })
  })

async function getdata(ctx,v,la,too){
  const txt= userin[ctx.from.id];
  const id=ctx.chat.id;
  translate(txt ,{to:too}).then(async (res)=> {
    const ttxt=res;
    try{
      const response=await fetch(`http://api.voicerss.org/?key=ad2e930414774a4c95486411e610baea&hl=${la}&f=16khz_16bit_stereo&v=${v}&src=${ttxt}`)
    const voice=await response.buffer();
    const filename=`${id+Math.random()}.wav`
    fs.writeFileSync(filename,voice)
     const reply=(await ctx.reply("🔴 Processing⌛⌛..."))
     const msgid=reply.message_id;
    await ctx.replyWithAudio({source:fs.readFileSync(filename)})
    await ctx.telegram.editMessageText(id,msgid,null,"🎉🎉Your text has been converted to speech")
    ctx.reply("🟢 Here's your audio")
    fs.unlinkSync(filename);
    
     }
     catch(err){
    console.log("Error : ",err)
    ctx.reply("⚠️ An error occurred. Please try again later.");
     }
}).catch(err => {
    console.error(err)
})

}}
})
 bot.launch();