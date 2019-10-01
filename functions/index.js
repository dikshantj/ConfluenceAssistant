const functions = require('firebase-functions')
const rp = require('request-promise')
const timestamp = require('unix-timestamp')
const {
  dialogflow,
  Suggestions
} = require('actions-on-google')

const ABOUT_CONFLU = 'About Confluence'



const app = dialogflow({ debug: true });

app.intent('Default Fallback Intent', conv =>{
  conv.ask("Please be more specific and try again!")
  conv.ask(new Suggestions(['Event Categories','About Confluence', 'Team Confluence','Developers','Sponsors']))
})

app.intent('Default Welcome Intent', conv=>{
  conv.ask(`<speak>`+
  `Welcome to Confluence'19 Remastered. Here you can ask any queries related to fest like Categories of Events` +
  `, Events of a particular category, any detail of an event, <sub alias="etcetra">etc</sub>`+
  `Say bye any time to end the conversation. </speak>`)
  conv.ask(`speak>Ask something I'm listening!` )
  conv.ask(new Suggestions(['Event Categories','About Confluence', 'Team Confluence','Developers','Sponsors']))
})

app.intent(ABOUT_CONFLU, conv => {
  conv.ask(`<speak>
    Confluence is the Annual Cultural Fest of <say-as interpret-as="characters">NIT</say-as> Kurukshetra.
    It is one of the biggest fest of North India.It is to be held from 11th October to 13th October.
    It witnesses an active participation from over 30 NITs, IITs, and other institutes of repute across the nation every year.
    It has always been graced by the presence of several renowned personalities.</speak>`)
  conv.ask(`Ask anything ..... m listening to you.`)
  conv.ask(new Suggestions(['Event Categories','About Confluence', 'Team Confluence','Developers','Sponsors']))
})

