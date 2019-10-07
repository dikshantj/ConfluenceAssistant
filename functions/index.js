const functions = require('firebase-functions')
const rp = require('request-promise')

const {
  dialogflow,
  Suggestions,
  List,
  BasicCard,
  BrowseCarousel,
  BrowseCarouselItem,
  Image
} = require('actions-on-google')

const base_url = 'https://confluence-backend.appspot.com/api/';

const ABOUT_CONFLU = 'About Confluence'

const CATEGORY_LIST = 'categoryList'
const EVENT_LIST = 'categoryList - events'
const EVENT_DETAIL = 'categoryList - events - detail'
const DEVELOPERS = 'Developers'
const SPONSORS = 'Sponsors'
const EVENTLIST = 'categoryEvents'
const EVENTDETAIL = 'categoryEvents - detail'
const EVENTS = 'events'
const app = dialogflow({ debug: true });

app.intent('Default Fallback Intent', conv =>{
  conv.ask("Please be more specific and try again!")
  conv.ask(new Suggestions(['Event Categories','About Confluence','Developers','Sponsors']))
})

app.intent('Default Welcome Intent', conv=>{
  conv.ask(`<speak>`+
  `Welcome to Confluence'19 Remastered. Here you can ask any queries related to fest like Categories of Events` +
  `, Events of a particular category, any detail of an event, <sub alias="etcetra">etc</sub>`+
  `Say bye any time to end the conversation. </speak>`)
  conv.ask(`<speak>Ask something I'm listening!</speak>` )
  conv.ask(new Suggestions(['Event Categories','About Confluence','Developers','Sponsors']))
})

app.intent(ABOUT_CONFLU, conv => {
  conv.ask(`<speak>
    Confluence is the Annual Cultural Fest of <say-as interpret-as="characters">NIT</say-as> Kurukshetra.
    It is one of the biggest fest of North India.It is to be held from 11th October to 13th October.
    It witnesses an active participation from over 30 NITs, IITs, and other institutes of repute across the nation every year.
    It has always been graced by the presence of several renowned personalities.</speak>`)
  conv.ask(`Ask anything ..... m listening to you.`)
  conv.ask(new Suggestions(['Event Categories','Developers','Sponsors']))
})

app.intent('Exit Conversation', (conv) => {
  conv.close(`Okay, talk to you next time!`);
});

app.intent(CATEGORY_LIST, async conv=>{
  try {
    const response = await rp(`${base_url}category/`);
    var res = JSON.parse(response);
    var categories = [];
    for (let i in res.data) {
      categories.push(res.data[i].name);
    }
    let list = {};
    for (let j = 0; j < categories.length; j++) {
      list[categories[j]] = {
        title: categories[j],
        description: categories[j] + ' events'
      };
    }
    conv.ask(`Here are the different categories of events`);
    conv.ask(new List({
      title: 'List of Categories',
      items: list
    }));
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers', 'Sponsors']));
  }
  catch (err) {
    conv.ask("Sorry, you can ask something else. Ask anything ..... m listening to you.");
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers', 'Sponsors']));
  }
});

app.intent(EVENT_LIST, async (conv, params, category) => {
  try {
    const res = await rp(`${base_url}events/name/?category=${category}`);
    let eventList = JSON.parse(res).data[0].events;
    let list = {}

    for (let i in eventList)
      list[eventList[i].name] = {
        title: eventList[i].name,
        description: 'Tap for details'
      }

    conv.ask('Here are the different ' + category + ' Events')
    conv.ask(new List({
      title: 'List of ' + category + ' Events',
      items: list
    }))
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers', 'Sponsors']));
  }
  catch (err) {
    conv.ask('Sorry, you can ask something else. Ask anything ..... m listening to you.');
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers', 'Sponsors']));
  }
})

app.intent(EVENTLIST, async (conv,{categories}) => {
  try {
    const res = await rp(`${base_url}events/name/?category=${categories}`);
    let eventList = JSON.parse(res).data[0].events;
    let list = {}

    for (let i in eventList)
      list[eventList[i].name] = {
        title: eventList[i].name,
        description: 'Tap for details'
      }

    conv.ask('Here are the different ' + categories + ' Events')
    conv.ask(new List({
      title: 'List of ' + categories+ ' Events',
      items: list
    }))
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers', 'Sponsors']));
  }
  catch (err) {
    conv.ask('Sorry, you can ask something else. Ask anything ..... m listening to you.');
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers', 'Sponsors']));
  }
})

app.intent([EVENT_DETAIL,EVENTDETAIL], async (conv, params, event) => {
  try {
    const res = await rp(`${base_url}events/desc/?event=${event}`);
    let data = JSON.parse(res).data;
    var cord = data.coordinators.toString();
    let description = data.description +'  \n**VENUE: ' + data.venue +'**'+ '  \n**COORDINATORS: '+cord+'**';
    conv.ask('Here are the details of ' + event);
    conv.ask(new BasicCard({
      text: description,
      title: data.name,
      display: 'CROPPED'
    }));
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers', 'Sponsors']));
  }
  catch (err) {
    conv.ask('Sorry event name is not clear. Ask anything ..... m listening to you.');
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers', 'Sponsors']));
  }
})

app.intent(EVENTS, async (conv, {event}) => {
  try {
    const res = await rp(`${base_url}events/desc/?event=${event}`);
    let data = JSON.parse(res).data;
    var cord = data.coordinators.toString();
    let description = data.description +'  \n**VENUE: ' + data.venue +'**'+ '  \n**COORDINATORS: '+cord+'**';
    conv.ask('Here are the details of ' + event);
    conv.ask(new BasicCard({
      text: description,
      title: data.name,
      display: 'CROPPED'
    }));
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers', 'Sponsors']));
  }
  catch (err) {
    // conv.ask(JSON.stringify(err));
    conv.ask('Sorry event name is not clear. Ask anything ..... m listening to you.');
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers', 'Sponsors']));
  }
})

app.intent(DEVELOPERS, conv =>{
    conv.ask('Yet to be updated')
})

app.intent(SPONSORS, async conv =>{
  try {
    var sponsors =[
      {
      "name": "Dikshant",
      "sponsorSection": "sponsor section1",
      "targetUrl": "https://github.com/dikshantj",
      "imageUrl": "https://avatars1.githubusercontent.com/u/29337284?s=460&v=4",
      "tagline": "With business lies our trust"
      },
    {
      "name": "Dikshant1",
      "sponsorSection": "sponsor section2",
      "targetUrl": "https://github.com/dikshantj",
      "imageUrl": "https://avatars1.githubusercontent.com/u/29337284?s=460&v=4",
      "tagline": "with business lies our trust"
      },
      {
      "name": "Dikshant2",
      "sponsorSection": "sponsor section3",
      "targetUrl": "https://github.com/dikshantj",
      "imageUrl": "https://avatars1.githubusercontent.com/u/29337284?s=460&v=4",
      "tagline": "with business lies our trust"
      }
    ] 
    let list = {};

    for (let i in sponsors)
      list[sponsors[i].name] = {
        title: sponsors[i].sponsorSection,
        description: '**' + sponsors[i].name + '**  \n'+sponsors[i].tagline,
        url: sponsors[i].targetUrl,
        image: new Image({
          url: sponsors[i].imageUrl,
          alt: sponsors[i].name +' logo',
        }),
      }

    conv.ask('Here are the different sponsors' + JSON.stringify(list))
    conv.ask(new BrowseCarousel({
      items: list
    }))
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers']));
  }
  catch (err) {
    conv.ask('Sorry cannot fulfill your request. Ask anything ..... m listening to you.');
    conv.ask(new Suggestions(['Event Categories', 'About Confluence', 'Developers']));
  }
})

  

exports.confluence = functions.https.onRequest(app)