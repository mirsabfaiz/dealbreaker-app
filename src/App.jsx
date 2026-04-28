import { useState, useEffect, useRef, memo, useCallback } from "react";

const ADDICTIONS = [
  { id:"alcohol", label:"Alcohol", icon:"🍺" },
  { id:"cannabis", label:"Cannabis", icon:"🌿" },
  { id:"hard_drugs", label:"Hard Drugs", icon:"💊" },
  { id:"narcotics", label:"Narcotics", icon:"💉" },
  { id:"hallucinogens", label:"Hallucinogens", icon:"🍄" },
  { id:"nicotine", label:"Nicotine", icon:"🚬" },
  { id:"inhalants", label:"Inhalants", icon:"💨" },
  { id:"gambling", label:"Gambling", icon:"🎲" },
  { id:"porn", label:"Porn", icon:"🔞" },
];

const CORE_QUESTIONS = [
  { id:"social_network", label:"Do you have close friends or family you can call?", options:["Yes","No","Prefer not to say"] },
  { id:"faith", label:"Is faith or spirituality important to you?", options:["Yes","No","Prefer not to say"] },
  { id:"outdoor_access", label:"Do you have easy access to outdoor space?", options:["Yes","No","Prefer not to say"] },
];

const EXTRA_QUESTIONS = [
  { id:"partner", label:"Do you have a romantic partner?", options:["Yes","No","Prefer not to say"] },
  { id:"children", label:"Do you have children?", options:["Yes","No","Prefer not to say"] },
  { id:"employed", label:"Are you currently employed or in school?", options:["Yes","No","Prefer not to say"] },
  { id:"pets", label:"Do you have pets?", options:["Yes","No","Prefer not to say"] },
  { id:"exercise_habit", label:"Do you exercise regularly?", options:["Yes","No","Prefer not to say"] },
];

const MILESTONES = {
  alcohol:[{days:1,label:"24 hours",detail:"Liver begins filtering toxins",phrase:"of choosing clarity"},{days:3,label:"3 days",detail:"Withdrawal symptoms begin to ease",phrase:"of pushing through"},{days:7,label:"1 week",detail:"Sleep quality improves",phrase:"of showing up"},{days:14,label:"2 weeks",detail:"Blood pressure normalizes",phrase:"of choosing myself"},{days:30,label:"1 month",detail:"Liver function significantly improved",phrase:"of quiet strength"},{days:90,label:"3 months",detail:"Brain chemistry rebalancing",phrase:"of becoming"},{days:180,label:"6 months",detail:"Immune system strengthened",phrase:"of a different story"},{days:365,label:"1 year",detail:"Cancer risk begins to drop",phrase:"of a new life"}],
  cannabis:[{days:1,label:"24 hours",detail:"THC levels dropping rapidly",phrase:"of choosing clarity"},{days:3,label:"3 days",detail:"Sleep begins to normalize",phrase:"of pushing through"},{days:7,label:"1 week",detail:"Lung function improving",phrase:"of showing up"},{days:30,label:"1 month",detail:"Memory and focus sharper",phrase:"of choosing myself"},{days:90,label:"3 months",detail:"Motivation and mood stable",phrase:"of quiet strength"},{days:180,label:"6 months",detail:"Cognitive function restored",phrase:"of a different story"},{days:365,label:"1 year",detail:"Anxiety and depression risks reduced",phrase:"of a new life"}],
  hard_drugs:[{days:1,label:"24 hours",detail:"Acute withdrawal beginning",phrase:"of choosing yourself"},{days:3,label:"72 hours",detail:"Most intense withdrawal phase",phrase:"of fighting through"},{days:7,label:"1 week",detail:"Physical withdrawal easing",phrase:"of showing up"},{days:14,label:"2 weeks",detail:"Energy slowly returning",phrase:"of reclaiming energy"},{days:30,label:"1 month",detail:"Dopamine system beginning recovery",phrase:"of quiet strength"},{days:90,label:"3 months",detail:"Cravings significantly reduced",phrase:"of becoming"},{days:180,label:"6 months",detail:"Brain chemistry stabilizing",phrase:"of a different story"},{days:365,label:"1 year",detail:"Major neurological healing milestone",phrase:"of a new life"}],
  narcotics:[{days:1,label:"24 hours",detail:"Withdrawal symptoms starting",phrase:"of choosing yourself"},{days:3,label:"3 days",detail:"Peak withdrawal intensity",phrase:"of fighting through"},{days:7,label:"1 week",detail:"Physical symptoms easing",phrase:"of showing up"},{days:14,label:"2 weeks",detail:"Sleep improving",phrase:"of reclaiming yourself"},{days:30,label:"1 month",detail:"Pain sensitivity normalizing",phrase:"of quiet strength"},{days:90,label:"3 months",detail:"Opioid receptors recovering",phrase:"of becoming"},{days:180,label:"6 months",detail:"Mood stability improving",phrase:"of a different story"},{days:365,label:"1 year",detail:"Risk of relapse drops significantly",phrase:"of a new life"}],
  hallucinogens:[{days:1,label:"24 hours",detail:"Acute effects clearing",phrase:"of choosing clarity"},{days:3,label:"3 days",detail:"Perception stabilizing",phrase:"of grounding yourself"},{days:7,label:"1 week",detail:"Anxiety and paranoia easing",phrase:"of showing up"},{days:14,label:"2 weeks",detail:"Sleep quality improving",phrase:"of choosing myself"},{days:30,label:"1 month",detail:"HPPD risk assessment window",phrase:"of quiet strength"},{days:90,label:"3 months",detail:"Serotonin system stabilizing",phrase:"of becoming"},{days:180,label:"6 months",detail:"Psychological integration",phrase:"of a different story"},{days:365,label:"1 year",detail:"Sustained mental clarity",phrase:"of a new life"}],
  nicotine:[{days:1,label:"24 hours",detail:"Carbon monoxide levels drop to normal",phrase:"of breathing cleaner"},{days:3,label:"3 days",detail:"Nicotine fully cleared from your body",phrase:"of pushing through"},{days:7,label:"1 week",detail:"Taste and smell begin to improve",phrase:"of choosing yourself"},{days:14,label:"2 weeks",detail:"Circulation and lung function improving",phrase:"of showing up"},{days:30,label:"1 month",detail:"Coughing and breathlessness reduce",phrase:"of quiet strength"},{days:90,label:"3 months",detail:"Lung function up by up to 10%",phrase:"of becoming"},{days:180,label:"6 months",detail:"Withdrawal symptoms largely gone",phrase:"of a different story"},{days:365,label:"1 year",detail:"Heart disease risk halved",phrase:"of a new life"}],
  inhalants:[{days:1,label:"24 hours",detail:"Acute intoxication clearing",phrase:"of choosing clarity"},{days:3,label:"3 days",detail:"Brain fog beginning to lift",phrase:"of pushing through"},{days:7,label:"1 week",detail:"Coordination beginning to stabilise",phrase:"of showing up"},{days:14,label:"2 weeks",detail:"Mood beginning to regulate",phrase:"of reclaiming yourself"},{days:30,label:"1 month",detail:"Neurological recovery underway",phrase:"of quiet strength"},{days:90,label:"3 months",detail:"Cognitive function improving",phrase:"of becoming"},{days:180,label:"6 months",detail:"Organ stress reducing significantly",phrase:"of a different story"},{days:365,label:"1 year",detail:"Major neurological healing milestone",phrase:"of a new life"}],
  gambling:[{days:1,label:"24 hours",detail:"Urge to chase losses fading",phrase:"of choosing yourself"},{days:3,label:"3 days",detail:"Anxiety and restlessness peaking",phrase:"of pushing through"},{days:7,label:"1 week",detail:"Financial clarity starting to return",phrase:"of showing up"},{days:14,label:"2 weeks",detail:"Sleep and mood beginning to stabilise",phrase:"of reclaiming control"},{days:30,label:"1 month",detail:"Dopamine system beginning to rebalance",phrase:"of quiet strength"},{days:90,label:"3 months",detail:"Urges significantly reduced",phrase:"of becoming"},{days:180,label:"6 months",detail:"Relationships and finances rebuilding",phrase:"of a different story"},{days:365,label:"1 year",detail:"A full year of financial and mental recovery",phrase:"of a new life"}],
  porn:[{days:1,label:"24 hours",detail:"Dopamine reset begins",phrase:"of choosing yourself"},{days:3,label:"3 days",detail:"Urges peak - stay strong",phrase:"of pushing through"},{days:7,label:"1 week",detail:"Dopamine sensitivity improving",phrase:"of showing up"},{days:14,label:"2 weeks",detail:"Mood and focus lifting",phrase:"of choosing myself"},{days:30,label:"1 month",detail:"Reward circuitry healing",phrase:"of quiet strength"},{days:90,label:"90 days",detail:"Classic reboot milestone",phrase:"of becoming"},{days:180,label:"6 months",detail:"Confidence and motivation restored",phrase:"of a different story"},{days:365,label:"1 year",detail:"New relationship with intimacy",phrase:"of a new life"}],
};

const TIPS = {
  alcohol:["Try sparkling water with lime as a ritual replacement.","Avoid keeping alcohol at home.","Find an AA meeting near you.","Tell a trusted friend about your goal.","Cravings peak at 3-5 minutes - ride it out."],
  cannabis:["Replace the habit with a walk or workout.","Keep your hands busy - drawing, cooking, puzzles.","Drink more water - dehydration worsens cravings.","Change your routine for the first 30 days.","Identify your trigger cues and avoid them early."],
  hard_drugs:["Seek professional medical support.","Remove all paraphernalia from your environment today.","Consider a formal treatment program.","Exercise releases dopamine naturally.","Stay around trusted people as much as possible."],
  narcotics:["Medical supervision is strongly recommended.","Talk to your doctor about MAT.","Narcotics Anonymous has helped millions.","Build a daily routine to reduce idle time.","Keep a list of reasons and read it when cravings hit."],
  hallucinogens:["Grounding exercises help - try 5-4-3-2-1.","Journal your thoughts regularly.","Avoid cannabis and alcohol - they can re-trigger effects.","Spend time in nature to support mental reset.","Structure your days - idle time makes urges worse."],
  nicotine:["Use a nicotine replacement - patch, gum, or lozenge.","Identify your smoking triggers: coffee, stress, after meals.","The craving will peak and pass within 5 minutes.","Keep your hands busy - a pen, stress ball, or gum.","Deep breathing mimics smoking and genuinely calms."],
  inhalants:["Seek professional medical support.","Remove all access to inhalant substances immediately.","Go outside - fresh air is a direct counter to the urge.","Stay around people you trust.","Contact a specialist helpline for dedicated support."],
  gambling:["Block gambling sites and apps - Gamban is a good tool.","Tell your bank to block gambling transactions.","Remove all betting apps from every device.","Gamblers Anonymous has helped millions.","Give a trusted person temporary oversight of your finances."],
  porn:["Install a content blocker on all devices.","Delete apps and bookmarks that create easy access.","Find an accountability partner and check in daily.","When urges hit, get up and go to a different room.","Replace trigger time slots with exercise or a cold shower."],
};

const SLIP_MESSAGES = [
  "Most people slip several times before it sticks. This moment does not define you - what you do next does.",
  "Every person who has ever succeeded at this has also been exactly where you are right now.",
  "A slip is data, not a verdict. You now know something new about what is hard for you.",
  "You came back here. That matters more than you know.",
  "Recovery is not a straight line. The fact that you are here means you have not given up.",
];

const CHECKIN_EMOTIONS = ["Good","Okay","Struggling","Anxious","Tired","Strong","Hopeful","Low"];
const EMOTIONS = ["Stressed","Anxious","Bored","Lonely","Happy","Angry","Sad","Tired","Excited","Overwhelmed","Frustrated","Restless","Depressed","Hopeful","Ashamed","Numb","Irritable","Confident","Grieving","Relieved"];
const SITUATIONS = ["At home alone","At home with others","At work","After an argument","At a social event","After a meal","Watching TV or scrolling","Passing a trigger location","After bad news","Feeling financially stressed","After sex or intimacy","After exercise","In the car","Waiting around","At a party or bar","After a good day","After a hard day","Celebrating something","Feeling unwell","In physical pain","Bored with nothing to do","After seeing someone use","Triggered by a smell or sound","Late at night","First thing in the morning"];
const TIMES = ["Morning (6-12)","Afternoon (12-6)","Evening (6-10)","Late night (10-2)"];
const NOTIF_MESSAGES = ["How are you doing today?","Your daily reminder is here","Take a moment for yourself"];
const TOD_OFFSETS = {"Early morning (6am)":6,"Morning (9am)":9,"Afternoon (12pm)":12,"Evening (6pm)":18,"Late night (11pm)":23};
const MOOD_COLORS = {Good:"#4caf82",Strong:"#4caf82",Hopeful:"#7ecba1",Okay:"#9b93b8",Tired:"#9b93b8",Anxious:"#e0a85c",Stressed:"#e0a85c",Overwhelmed:"#e0a85c",Frustrated:"#e05c6a",Angry:"#e05c6a",Lonely:"#e05c6a",Sad:"#e05c6a",Low:"#e05c6a",Struggling:"#e05c6a"};

function getTimeNote() {
  const h = new Date().getHours();
  if (h >= 22 || h < 4) return "It's late and it's hard. You reached out - that's the right move.";
  if (h < 9) return "Starting the day is one of the hardest moments. You're already doing the right thing.";
  if (h < 17) return "Something triggered this. Let's slow it down together.";
  return "Evenings can be the toughest. You don't have to white-knuckle this alone.";
}

const BASE_DIST = {
  alcohol:["Take 10 slow breaths. In 4, hold 4, out 6.","Pour yourself a cold sparkling water.","Splash cold water on your face.","Name 5 things you see, 4 you touch, 3 you hear.","Set a 10-minute timer. Reassess after.","Write down exactly what you are feeling.","Chew gum - oral fixation is part of the habit loop.","Make a cup of tea slowly.","Do 20 jumping jacks.","Eat something - hunger amplifies cravings.","Look up the AA meeting nearest to you.","Read one recovery story online."],
  cannabis:["Take a cold shower.","Do 20 jumping jacks.","Make a cup of herbal tea.","Watch one funny video. Two minutes.","Eat a snack.","Write down what you planned to do with a clear head.","Clean one small thing.","Drink a full glass of water slowly.","Name what you are actually feeling under the craving.","Do a 5-minute body scan.","Doodle or sketch anything.","Put on a playlist that lifts your mood."],
  hard_drugs:["Ground yourself: name 5 things you can see.","Drink water and eat something.","Go to a public place.","This feeling peaks and passes within 15 minutes.","Do 10 slow pushups.","Write a letter to yourself from 6 months sober.","Hold ice cubes for 30 seconds.","Breathe in 4, hold 7, out 8. Repeat 4 times.","Put on a long YouTube video.","Open a recovery forum and read someone's story.","Remind yourself: using will cost more than not using.","Write down three things that are better today."],
  narcotics:["Practice the 5-4-3-2-1 grounding technique.","Take a cold shower.","Write down what you would lose if you used right now.","Eat something - even crackers.","Slow breathing: 4 in, hold 4, 4 out. Repeat 3 minutes.","Change your environment immediately.","Cravings are a wave. They rise, peak, and break.","Hold something cold and focus on the sensation.","Journal for 5 minutes about what triggered this.","Look at your streak. That is proof you can do this.","Call a NA helpline.","Do something with your hands: cook, clean, fold."],
  hallucinogens:["Focus on one steady calming object in the room.","Listen to familiar music.","Eat something substantial.","Breathe slowly. This feeling is temporary.","Run cold water over your hands.","Name 5 physical things you can touch right now.","Write down what you are thinking.","Avoid screens.","Do slow stretches or lie flat and breathe.","Count backwards from 100 by 7s.","Go outside into sunlight.","Put on a nature documentary."],
  nicotine:["Take 10 slow deep breaths.","Drink a full glass of cold water.","Chew gum or suck on a mint.","The craving peaks and passes in under 5 minutes. Time it.","Do 15 push-ups or squats.","Go outside and take a short walk.","Hold a pen or stress ball.","Brush your teeth.","Eat a healthy snack.","Write down one reason you are quitting.","Put on a short podcast or song.","The nicotine is already out of your body. This is just habit."],
  inhalants:["Get outside immediately.","Drink water and eat something.","Call someone you trust.","Ground yourself: name 5 things you can see.","Slow deep breathing: in 4, hold 4, out 6.","Go to a public place.","Write down what you are feeling.","Every day clean is real neurological healing.","Put on something absorbing.","Hold something cold and focus on it.","Take a cold shower.","Reach out to a support line."],
  gambling:["Block the app or site right now.","Call someone you trust.","Write down how much the last session cost you.","Do something physical immediately.","The house always wins. Every session ends the same way.","Put on a long video or podcast.","Go somewhere you cannot gamble.","Text your Gamblers Anonymous sponsor.","Write down three things you could do with the money.","Take a cold shower.","Breathe slowly: in 4, hold 4, out 6.","Read your own reasons for starting this streak."],
  porn:["Close all tabs and put your phone in another room.","Do 15 push-ups or squats.","Write: what triggered this?","Take a cold shower.","Go to a public space.","Put on a podcast or audiobook.","Look at your streak.","Do the 5-4-3-2-1 grounding technique.","Make a meal or snack.","Read something long-form.","Write a letter to your future self.","Name 3 things you want to do with your energy instead."],
};

function buildDistractions(addId, profile, ec) {
  const has = k => profile[k] === "Yes";
  const p = [];
  if (ec?.name) p.push(`Reach out to ${ec.name} right now - you do not have to explain anything.`);
  const lookup = (map) => map[addId] || map.alcohol;
  if (has("partner")) p.push(lookup({alcohol:"Text your partner - just thinking of you.",cannabis:"Call your partner and have a real conversation.",hard_drugs:"Reach out to your partner.",narcotics:"Text your partner. You do not need to explain.",hallucinogens:"Call your partner and focus on their voice.",nicotine:"Tell your partner you are struggling right now.",inhalants:"Reach out to your partner immediately.",gambling:"Call your partner - not to confess, just to connect.",porn:"Go spend time with your partner."}));
  if (has("children")) p.push(lookup({alcohol:"Go check on your kids.",cannabis:"Spend 10 minutes with your children.",hard_drugs:"Think of your children's faces. Write down one thing you want to give them.",narcotics:"Your kids need you present. Go be near them.",hallucinogens:"Being around your children grounds you.",nicotine:"Think of your children. Write one thing you want to be healthy for.",inhalants:"Your children need you present and well.",gambling:"Think about what that money means for your children's future.",porn:"Your children are the reason. Write one way to show up for them."}));
  if (has("pets")) p.push(lookup({alcohol:"Go find your pet. Pet them for 2 minutes.",cannabis:"Take your pet for a walk or just sit with them.",hard_drugs:"Your pet needs you. Go sit beside them.",narcotics:"Spend 5 minutes with your pet.",hallucinogens:"Sit with your pet and focus on them.",nicotine:"Go sit with your pet.",inhalants:"Go be with your pet right now.",gambling:"Spend 5 minutes with your pet.",porn:"Go give your pet some attention."}));
  if (has("outdoor_access")) p.push(lookup({alcohol:"Go outside right now. Even 5 minutes changes your brain state.",cannabis:"Step outside - sunlight and air are free dopamine.",hard_drugs:"Go outside and walk around the block.",narcotics:"Get outside immediately.",hallucinogens:"Go outside into natural light.",nicotine:"Go outside and walk - do not stand still.",inhalants:"Fresh air outside is the most direct counter to this urge.",gambling:"Get outside and walk.",porn:"Go for a walk outside."}));
  if (has("exercise_habit")) p.push(lookup({alcohol:"You exercise - go do it. Even 10 minutes shifts your brain chemistry.",cannabis:"Hit a workout.",hard_drugs:"Get moving - a run, a lift, anything.",narcotics:"Use your exercise habit right now.",hallucinogens:"Do a workout or brisk walk.",nicotine:"Go exercise. Your lungs are recovering - use them.",inhalants:"Use your exercise habit right now.",gambling:"Go work out.",porn:"Go exercise."}));
  if (has("faith")) p.push(lookup({alcohol:"Say a short prayer or sit in quiet reflection.",cannabis:"Take a moment for spiritual grounding.",hard_drugs:"Lean into your faith right now.",narcotics:"Spiritual grounding can carry you through.",hallucinogens:"Quiet spiritual reflection can steady you.",nicotine:"Take a moment for prayer or quiet reflection.",inhalants:"Lean into your faith right now.",gambling:"Pray or sit in quiet reflection.",porn:"Reconnect with your values through prayer or reflection."}));
  if (has("social_network")) p.push(lookup({alcohol:"Call a close friend right now.",cannabis:"Text or call someone you trust.",hard_drugs:"Call someone in your network immediately.",narcotics:"Reach out to a friend or family member now.",hallucinogens:"Call someone grounded you trust completely.",nicotine:"Text a friend right now.",inhalants:"Call someone you trust immediately.",gambling:"Call someone you trust.",porn:"Text your accountability partner right now."}));
  if (has("employed")) p.push(lookup({alcohol:"Think about tomorrow morning. Write one thing you want to show up for.",cannabis:"Open a work task for 10 minutes.",hard_drugs:"Your job is something real to hold onto.",narcotics:"Think about the version of you that shows up to work clear.",hallucinogens:"Focus on a work task for 10 minutes.",nicotine:"Think about how much better you will feel at work tomorrow.",inhalants:"Your job is worth protecting.",gambling:"Think about financial stability. Write one concrete goal.",porn:"Open a work task right now."}));
  return [...p, ...(BASE_DIST[addId] || BASE_DIST.alcohol)].slice(0, 20);
}

const pad = n => String(n).padStart(2, "0");
function getElapsed(sd) {
  const s = Math.floor(Math.max(0, Date.now() - new Date(sd).getTime()) / 1000);
  return { days: Math.floor(s/86400), hrs: Math.floor(s/3600)%24, mins: Math.floor(s/60)%60, secs: s%60, totalSecs: s };
}
const isSunday = () => new Date().getDay() === 0;
function getWeekKey() { const d = new Date(), s = new Date(d); s.setDate(d.getDate()-d.getDay()); return s.toDateString(); }

const C = {
  bg:"#12101a", surface:"#1c1826", surfaceHigh:"#241f33",
  border:"rgba(139,110,255,0.15)", borderMid:"rgba(139,110,255,0.3)",
  purple:"#9d85ff", purpleFaint:"rgba(157,133,255,0.08)", purpleMid:"rgba(157,133,255,0.25)",
  purpleGlow:"rgba(157,133,255,0.2)",
  textPrimary:"#f0ecff", textSecondary:"#9b93b8", textMuted:"#8b85a8",
  success:"#4caf82", successBg:"rgba(76,175,130,0.12)",
  danger:"#e05c6a", dangerBg:"rgba(224,92,106,0.12)",
  amber:"#e0a85c", infoBg:"rgba(157,133,255,0.12)",
};

const T = {
  radius: { sm:10, md:14, lg:20, pill:999 },
  pad:    { compact:"0.9rem", base:"1.25rem 1.5rem", roomy:"1.75rem 2rem" },
  icon:   { sm:14, md:18, lg:24 },
  label:  { eyebrow:11, helper:13, body:14 },
};

const S = {
  app: { fontFamily:"'Outfit', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth:680, margin:"0 auto", padding:"1.25rem 1rem 7rem", color:C.textPrimary },
  nav: { display:"flex", marginBottom:"1.5rem", borderBottom:`1px solid ${C.border}`, overflowX:"auto" },
  card: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"1.25rem 1.5rem", marginBottom:14, boxShadow:"0 2px 8px rgba(0,0,0,0.35)" },
  cardHigh: { background:C.surfaceHigh, border:`1px solid ${C.borderMid}`, borderRadius:16, padding:"1.25rem 1.5rem", marginBottom:14, boxShadow:"0 2px 12px rgba(0,0,0,0.4)" },
  metric: { background:C.surfaceHigh, borderRadius:12, padding:"1rem", textAlign:"center", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.04)" },
  label: { fontSize:13, color:C.textSecondary, marginBottom:6, display:"block" },
  inp: { width:"100%", fontSize:14, padding:"11px 14px", borderRadius:10, border:`1px solid ${C.border}`, background:C.surfaceHigh, color:C.textPrimary, boxSizing:"border-box", outline:"none", transition:"border-color 0.15s" },
  sel: { width:"100%", fontSize:14, padding:"11px 14px", borderRadius:10, border:`1px solid ${C.border}`, background:C.surfaceHigh, color:C.textPrimary, boxSizing:"border-box", outline:"none", transition:"border-color 0.15s" },
  btnP: { padding:"13px 20px", borderRadius:12, fontSize:14, cursor:"pointer", fontWeight:600, border:"none", background:C.purple, color:"#fff", width:"100%", marginTop:8, letterSpacing:"0.01em", transition:"opacity 0.15s", boxShadow:"0 2px 12px rgba(139,110,255,0.3)" },
  btnS: { padding:"12px 20px", borderRadius:12, fontSize:14, cursor:"pointer", fontWeight:400, border:`1px solid ${C.border}`, background:"transparent", color:C.textSecondary, width:"100%", marginTop:8, transition:"border-color 0.15s, color 0.15s" },
  btnD: { padding:"12px 20px", borderRadius:12, fontSize:14, cursor:"pointer", fontWeight:400, border:"1px solid rgba(224,92,106,0.3)", background:"transparent", color:C.danger, width:"100%", marginTop:8 },
  h2: { fontSize:15, fontWeight:600, marginBottom:14, marginTop:0, color:C.textPrimary, letterSpacing:"-0.01em" },
  muted: { color:C.textSecondary, fontSize:13, lineHeight:1.6 },
  fbar: { position:"fixed", bottom:0, left:0, right:0, padding:"14px 20px calc(14px + env(safe-area-inset-bottom, 4px))", background:"rgba(28,24,38,0.85)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderTop:`1px solid ${C.borderMid}`, zIndex:100 },
  fbtn: { width:"100%", maxWidth:680, margin:"0 auto", display:"block", padding:"20px 24px", borderRadius:T.radius.md, fontSize:17, cursor:"pointer", fontWeight:600, border:"none", background:C.purple, color:"#fff", boxShadow:"0 6px 28px rgba(139,110,255,0.5), 0 2px 8px rgba(139,110,255,0.3)", letterSpacing:"0.01em" },
  badge: t => { const m = {success:{bg:C.successBg,c:C.success},danger:{bg:C.dangerBg,c:C.danger},info:{bg:C.infoBg,c:C.purple}}[t]||{bg:C.infoBg,c:C.purple}; return { display:"inline-block", fontSize:11, padding:"4px 11px", borderRadius:20, background:m.bg, color:m.c, fontWeight:600 }; },
  navBtn: a => ({ padding:"13px 16px", fontSize:13, border:"none", background:"none", cursor:"pointer", whiteSpace:"nowrap", color:a?C.textPrimary:C.textSecondary, borderBottom:a?`2px solid ${C.purple}`:"2px solid transparent", fontWeight:a?600:400, marginBottom:-1, transition:"color 0.15s" }),
};

const globalCss = `
  @keyframes pp{0%,100%{box-shadow:0 6px 28px rgba(139,110,255,0.5),0 2px 8px rgba(139,110,255,0.3),0 0 0 0 rgba(157,133,255,0.5)}50%{box-shadow:0 6px 28px rgba(139,110,255,0.5),0 2px 8px rgba(139,110,255,0.3),0 0 0 22px rgba(157,133,255,0)}}
  @keyframes br{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
  @keyframes fi{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
  @keyframes fu{0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1}}
  @keyframes sd{0%{transform:translateY(-16px);opacity:0}100%{transform:translateY(0);opacity:1}}
  @keyframes fn{0%{opacity:0;transform:translateY(-6px)}15%{opacity:1;transform:translateY(0)}80%{opacity:1}100%{opacity:0}}
  @keyframes breathe{0%{transform:scale(0.6);opacity:0.15}33%{transform:scale(1);opacity:0.4}66%{transform:scale(1);opacity:0.4}100%{transform:scale(0.6);opacity:0.15}}
  @keyframes flash{0%,100%{opacity:0.35}50%{opacity:1}}
  .cbtn{animation:pp 3.5s ease-in-out infinite,br 4.5s ease-in-out infinite;}
  .fi{animation:fi 0.35s cubic-bezier(0.16,1,0.3,1) forwards;}
  .fu{animation:fu 0.45s cubic-bezier(0.16,1,0.3,1) forwards;}
  .sd{animation:sd 0.35s cubic-bezier(0.16,1,0.3,1) forwards;}
  .fn{animation:fn 4s ease forwards;}
  .breathe-circle{animation:breathe 12s ease-in-out infinite;}
  .pad-press{transition:transform 0.1s ease;}
  .pad-press:active{transform:scale(0.95);}
  .pad-flash{animation:flash 0.4s ease;}
  button:active{opacity:0.82;}
  input:focus,select:focus,textarea:focus{border-color:rgba(157,133,255,0.5)!important;}
  button:focus-visible,a:focus-visible{outline:2px solid #9d85ff;outline-offset:2px;border-radius:4px;}
  input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #9d85ff;outline-offset:1px;}
  @media (prefers-reduced-motion: reduce){.breathe-circle,.pad-press,.cbtn,.fi,.fu,.sd,.fn{animation:none!important;transition:none!important;}*{transition:none!important;animation:none!important;}circle{transition:none!important;}}
  select option{background:#1c1826;color:#f0ecff;}
  *{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
  ::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(157,133,255,0.3);border-radius:2px;}
`;

function useDialog(onClose) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape" && typeof onClose === "function") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [onClose]);
}

function Icon({ name, size = 18, color = "currentColor", strokeWidth = 1.7 }) {
  const p = { width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke:color, strokeWidth, strokeLinecap:"round", strokeLinejoin:"round", style:{flexShrink:0}, "aria-hidden":"true", focusable:"false" };
  switch (name) {
    case "alcohol": return <svg {...p}><path d="M6 8h10v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z"/><path d="M16 11h2a2 2 0 0 1 0 4h-2"/><path d="M8 4v3M11 4v3M14 4v3"/></svg>;
    case "cannabis": return <svg {...p}><path d="M12 22V13"/><path d="M12 13c-1.5-2-3.5-2.5-5-2.5C7 13 9 16 12 16"/><path d="M12 13c1.5-2 3.5-2.5 5-2.5C17 13 15 16 12 16"/><path d="M12 13c-2.5-1-3.5-3.5-3.5-6 2.5 0 5 1.5 6 4"/><path d="M12 13c2.5-1 3.5-3.5 3.5-6-2.5 0-5 1.5-6 4"/></svg>;
    case "hard_drugs": return <svg {...p}><rect x="2" y="9" width="20" height="6" rx="3"/><path d="M12 9v6"/></svg>;
    case "narcotics": return <svg {...p}><path d="m18 2 4 4"/><path d="m15 5 4 4"/><path d="M9 11l-3 3 7 7 3-3z"/><path d="M5 19l-2 2"/><path d="M19 9l-3-3"/></svg>;
    case "hallucinogens": return <svg {...p}><path d="M4 12a8 8 0 0 1 16 0c0 1.5-1 2-2 2H6c-1 0-2-.5-2-2z"/><path d="M10 14v8M14 14v8M8 22h8"/><circle cx="9" cy="9" r="0.8" fill={color}/><circle cx="15" cy="10" r="0.8" fill={color}/></svg>;
    case "nicotine": return <svg {...p}><rect x="2" y="11" width="17" height="4" rx="0.5"/><path d="M14 11v4M18 6c1 1 1 3 0 4M21 6c1 1 1 3 0 4"/></svg>;
    case "inhalants": return <svg {...p}><path d="M9 2h6v3H9z"/><path d="M8 5h8l-1 3h-6z"/><path d="M6 8h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z"/></svg>;
    case "gambling": return <svg {...p}><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><circle cx="7" cy="7" r="0.9" fill={color}/><circle cx="17" cy="17" r="0.9" fill={color}/><circle cx="15" cy="15" r="0.6" fill={color}/><circle cx="19" cy="19" r="0.6" fill={color}/></svg>;
    case "porn": return <svg {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="3" x2="21" y2="21"/></svg>;
    default: return null;
  }
}

const DAILY_PROMPTS = [
  "What's one thing you're proud of since starting?",
  "Describe today's craving in one sentence.",
  "Who in your life makes recovery easier?",
  "What would you tell yourself one year ago?",
  "What's a small win you can celebrate today?",
  "What's the strongest emotion you felt today?",
  "If your craving had a voice, what would it say?",
  "What did you say no to today that mattered?",
  "What's one thing your body thanks you for?",
  "What's getting easier than it used to be?",
  "Who would be most proud of you right now?",
  "What's a trigger you handled differently this week?",
  "What does future-you want past-you to know?",
  "What's one moment from today you want to remember?",
  "What did you learn about yourself this week?",
  "What's a craving you didn't expect?",
  "Who can you reach out to when it gets hard?",
  "What does freedom from this look like for you?",
  "What's one identity shift you've noticed?",
  "What's something you can do today that you couldn't a month ago?",
  "What's one fear that's gotten smaller?",
  "What's the kindest thing you can do for yourself today?",
  "What pattern are you starting to see?",
  "What's a story you used to believe that you don't anymore?",
  "What helped you survive your last hard moment?",
  "What's the version of you that you're becoming?",
  "What feels different in your body today?",
  "What's one thing you used to avoid that you can face now?",
  "Who do you forgive today — even just a little?",
  "What's worth protecting in your life right now?",
  "What's one boundary you set this week?",
  "What does showing up for yourself look like today?",
  "What's the smallest step you can take right now?",
  "What's a feeling you've been avoiding?",
  "What does your support system look like?",
  "What's one thing that's worth more than this craving?",
  "Where do you feel cravings in your body?",
  "What's a memory that reminds you why you started?",
  "What time of day is hardest, and why?",
  "What's a place that feels safe for you?",
  "What's one truth you've come to accept?",
  "What's something you're grateful for that wasn't there before?",
  "What does relapse mean to you, and what doesn't it mean?",
  "What's one thing you used to lie about that you don't have to anymore?",
  "What's a piece of advice you'd give someone on day one?",
  "What's an old habit you've replaced with a better one?",
  "What's something you're learning about your triggers?",
  "What does discipline feel like for you today?",
  "What's something you used to need that you don't anymore?",
  "What does your morning routine look like now?",
  "What's the difference between today's you and last month's you?",
  "What's one promise you've kept to yourself?",
  "What's a feeling you've sat with instead of escaping?",
  "What's one thing your future self is grateful for?",
  "What's a craving you walked through and came out stronger?",
  "What does rest look like for you these days?",
  "Who has surprised you with their support?",
  "What's one thing you've stopped explaining or apologizing for?",
  "What does it feel like to be honest with yourself?",
  "What's the bravest thing you did today?",
  "What's one thing about your recovery that's uniquely yours?",
];

function getDailyPrompt() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const day = Math.floor(diff / 86400000);
  return DAILY_PROMPTS[day % DAILY_PROMPTS.length];
}

function getHeroLine(days, best, profile, addLabel) {
  const partner = profile?.partner_name;
  if (days === 0) return { headline: "Today is day one.", sub: "One choice at a time. Right now is the only thing you have to handle." };
  if (days < best && best > 0) return { headline: `Day ${days}.`, sub: `You've been here before. This time you have data on your side${partner ? `, and ${partner}` : ""}.` };
  if (days === best && best > 0) return { headline: `Day ${days}. Tied with your record.`, sub: "Today is uncharted. Whatever happens past midnight is new territory." };
  if (best > 0 && days > best) return { headline: `Day ${days}. New territory.`, sub: "Every hour from here is a new personal best. Keep going." };
  if (days >= 7 && days < 30) return { headline: `Day ${days} clean.`, sub: "Your body is starting to remember what this feels like." };
  if (days >= 30 && days < 90) return { headline: `${days} days strong.`, sub: "This isn't a streak anymore. It's your life." };
  if (days >= 90) return { headline: `${days} days. ${addLabel}-free.`, sub: "You've rewritten what's possible for yourself." };
  return { headline: `Day ${days}.`, sub: "Every second of this streak is yours." };
}

function computeInsights(journal) {
  if (journal.length < 5) return null;
  const timeBuckets = {}, dayStats = {}, emoSlips = {};
  journal.forEach(e => {
    timeBuckets[e.time] = (timeBuckets[e.time] || 0) + 1;
    const d = new Date(e.date).toLocaleDateString("en", { weekday: "long" });
    dayStats[d] = dayStats[d] || { total: 0, slips: 0 };
    dayStats[d].total++;
    if (!e.survived) dayStats[d].slips++;
    if (!e.survived) emoSlips[e.emotion] = (emoSlips[e.emotion] || 0) + 1;
  });
  const peakTime = Object.entries(timeBuckets).sort((a, b) => b[1] - a[1])[0];
  const riskDay = Object.entries(dayStats).sort((a, b) => (b[1].slips/b[1].total) - (a[1].slips/a[1].total))[0];
  const topSlipEmo = Object.entries(emoSlips).sort((a, b) => b[1] - a[1])[0];
  const last7 = journal.filter(e => new Date(e.date).getTime() > Date.now() - 7 * 86400000);
  const prev7 = journal.filter(e => { const t = new Date(e.date).getTime(); return t <= Date.now() - 7 * 86400000 && t > Date.now() - 14 * 86400000; });
  const last7Rate = last7.length ? Math.round(last7.filter(e => e.survived).length / last7.length * 100) : null;
  const prev7Rate = prev7.length ? Math.round(prev7.filter(e => e.survived).length / prev7.length * 100) : null;
  return { peakTime: peakTime?.[0], peakCount: peakTime?.[1], riskDay: riskDay?.[0], riskRate: riskDay ? Math.round(riskDay[1].slips/riskDay[1].total*100) : null, slipEmo: topSlipEmo?.[0], slipCount: topSlipEmo?.[1], last7Rate, prev7Rate };
}

function TapTo100({ onClose }) {
  const [n, setN] = useState(0);
  return (
    <div style={{textAlign:"center",padding:"1rem 0"}}>
      <p style={{fontSize:13,color:C.textSecondary,margin:"0 0 8px"}}>Tap to count. Calm and steady.</p>
      <div style={{fontSize:48,fontWeight:600,color:C.purple,margin:"1.5rem 0",letterSpacing:"-0.02em"}}>{n}</div>
      {n < 100 ? (
        <button onClick={()=>setN(x=>x+1)} className="pad-press" style={{width:160,height:160,borderRadius:"50%",border:`2px solid ${C.purple}`,background:C.purpleFaint,color:C.purple,fontSize:18,cursor:"pointer",fontWeight:600,margin:"0 auto",display:"block"}}>Tap</button>
      ) : (
        <p style={{color:C.success,fontSize:16,fontWeight:500,margin:"2rem 0"}}>You made it to 100. Nice.</p>
      )}
      <button onClick={onClose} style={{...S.btnS,marginTop:18,maxWidth:200,marginLeft:"auto",marginRight:"auto"}}>Back</button>
    </div>
  );
}

function ColorMatch({ onClose }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState("");
  const [opts, setOpts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const colors = ["#9d85ff","#4caf82","#e0a85c","#e05c6a","#5cb8e0","#c47de0","#7de099","#e0d35c"];
  const next = () => {
    const shuffled = [...colors].sort(()=>Math.random()-0.5).slice(0,4);
    setOpts(shuffled);
    setTarget(shuffled[Math.floor(Math.random()*4)]);
    setFeedback(null);
  };
  useEffect(() => { next(); }, []);
  const pick = c => {
    const right = c === target;
    setFeedback(right ? "✓" : "✗");
    if (right) setScore(s=>s+1);
    setTimeout(()=>{ if (round < 9) { setRound(r=>r+1); next(); } else setRound(10); }, 600);
  };
  if (round >= 10) return (
    <div style={{textAlign:"center",padding:"1.5rem 0"}}>
      <p style={{fontSize:14,color:C.textSecondary,marginBottom:8}}>You got</p>
      <div style={{fontSize:48,fontWeight:600,color:C.purple,letterSpacing:"-0.02em"}}>{score}<span style={{fontSize:24,color:C.textMuted}}>/10</span></div>
      <button onClick={onClose} style={{...S.btnS,marginTop:18,maxWidth:200,marginLeft:"auto",marginRight:"auto"}}>Back</button>
    </div>
  );
  return (
    <div style={{textAlign:"center",padding:"0.5rem 0"}}>
      <p style={{fontSize:12,color:C.textMuted,margin:"0 0 8px"}}>Round {round+1} of 10 · Score {score}</p>
      <p style={{fontSize:13,color:C.textSecondary,margin:"0 0 12px"}}>Tap the matching color</p>
      <div style={{width:80,height:80,borderRadius:16,background:target,margin:"0 auto 18px"}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:240,margin:"0 auto"}}>
        {opts.map((c,i) => <button key={i} onClick={()=>pick(c)} className="pad-press" style={{height:64,borderRadius:12,background:c,border:"none",cursor:"pointer"}}/>)}
      </div>
      {feedback && <div style={{fontSize:24,marginTop:14,color:feedback==="✓"?C.success:C.danger}}>{feedback}</div>}
      <button onClick={onClose} style={{...S.btnS,marginTop:18,maxWidth:200,marginLeft:"auto",marginRight:"auto"}}>Back</button>
    </div>
  );
}

function PatternTap({ onClose }) {
  const [seq, setSeq] = useState([]);
  const [userIdx, setUserIdx] = useState(0);
  const [showing, setShowing] = useState(false);
  const [active, setActive] = useState(null);
  const [level, setLevel] = useState(0);
  const [over, setOver] = useState(false);
  const colors = [C.purple, C.success, C.amber, C.danger];
  const playSeq = useCallback((s) => {
    setShowing(true); setUserIdx(0);
    s.forEach((p, i) => {
      setTimeout(()=>setActive(p), 700*i + 200);
      setTimeout(()=>setActive(null), 700*i + 600);
    });
    setTimeout(()=>setShowing(false), 700*s.length + 400);
  }, []);
  const startNext = () => {
    const newSeq = [...seq, Math.floor(Math.random()*4)];
    setSeq(newSeq); setLevel(newSeq.length); playSeq(newSeq);
  };
  useEffect(() => { startNext(); }, []);
  const tap = i => {
    if (showing || over) return;
    setActive(i); setTimeout(()=>setActive(null), 200);
    if (seq[userIdx] !== i) { setOver(true); return; }
    if (userIdx + 1 === seq.length) { setTimeout(startNext, 600); } else setUserIdx(x=>x+1);
  };
  if (over) return (
    <div style={{textAlign:"center",padding:"1.5rem 0"}}>
      <p style={{fontSize:14,color:C.textSecondary,marginBottom:8}}>You reached</p>
      <div style={{fontSize:48,fontWeight:600,color:C.purple,letterSpacing:"-0.02em"}}>Level {level}</div>
      <button onClick={()=>{setSeq([]);setOver(false);setLevel(0);setTimeout(startNext,200);}} style={{...S.btnP,marginTop:18,maxWidth:200,marginLeft:"auto",marginRight:"auto"}}>Try again</button>
      <button onClick={onClose} style={{...S.btnS,marginTop:8,maxWidth:200,marginLeft:"auto",marginRight:"auto"}}>Back</button>
    </div>
  );
  return (
    <div style={{textAlign:"center",padding:"0.5rem 0"}}>
      <p style={{fontSize:12,color:C.textMuted,margin:"0 0 6px"}}>Level {level} · {showing ? "Watch" : "Repeat"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:240,margin:"14px auto 0"}}>
        {[0,1,2,3].map(i => (
          <button key={i} onClick={()=>tap(i)} className="pad-press" style={{height:80,borderRadius:14,background:colors[i],border:"none",cursor:showing?"default":"pointer",opacity:active===i?1:0.35,transition:"opacity 0.15s"}}/>
        ))}
      </div>
      <button onClick={onClose} style={{...S.btnS,marginTop:18,maxWidth:200,marginLeft:"auto",marginRight:"auto"}}>Back</button>
    </div>
  );
}

const StreakCounter = memo(function SC({ startDate, isLongest, best, dailyCost }) {
  const [, setT] = useState(0);
  useEffect(() => { const iv = setInterval(() => setT(n => n+1), 1000); return () => clearInterval(iv); }, []);
  if (!startDate) return null;
  const e = getElapsed(startDate);
  const ms = dailyCost && parseFloat(dailyCost) > 0 ? (e.days * parseFloat(dailyCost)).toFixed(2) : null;
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}}>
        {[{v:e.days,l:"Days"},{v:pad(e.hrs),l:"Hours"},{v:pad(e.mins),l:"Mins"},{v:pad(e.secs),l:"Secs"}].map(it => (
          <div key={it.l} style={{...S.metric,padding:isLongest?"1.1rem 0.5rem":"0.8rem 0.5rem"}}>
            <div style={{fontSize:isLongest?32:26,fontWeight:600,color:C.purple,lineHeight:1.1,letterSpacing:"-0.02em"}}>{it.v}</div>
            <div style={{fontSize:11,color:C.textMuted,marginTop:5,textTransform:"uppercase",letterSpacing:"0.08em"}}>{it.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <div style={{...S.metric,flex:1,padding:"0.75rem"}}>
          <div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Best streak</div>
          <div style={{fontSize:15,fontWeight:500,color:C.purple,marginTop:3}}>{Math.max(e.days,best)} days</div>
        </div>
        {ms && (
          <div style={{...S.metric,flex:1,padding:"0.75rem"}}>
            <div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Saved</div>
            <div style={{fontSize:15,fontWeight:500,color:C.success,marginTop:3}}>${parseFloat(ms).toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
});

function MilestoneCard({ days, phrase, onClose }) {
  useDialog(onClose);
  return (
    <div className="fi" role="dialog" aria-modal="true" aria-label={`${days} day milestone`} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div style={{width:"100%",maxWidth:360,borderRadius:24,overflow:"hidden",position:"relative",background:"#0e0b18",border:`1px solid ${C.borderMid}`}}>
        <svg viewBox="0 0 360 420" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
          <defs>
            <radialGradient id="rg1" cx="20%" cy="20%"><stop offset="0%" stopColor="#8b6eff" stopOpacity="0.25"/><stop offset="100%" stopColor="#0e0b18" stopOpacity="0"/></radialGradient>
            <radialGradient id="rg2" cx="80%" cy="80%"><stop offset="0%" stopColor="#6b4fd4" stopOpacity="0.2"/><stop offset="100%" stopColor="#0e0b18" stopOpacity="0"/></radialGradient>
          </defs>
          <rect width="360" height="420" fill="#0e0b18"/>
          <rect width="360" height="420" fill="url(#rg1)"/>
          <rect width="360" height="420" fill="url(#rg2)"/>
          {[0,1,2,3,4,5,6,7,8].map(i=><line key={`v${i}`} x1={i*45} y1="0" x2={i*45} y2="420" stroke="rgba(139,110,255,0.04)" strokeWidth="1"/>)}
          {[0,1,2,3,4,5,6,7,8,9].map(i=><line key={`h${i}`} x1="0" y1={i*47} x2="360" y2={i*47} stroke="rgba(139,110,255,0.04)" strokeWidth="1"/>)}
          <circle cx="300" cy="60" r="80" fill="none" stroke="rgba(139,110,255,0.08)" strokeWidth="1"/>
          <circle cx="300" cy="60" r="55" fill="none" stroke="rgba(139,110,255,0.06)" strokeWidth="1"/>
          <circle cx="60" cy="360" r="100" fill="none" stroke="rgba(139,110,255,0.06)" strokeWidth="1"/>
          <circle cx="60" cy="360" r="70" fill="none" stroke="rgba(139,110,255,0.04)" strokeWidth="1"/>
          {[[40,40],[320,180],[180,30],[80,200],[280,380],[150,390]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.5" fill="rgba(139,110,255,0.3)"/>)}
        </svg>
        <div style={{position:"relative",zIndex:1,padding:"3rem 2rem",textAlign:"center"}}>
          <div style={{fontSize:88,fontWeight:700,color:"#fff",lineHeight:1,letterSpacing:"-2px",marginBottom:4}}>{days}</div>
          <div style={{fontSize:15,color:"rgba(139,110,255,0.9)",fontWeight:500,marginBottom:8}}>days</div>
          <div style={{width:40,height:1,background:"rgba(139,110,255,0.4)",margin:"1.2rem auto"}}/>
          <div style={{fontSize:17,color:"rgba(240,236,255,0.85)",fontWeight:400,lineHeight:1.5}}>{phrase}</div>
          <div style={{marginTop:"2.5rem",fontSize:11,color:"rgba(139,110,255,0.4)",letterSpacing:"0.12em",textTransform:"uppercase"}}>one day at a time</div>
        </div>
      </div>
      <p style={{color:C.textMuted,fontSize:13,marginTop:16,textAlign:"center"}}>Screenshot to save your card</p>
      <button onClick={onClose} style={{...S.btnP,maxWidth:360,marginTop:12}}>Done</button>
    </div>
  );
}

function OnboardingCard({ onDone }) {
  useDialog(onDone);
  return (
    <div className="fi" role="dialog" aria-modal="true" aria-label="Welcome — getting started" style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:210,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div style={{width:"100%",maxWidth:360,borderRadius:24,overflow:"hidden",position:"relative",background:"#0e0b18",border:`1px solid ${C.borderMid}`}}>
        <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
          <defs>
            <radialGradient id="og1" cx="80%" cy="10%"><stop offset="0%" stopColor="#8b6eff" stopOpacity="0.2"/><stop offset="100%" stopColor="#0e0b18" stopOpacity="0"/></radialGradient>
            <radialGradient id="og2" cx="20%" cy="90%"><stop offset="0%" stopColor="#6b4fd4" stopOpacity="0.15"/><stop offset="100%" stopColor="#0e0b18" stopOpacity="0"/></radialGradient>
          </defs>
          <rect width="360" height="480" fill="#0e0b18"/>
          <rect width="360" height="480" fill="url(#og1)"/>
          <rect width="360" height="480" fill="url(#og2)"/>
          {[0,1,2,3,4,5,6,7,8].map(i=><line key={`v${i}`} x1={i*45} y1="0" x2={i*45} y2="480" stroke="rgba(139,110,255,0.03)" strokeWidth="1"/>)}
          {[0,1,2,3,4,5,6,7,8,9,10].map(i=><line key={`h${i}`} x1="0" y1={i*48} x2="360" y2={i*48} stroke="rgba(139,110,255,0.03)" strokeWidth="1"/>)}
          <circle cx="300" cy="60" r="70" fill="none" stroke="rgba(139,110,255,0.07)" strokeWidth="1"/>
          <circle cx="60" cy="400" r="90" fill="none" stroke="rgba(139,110,255,0.05)" strokeWidth="1"/>
          {[[40,40],[320,200],[180,20],[80,260],[280,430]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.5" fill="rgba(139,110,255,0.25)"/>)}
        </svg>
        <div style={{position:"relative",zIndex:1,padding:"2.5rem 2rem 2rem"}}>
          <p style={{fontSize:11,color:"rgba(139,110,255,0.6)",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 12px"}}>welcome</p>
          <p style={{fontSize:22,fontWeight:600,color:"#fff",margin:"0 0 8px",lineHeight:1.3}}>Here's how to get the most out of this</p>
          <div style={{width:36,height:1,background:"rgba(139,110,255,0.4)",margin:"16px 0"}}/>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {[
              {n:"1",t:"Tap 'I'm craving' the moment you feel it",d:"The button is always at the bottom. Don't wait - tap it the second something pulls at you."},
              {n:"2",t:"Log after every craving",d:"The more you capture, the clearer your patterns become. Insights unlock after just 3 entries."},
              {n:"3",t:"Slipping doesn't erase your streak",d:"If you slip, use the 'I slipped' button. Your longest streak is always preserved. Recovery isn't linear."},
            ].map(item => (
              <div key={item.n} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(139,110,255,0.15)",border:"1px solid rgba(139,110,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"rgba(139,110,255,0.9)",fontWeight:600,flexShrink:0,marginTop:1}}>{item.n}</div>
                <div>
                  <p style={{fontSize:13,fontWeight:500,color:"rgba(240,236,255,0.9)",margin:"0 0 3px"}}>{item.t}</p>
                  <p style={{fontSize:12,color:"rgba(155,147,184,0.8)",margin:0,lineHeight:1.5}}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{width:36,height:1,background:"rgba(139,110,255,0.4)",margin:"20px 0 16px"}}/>
          <p style={{fontSize:11,color:"rgba(139,110,255,0.4)",letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 16px",textAlign:"center"}}>one day at a time</p>
          <button onClick={onDone} style={{width:"100%",padding:"13px",borderRadius:12,fontSize:14,fontWeight:600,border:"none",background:C.purple,color:"#fff",cursor:"pointer"}}>Let's go</button>
        </div>
      </div>
    </div>
  );
}

function CheckInOverlay({ onDone, onCraving }) {
  const [sel, setSel] = useState(null);
  useDialog(() => onDone(null));
  return (
    <div className="sd" role="dialog" aria-modal="true" aria-label="Daily check-in" style={{position:"fixed",top:0,left:0,right:0,zIndex:150,padding:"16px 20px",background:C.surface,borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <p style={{fontSize:15,fontWeight:500,color:C.textPrimary,margin:"0 0 12px"}}>How are you doing today?</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
          {CHECKIN_EMOTIONS.map(e => (
            <button key={e} onClick={() => setSel(e)} style={{padding:"11px 14px",borderRadius:20,fontSize:13,cursor:"pointer",border:sel===e?`1.5px solid ${C.purple}`:`1px solid ${C.border}`,background:sel===e?C.purpleFaint:C.surfaceHigh,color:sel===e?C.textPrimary:C.textSecondary,fontWeight:sel===e?500:400}}>{e}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={() => onDone(sel)} style={{...S.btnP,marginTop:0,flex:1,padding:"10px"}}>{sel?"Save check-in":"Skip for today"}</button>
          <button onClick={onCraving} style={{...S.fbtn,flex:"none",width:"auto",padding:"10px 18px",borderRadius:12,fontSize:14}}>I'm craving</button>
        </div>
      </div>
    </div>
  );
}

function WeeklyOverlay({ journal, onDone, onCraving }) {
  const wa = Date.now()-7*86400000;
  const we = journal.filter(e => new Date(e.date).getTime() > wa);
  const total = we.length, res = we.filter(e => e.survived).length;
  const rate = total > 0 ? Math.round((res/total)*100) : null;
  const dayCounts = {}, dayRes = {};
  we.forEach(e => { const day = new Date(e.date).toLocaleDateString("en",{weekday:"long"}); dayCounts[day]=(dayCounts[day]||0)+1; if(e.survived) dayRes[day]=(dayRes[day]||0)+1; });
  let bestDay = null, bestRate = -1;
  Object.keys(dayCounts).forEach(day => { const r = Math.round(((dayRes[day]||0)/dayCounts[day])*100); if(r>bestRate){bestRate=r;bestDay=day;} });
  const emoRes = {};
  we.forEach(e => { if(!e.emotion) return; if(e.survived) emoRes[e.emotion]=(emoRes[e.emotion]||0)+1; });
  let topEmo = null, topEmoCount = 0;
  Object.keys(emoRes).forEach(emo => { if(emoRes[emo]>topEmoCount){topEmoCount=emoRes[emo];topEmo=emo;} });
  let longestRun = 0, curRun = 0;
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate()-i); const ds = d.toLocaleDateString(); const hadSlip = we.filter(e=>e.date===ds).some(e=>e.survived===false); if(!hadSlip){curRun++;longestRun=Math.max(longestRun,curRun);}else curRun=0; }
  const closes = ["You showed up this week. That's everything.","Every day you kept going is a win.","This week happened. You're still here.","One week at a time. You're doing it."];
  useDialog(onDone);
  return (
    <div className="sd" role="dialog" aria-modal="true" aria-label="Weekly review" style={{position:"fixed",top:0,left:0,right:0,zIndex:150,padding:"16px 20px",background:C.surface,borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <p style={{fontSize:15,fontWeight:500,color:C.textPrimary,margin:"0 0 4px"}}>Your week in review</p>
        <p style={{...S.muted,fontSize:12,margin:"0 0 12px"}}>Sunday summary</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div style={{...S.metric,padding:"0.9rem"}}><div style={{fontSize:20,fontWeight:600,color:C.purple}}>{total}</div><div style={{fontSize:11,color:C.textMuted,marginTop:4}}>cravings logged</div></div>
          <div style={{...S.metric,padding:"0.9rem"}}><div style={{fontSize:20,fontWeight:600,color:C.success}}>{rate!==null?`${rate}%`:"-"}</div><div style={{fontSize:11,color:C.textMuted,marginTop:4}}>resistance rate</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
          <div style={{...S.metric,padding:"0.75rem"}}><div style={{fontSize:18,fontWeight:600,color:C.purple}}>{longestRun}d</div><div style={{fontSize:10,color:C.textMuted,marginTop:4,lineHeight:1.3}}>longest clean run</div></div>
          <div style={{...S.metric,padding:"0.75rem"}}><div style={{fontSize:12,fontWeight:600,color:C.success,lineHeight:1.2}}>{topEmo||"-"}</div><div style={{fontSize:10,color:C.textMuted,marginTop:4,lineHeight:1.3}}>most resisted emotion</div></div>
          <div style={{...S.metric,padding:"0.75rem"}}><div style={{fontSize:12,fontWeight:600,color:C.purple,lineHeight:1.2}}>{bestDay?bestDay.slice(0,3):"-"}</div><div style={{fontSize:10,color:C.textMuted,marginTop:4,lineHeight:1.3}}>best day</div></div>
        </div>
        {topEmo && <p style={{fontSize:12,color:C.textSecondary,margin:"0 0 6px",fontStyle:"italic"}}>You resisted {topEmoCount} craving{topEmoCount!==1?"s":""} when feeling {topEmo.toLowerCase()}. That one is hard.</p>}
        {bestDay && <p style={{fontSize:12,color:C.textSecondary,margin:"0 0 6px",fontStyle:"italic"}}>{bestDay} was your strongest day this week.</p>}
        <p style={{fontSize:12,color:C.textSecondary,margin:"0 0 12px",fontStyle:"italic"}}>{closes[new Date().getDate()%closes.length]}</p>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onDone} style={{...S.btnP,marginTop:0,flex:1,padding:"10px"}}>Thanks</button>
          <button onClick={onCraving} style={{...S.fbtn,flex:"none",width:"auto",padding:"10px 18px",borderRadius:12,fontSize:14}}>I'm craving</button>
        </div>
      </div>
    </div>
  );
}

function MoodWeek({ journal }) {
  const [selDay, setSelDay] = useState(null);
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate()-i);
    const ds = d.toLocaleDateString();
    const de = journal.filter(e => e.date===ds);
    const em = de.length > 0 ? de[0].emotion : null;
    days.push({label:["S","M","T","W","T","F","S"][d.getDay()],color:em?(MOOD_COLORS[em]||C.purple):null,emotion:em,isToday:i===0,dateStr:ds,entries:de,offset:i});
  }
  const sel = selDay !== null ? days.find(d => d.offset===selDay) : null;
  return (
    <div style={S.card}>
      <p style={{...S.h2,marginBottom:12}}>This week</p>
      <div style={{display:"flex",justifyContent:"space-between",gap:4,marginBottom:12}}>
        {days.map(day => {
          const isSel = selDay===day.offset;
          return (
            <div key={day.offset} onClick={() => setSelDay(isSel?null:day.offset)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}}>
              <div role="button" tabIndex={0} aria-label={day.emotion?`${day.label}, ${day.emotion}`:`${day.label}, no entry`} style={{width:34,height:34,borderRadius:"50%",background:day.color||C.surfaceHigh,border:isSel?"2.5px solid #fff":(day.isToday?`2px solid ${C.purple}`:(day.color?"none":`1px solid ${C.border}`)),display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.15s",transform:isSel?"scale(1.15)":"scale(1)"}}>
                {day.color
                  ? <span style={{fontSize:11,fontWeight:700,color:"#fff",textShadow:"0 1px 2px rgba(0,0,0,0.4)"}}>{(day.emotion||"").charAt(0).toUpperCase()}</span>
                  : <div style={{width:6,height:6,borderRadius:"50%",background:C.textMuted}}/>}
              </div>
              <span style={{fontSize:10,color:day.isToday?C.purple:C.textMuted,fontWeight:day.isToday?600:400}}>{day.label}</span>
            </div>
          );
        })}
      </div>
      {sel && (
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12}}>
          <p style={{fontSize:12,color:C.textMuted,margin:"0 0 8px"}}>{sel.dateStr}</p>
          {sel.entries.length===0 ? (
            <p style={{fontSize:13,color:C.textMuted,margin:0,fontStyle:"italic"}}>No entries logged this day.</p>
          ) : sel.entries.map((e,i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"8px 0",borderBottom:i<sel.entries.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{flex:1,marginRight:10}}>
                <span style={{fontSize:13,fontWeight:500,color:C.textPrimary}}>{e.emotion}</span>
                <span style={{fontSize:12,color:C.textSecondary}}> - {e.situation}</span>
                {e.note && <p style={{fontSize:12,color:C.textSecondary,margin:"3px 0 0",fontStyle:"italic"}}>{e.note}</p>}
              </div>
              <span style={S.badge(e.survived?"success":"danger")}>{e.survived?"Resisted":"Slipped"}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:12,marginTop:12,flexWrap:"wrap"}}>
        {[{l:"Positive",c:C.success},{l:"Neutral",c:"#9b93b8"},{l:"Difficult",c:C.danger},{l:"No entry",c:C.surfaceHigh,b:true}].map(x => (
          <div key={x.l} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:x.c,border:x.b?`1px solid ${C.border}`:"none"}}/>
            <span style={{fontSize:11,color:C.textMuted}}>{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsPanel({ journal, addId, tips }) {
  const entries = journal.filter(e => e.addiction===addId);
  if (entries.length < 3) {
    return (
      <div>
        <p style={S.muted}>Log 3 cravings to unlock your pattern analysis.</p>
        <div style={{background:C.surfaceHigh,borderRadius:10,overflow:"hidden",height:6,margin:"12px 0"}}>
          <div style={{height:6,background:C.purple,borderRadius:10,width:`${Math.min(100,(entries.length/3)*100)}%`}}/>
        </div>
        <p style={{fontSize:12,color:C.purple,margin:0,fontWeight:500}}>{entries.length} of 3 entries logged</p>
      </div>
    );
  }
  const countBy = key => entries.reduce((a,e) => { a[e[key]]=(a[e[key]]||0)+1; return a; }, {});
  const topN = (obj,n) => Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,n);
  const emo = topN(countBy("emotion"),5), sit = topN(countBy("situation"),4), tim = topN(countBy("time"),4);
  const wk = {};
  entries.forEach(e => { const w = Math.floor((Date.now()-new Date(e.date).getTime())/(7*86400000)); wk[w]=(wk[w]||0)+1; });
  const weeks = [3,2,1,0].map(i => ({i,c:wk[i]||0}));
  const maxW = Math.max(...weeks.map(w=>w.c));
  const slipped = entries.filter(e=>e.survived===false).length;
  const rr = Math.round(((entries.length-slipped)/entries.length)*100);
  const circ = 2*Math.PI*38, dash = (rr/100)*circ;
  const maxE = emo.length?emo[0][1]:1, maxS = sit.length?sit[0][1]:1;
  const wlabels = ["3 wks ago","2 wks ago","Last week","This week"];
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:20,padding:"1rem 1.25rem",background:C.surfaceHigh,borderRadius:14}}>
        <div style={{position:"relative",width:96,height:96,flexShrink:0}}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="38" fill="none" stroke={C.border} strokeWidth="7"/>
            <circle cx="48" cy="48" r="38" fill="none" stroke={C.purple} strokeWidth="7" strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" transform="rotate(-90 48 48)"/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:20,fontWeight:700,color:C.purple}}>{rr}%</div>
          </div>
        </div>
        <div>
          <p style={{fontSize:14,fontWeight:500,color:C.textPrimary,margin:"0 0 4px"}}>Overall resistance rate</p>
          <p style={{...S.muted,fontSize:12,margin:"0 0 6px"}}>{entries.length-slipped} of {entries.length} cravings resisted</p>
          <p style={{fontSize:12,color:rr>=70?C.success:rr>=40?C.amber:C.danger,fontWeight:500,margin:0}}>{rr>=70?"You are holding strong.":rr>=40?"Keep pushing - every win counts.":"Reach out for extra support right now."}</p>
        </div>
      </div>
      <p style={{fontSize:12,fontWeight:600,color:C.purple,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 10px"}}>4-week craving trend</p>
      <div style={{display:"flex",gap:6,alignItems:"flex-end",height:70,marginBottom:20}}>
        {weeks.map((w,i) => {
          const h = maxW>0?Math.max(8,(w.c/maxW)*56):8;
          const isPeak = w.c===maxW && w.c>0;
          return (
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{fontSize:9,color:isPeak?C.purple:"transparent",fontWeight:600}}>peak</div>
              <div style={{width:"100%",borderRadius:6,background:isPeak?C.purple:C.purpleMid,height:`${h}px`}}/>
              <div style={{fontSize:9,color:C.textMuted,textAlign:"center"}}>{w.c}</div>
              <div style={{fontSize:9,color:C.textMuted,textAlign:"center",whiteSpace:"nowrap"}}>{wlabels[i]}</div>
            </div>
          );
        })}
      </div>
      {weeks[3].c<weeks[0].c && <p style={{fontSize:12,color:C.success,margin:"-12px 0 16px",fontWeight:500}}>Cravings are trending down. You are making progress.</p>}
      {weeks[3].c>weeks[0].c && <p style={{fontSize:12,color:C.amber,margin:"-12px 0 16px",fontWeight:500}}>Cravings increased this week. What changed?</p>}
      <p style={{fontSize:12,fontWeight:600,color:C.purple,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 10px"}}>Trigger emotions</p>
      {emo.map((it,i) => {
        const isTop = i===0;
        return (
          <div key={it[0]} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:13,color:isTop?C.textPrimary:C.textSecondary,fontWeight:isTop?500:400}}>{it[0]}{isTop&&<span style={{fontSize:10,color:C.purple,marginLeft:6,fontWeight:600}}>most common</span>}</span>
              <span style={{fontSize:12,color:C.textMuted}}>{it[1]}x</span>
            </div>
            <div style={{height:5,background:C.surfaceHigh,borderRadius:3}}>
              <div style={{height:5,borderRadius:3,width:`${Math.round((it[1]/maxE)*100)}%`,background:isTop?C.purple:C.purpleMid}}/>
            </div>
          </div>
        );
      })}
      {emo[0] && <p style={{fontSize:12,color:C.textSecondary,margin:"8px 0 20px",fontStyle:"italic"}}>"{emo[0][0]}" is your most common trigger. When you feel this, slow down.</p>}
      <p style={{fontSize:12,fontWeight:600,color:C.purple,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 10px"}}>Trigger situations</p>
      {sit.map((it,i) => {
        const isTop = i===0;
        return (
          <div key={it[0]} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:13,color:isTop?C.textPrimary:C.textSecondary,fontWeight:isTop?500:400}}>{it[0]}{isTop&&<span style={{fontSize:10,color:C.purple,marginLeft:6,fontWeight:600}}>highest risk</span>}</span>
              <span style={{fontSize:12,color:C.textMuted}}>{it[1]}x</span>
            </div>
            <div style={{height:5,background:C.surfaceHigh,borderRadius:3}}>
              <div style={{height:5,borderRadius:3,width:`${Math.round((it[1]/maxS)*100)}%`,background:isTop?C.purple:C.purpleMid}}/>
            </div>
          </div>
        );
      })}
      {sit[0] && <p style={{fontSize:12,color:C.textSecondary,margin:"8px 0 20px",fontStyle:"italic"}}>Cravings hit hardest when you are "{sit[0][0]}". Have a plan ready for this.</p>}
      <p style={{fontSize:12,fontWeight:600,color:C.purple,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 10px"}}>High risk times</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        {tim.map((it,i) => {
          const isTop = i===0;
          return (
            <div key={it[0]} style={{padding:"10px 12px",borderRadius:10,background:isTop?C.purpleFaint:C.surfaceHigh,border:isTop?`1px solid ${C.borderMid}`:`1px solid ${C.border}`,position:"relative"}}>
              {isTop && <div style={{position:"absolute",top:6,right:8,fontSize:9,color:C.purple,fontWeight:600}}>peak</div>}
              <div style={{fontSize:13,color:isTop?C.textPrimary:C.textSecondary,fontWeight:isTop?500:400}}>{it[0]}</div>
              <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{it[1]} cravings</div>
            </div>
          );
        })}
      </div>
      {tim[0] && <p style={{fontSize:12,color:C.textSecondary,margin:"0 0 20px",fontStyle:"italic"}}>{tim[0][0]} is your danger zone. Plan something different during this window.</p>}
      {tips?.length>0 && (
        <div>
          <p style={{fontSize:12,fontWeight:600,color:C.purple,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 10px"}}>Personalized tips</p>
          {tips.map((t,i) => (
            <div key={i} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`,fontSize:13,display:"flex",gap:10,color:C.textPrimary,lineHeight:1.6}}>
              <span style={{color:C.purple,flexShrink:0,fontWeight:600}}>{i+1}.</span><span>{t}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SetupWrap({ children }) {
  return (
    <div style={{...S.app, background:C.bg, minHeight:"100vh"}}>
      <style>{globalCss}</style>
      {children}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("setup_addiction");
  const [setupStep, setSetupStep] = useState(0);
  const [addictions, setAddictions] = useState([]);
  const [startDates, setStartDates] = useState({});
  const [dailyCosts, setDailyCosts] = useState({});
  const [profile, setProfile] = useState({});
  const [streakName, setStreakName] = useState("");
  const [ec, setEc] = useState({name:"",phone:""});
  const [bests, setBests] = useState({});
  const [customMs, setCustomMs] = useState({});
  const [newMsInput, setNewMsInput] = useState({});
  const [tab, setTab] = useState("home");
  const [game, setGame] = useState(null);
  useEffect(() => { if (!game) return; const onKey = e => { if (e.key === "Escape") setGame(null); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, [game]);
  const tabOrder = ["home","journal","milestones","settings"];
  const touchRef = useRef({x:0,y:0,t:0,locked:null});
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const onTabTouchStart = e => { const t=e.touches[0]; touchRef.current={x:t.clientX,y:t.clientY,t:Date.now(),locked:null}; };
  const onTabTouchMove = e => {
    const t=e.touches[0]; const dx=t.clientX-touchRef.current.x; const dy=t.clientY-touchRef.current.y;
    if (touchRef.current.locked===null) {
      if (Math.abs(dx)>8||Math.abs(dy)>8) touchRef.current.locked = Math.abs(dx)>Math.abs(dy)*1.2 ? "x" : "y";
      else return;
    }
    if (touchRef.current.locked!=="x") return;
    setDragging(true);
    const i=tabOrder.indexOf(tab);
    let clamped=dx;
    if (i===0&&dx>0) clamped=dx*0.35;
    if (i===tabOrder.length-1&&dx<0) clamped=dx*0.35;
    setDragX(clamped);
  };
  const onTabTouchEnd = e => {
    const dt=Date.now()-touchRef.current.t;
    const dx=dragX;
    setDragging(false);
    if (touchRef.current.locked==="x" && Math.abs(dx)>60 && dt<800) {
      const i=tabOrder.indexOf(tab);
      if (dx<0&&i<tabOrder.length-1) setTab(tabOrder[i+1]);
      else if (dx>0&&i>0) setTab(tabOrder[i-1]);
    }
    setDragX(0);
  };
  const [timers, setTimers] = useState({});
  const [dIdx, setDIdx] = useState({});
  const [activeAdd, setActiveAdd] = useState(null);
  const [pickingCraving, setPickingCraving] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [slipNote, setSlipNote] = useState("");
  const [slipAdd, setSlipAdd] = useState(null);
  const [slipMsg, setSlipMsg] = useState("");
  const [showSlipFU, setShowSlipFU] = useState(false);
  const [journal, setJournal] = useState([]);
  const [jEntry, setJEntry] = useState({addiction:"",emotion:"",situation:"",time:"",survived:null,note:""});
  const [showLogForm, setShowLogForm] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [cleanDays, setCleanDays] = useState({});
  const [cleanTOD, setCleanTOD] = useState({});
  const [sdInput, setSdInput] = useState({});
  const [celebMs, setCelebMs] = useState(null);
  const [seenMs, setSeenMs] = useState({});
  const [notifOn, setNotifOn] = useState(false);
  const [notifTime, setNotifTime] = useState("09:00");
  const [notifMsg, setNotifMsg] = useState(NOTIF_MESSAGES[1]);
  const [showCI, setShowCI] = useState(false);
  const [showWS, setShowWS] = useState(false);
  const [lastCI, setLastCI] = useState("");
  const [lastWS, setLastWS] = useState("");
  const [showTLog, setShowTLog] = useState(false);
  const [tLogAdd, setTLogAdd] = useState(null);
  const [tLogSurv, setTLogSurv] = useState(null);
  const [tLogEmo, setTLogEmo] = useState("");
  const [tLogSit, setTLogSit] = useState("");
  const [tLogNote, setTLogNote] = useState("");
  const [insId, setInsId] = useState(null);
  const [extraStep, setExtraStep] = useState(0);
  const [showExtra, setShowExtra] = useState(false);
  const [timeNote, setTimeNote] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFirstHint, setShowFirstHint] = useState(false);
  const ciRef = useRef(null);
  const ivRef = useRef({});
  const prevRef = useRef({});
  const hasOnboarded = useRef(false);

  const adObj = id => ADDICTIONS.find(a => a.id===id);
  const multi = addictions.length > 1;
  const elapsed = id => startDates[id] ? getElapsed(startDates[id]) : null;
  const toggleAdd = id => setAddictions(a => a.includes(id) ? a.filter(x=>x!==id) : [...a,id]);

  useEffect(() => { if (screen==="app" && !hasOnboarded.current) { hasOnboarded.current=true; setShowOnboarding(true); } }, [screen]);
  useEffect(() => { if (addictions.length>0 && !insId) setInsId(addictions[0]); }, [addictions]);
  useEffect(() => {
    if (screen!=="app") return;
    ciRef.current = setTimeout(() => {
      if (isSunday()&&lastWS!==getWeekKey()) setShowWS(true);
      else if (lastCI!==new Date().toDateString()) setShowCI(true);
    }, 7000);
    return () => clearTimeout(ciRef.current);
  }, [screen]);

  useEffect(() => {
    if (screen!=="app") return;
    const iv = setInterval(() => {
      addictions.forEach(id => {
        const e = startDates[id] ? getElapsed(startDates[id]) : null;
        if (!e) return;
        const prev = prevRef.current[id]||0;
        if (e.days!==prev) {
          prevRef.current[id]=e.days;
          const all = [...(MILESTONES[id]||[]), ...(customMs[id]||[])];
          const hit = all.find(m => m.days===e.days && !seenMs[`${id}-${m.days}`]);
          if (hit) { setSeenMs(s=>({...s,[`${id}-${hit.days}`]:true})); setCelebMs({days:hit.days,phrase:hit.phrase||"of showing up"}); }
        }
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [screen,addictions,startDates,customMs,seenMs]);

  useEffect(() => {
    Object.keys(timers).forEach(id => {
      const t = timers[id];
      if (t.active&&!t.done) {
        if (ivRef.current[id]) return;
        ivRef.current[id] = setInterval(() => {
          setTimers(prev => {
            const cur = prev[id];
            if (!cur||!cur.active||cur.done) { clearInterval(ivRef.current[id]); delete ivRef.current[id]; return prev; }
            if (cur.secs<=1) { clearInterval(ivRef.current[id]); delete ivRef.current[id]; return {...prev,[id]:{...cur,secs:0,active:false,done:true}}; }
            return {...prev,[id]:{...cur,secs:cur.secs-1}};
          });
        }, 1000);
      } else if (ivRef.current[id]) { clearInterval(ivRef.current[id]); delete ivRef.current[id]; }
    });
  }, [timers]);

  const startTimer = addId => {
    setTimers(t=>({...t,[addId]:{secs:900,active:true,done:false}}));
    setDIdx(d=>({...d,[addId]:0}));
    setActiveAdd(addId); setPickingCraving(false); setShowCI(false); setShowWS(false); setTab("timer");
  };

  const handleCraving = () => {
    clearTimeout(ciRef.current); setShowCI(false); setShowWS(false);
    setTimeNote(getTimeNote());
    if (multi) setPickingCraving(true); else startTimer(addictions[0]);
  };

  const handleSlip = () => { if (multi){setSlipAdd(null);setShowReset(true);}else{setSlipAdd(addictions[0]);setShowReset(true);} };

  const logSlip = addId => {
    const e = elapsed(addId);
    if (e&&e.days>(bests[addId]||0)) setBests(b=>({...b,[addId]:e.days}));
    setStartDates(d=>({...d,[addId]:new Date(Date.now()-1000).toISOString()}));
    setShowReset(false); setSlipNote(""); setSlipAdd(null);
    setSlipMsg(SLIP_MESSAGES[Math.floor(Math.random()*SLIP_MESSAGES.length)]);
    setShowSlipFU(true);
    setJEntry(j=>({...j,addiction:addId}));
    setTab("journal"); setShowLogForm(true);
  };

  const saveJournal = () => {
    const addId = multi?jEntry.addiction:addictions[0];
    if (!addId||!jEntry.emotion||!jEntry.situation||!jEntry.time||jEntry.survived===null) return;
    setJournal(j=>[{...jEntry,addiction:addId,date:new Date().toLocaleDateString(),id:Date.now()},...j]);
    setJEntry({addiction:"",emotion:"",situation:"",time:"",survived:null,note:""});
  };

  const addCustomM = id => {
    const v = newMsInput[id]; if (!v) return;
    const d = parseInt(v); if (isNaN(d)||d<=0) return;
    setCustomMs(m=>({...m,[id]:[...(m[id]||[]),{days:d,label:`Day ${d}`,detail:"Your personal milestone",phrase:"of showing up",custom:true}]}));
    setNewMsInput(v=>({...v,[id]:""}));
  };

  const removeCustomM = (id,days) => setCustomMs(m=>({...m,[id]:(m[id]||[]).filter(x=>x.days!==days)}));

  const bsd = id => {
    const d = parseInt(cleanDays[id]||"0"), h = TOD_OFFSETS[cleanTOD[id]]??12;
    const dt = new Date(); dt.setDate(dt.getDate()-d); dt.setHours(h,0,0,0); return dt.toISOString();
  };

  const dReady = addictions.every(id => cleanDays[id]!==undefined&&cleanDays[id]!==""&&parseInt(cleanDays[id])>=0&&cleanTOD[id]);
  const sorted = [...addictions].sort((a,b) => (startDates[b]?getElapsed(startDates[b]).totalSecs:0)-(startDates[a]?getElapsed(startDates[a]).totalSecs:0));
  const longestId = sorted[0];
  const insSelected = insId || addictions[0] || null;
  const showFloat = screen==="app"&&tab!=="timer"&&!pickingCraving&&!showReset;

  const doReset = () => {
    setConfirmReset(false); setScreen("setup_addiction"); setAddictions([]); setStartDates({}); setDailyCosts({});
    setProfile({}); setJournal([]); setTimers({}); setSetupStep(0); setStreakName(""); setEc({name:"",phone:""});
    setCustomMs({}); setSeenMs({}); setShowCI(false); setShowWS(false); setLastCI(""); setLastWS(""); setInsId(null);
    hasOnboarded.current = false;
  };

  if (screen==="setup_addiction") return (
    <SetupWrap>
      <div style={{marginBottom:"2rem"}}>
        <p style={{fontSize:26,fontWeight:600,margin:"0 0 6px",color:C.textPrimary}}>Your recovery starts here.</p>
        <p style={{...S.muted,margin:0}}>No account needed. Everything stays on your device.</p>
      </div>
      <div style={S.card}>
        <p style={S.h2}>What are you recovering from?</p>
        <p style={{...S.muted,marginBottom:14}}>Select all that apply</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {ADDICTIONS.map(a => { const sel=addictions.includes(a.id); return (
            <div key={a.id} onClick={()=>toggleAdd(a.id)} style={{padding:"14px",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:10,border:sel?`1.5px solid ${C.purple}`:`1px solid ${C.border}`,background:sel?C.purpleFaint:C.surfaceHigh,fontSize:14,fontWeight:sel?500:400,color:sel?C.textPrimary:C.textSecondary}}>
              <Icon name={a.id} size={18} color={sel?C.purple:C.textSecondary}/>{a.label}
              {sel && <div style={{marginLeft:"auto",width:16,height:16,borderRadius:"50%",background:C.purple,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff"}}>✓</div>}
            </div>
          );})}
        </div>
        <button style={S.btnP} onClick={()=>{if(addictions.length>0)setScreen("setup_dates");}}>Continue</button>
      </div>
    </SetupWrap>
  );

  if (screen==="setup_dates") return (
    <SetupWrap>
      <div style={{marginBottom:"2rem"}}>
        <p style={{fontSize:24,fontWeight:600,margin:"0 0 6px",color:C.textPrimary}}>How long have you been clean?</p>
        <p style={{...S.muted,margin:0}}>Don't worry about exact dates - just tell us how many days.</p>
      </div>
      <div style={S.card}>
        {addictions.map(id => { const a=adObj(id), days=cleanDays[id]||"", tod=cleanTOD[id]||""; return (
          <div key={id} style={{marginBottom:24,paddingBottom:24,borderBottom:`1px solid ${C.border}`}}>
            <p style={{fontSize:15,fontWeight:500,color:C.textPrimary,margin:"0 0 14px",display:"inline-flex",alignItems:"center",gap:8}}><Icon name={id} size={16} color={C.purple}/>{a?.label}</p>
            <label style={S.label}>How many days clean?</label>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <button aria-label="Decrease days" onClick={()=>setCleanDays(d=>({...d,[id]:String(Math.max(0,(parseInt(d[id])||0)-1))}))} style={{width:42,height:42,borderRadius:10,border:`1px solid ${C.border}`,background:C.surfaceHigh,color:C.textPrimary,fontSize:22,cursor:"pointer",flexShrink:0}}>-</button>
              <div style={{flex:1,position:"relative"}}>
                <input type="number" min="0" placeholder="0" style={{...S.inp,textAlign:"center",fontSize:22,fontWeight:600,color:C.purple,padding:"10px"}} value={days} onChange={e=>setCleanDays(d=>({...d,[id]:e.target.value}))}/>
                <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:C.textMuted}}>days</span>
              </div>
              <button aria-label="Increase days" onClick={()=>setCleanDays(d=>({...d,[id]:String((parseInt(d[id])||0)+1)}))} style={{width:42,height:42,borderRadius:10,border:`1px solid ${C.border}`,background:C.surfaceHigh,color:C.textPrimary,fontSize:22,cursor:"pointer",flexShrink:0}}>+</button>
            </div>
            {parseInt(days)===0&&days!==""&&<p style={{fontSize:13,color:C.purple,margin:"-8px 0 14px",fontWeight:500}}>Starting fresh today - that takes courage.</p>}
            <label style={S.label}>Roughly what time did you last use?</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {Object.keys(TOD_OFFSETS).map(t => <button key={t} onClick={()=>setCleanTOD(d=>({...d,[id]:t}))} style={{padding:"10px 8px",borderRadius:10,fontSize:13,cursor:"pointer",border:tod===t?`1.5px solid ${C.purple}`:`1px solid ${C.border}`,background:tod===t?C.purpleFaint:C.surfaceHigh,color:tod===t?C.textPrimary:C.textSecondary,fontWeight:tod===t?500:400}}>{t}</button>)}
            </div>
            <label style={S.label}>Daily cost ($) - optional</label>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.textMuted,fontSize:14}}>$</span>
              <input type="number" placeholder="0.00" style={{...S.inp,paddingLeft:24}} value={dailyCosts[id]||""} onChange={e=>setDailyCosts(d=>({...d,[id]:e.target.value}))}/>
            </div>
          </div>
        );})}
        <button style={{...S.btnP,opacity:dReady?1:0.45}} onClick={()=>{if(!dReady)return;const nd={};addictions.forEach(id=>{nd[id]=bsd(id);});setStartDates(nd);setScreen("setup_profile");}}>Continue</button>
        <button style={S.btnS} onClick={()=>setScreen("setup_addiction")}>Back</button>
      </div>
    </SetupWrap>
  );

  if (screen==="setup_profile") {
    const q=CORE_QUESTIONS[setupStep], prog=((setupStep+1)/CORE_QUESTIONS.length)*100;
    return (
      <SetupWrap>
        <div style={{marginBottom:"1.5rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:13,color:C.textSecondary}}>Quick personalisation</span>
            <span style={{fontSize:13,color:C.purple}}>{setupStep+1} of {CORE_QUESTIONS.length}</span>
          </div>
          <div style={{height:3,background:C.surfaceHigh,borderRadius:2}}><div style={{height:3,borderRadius:2,width:`${prog}%`,background:C.purple,transition:"width 0.3s"}}/></div>
        </div>
        <div style={S.card}>
          <p style={{fontSize:18,fontWeight:500,marginTop:0,marginBottom:8,lineHeight:1.4,color:C.textPrimary}}>{q.label}</p>
          <p style={{...S.muted,marginBottom:20,fontSize:12}}>Helps personalise your distraction tips. All answers are private.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {q.options.map(opt => <button key={opt} onClick={()=>{setProfile(p=>({...p,[q.id]:opt==="Prefer not to say"?"No":opt}));if(setupStep<CORE_QUESTIONS.length-1)setSetupStep(s=>s+1);else setScreen("setup_personal");}} style={{...S.btnS,textAlign:"left",padding:"14px 16px",fontSize:14,marginTop:0,borderRadius:12,color:C.textPrimary}}>{opt}</button>)}
          </div>
          {setupStep>0&&<button style={{...S.btnS,marginTop:14,fontSize:12}} onClick={()=>setSetupStep(s=>s-1)}>Back</button>}
        </div>
      </SetupWrap>
    );
  }

  if (screen==="setup_personal") return (
    <SetupWrap>
      <div style={{marginBottom:"2rem"}}>
        <p style={{fontSize:24,fontWeight:600,margin:"0 0 6px",color:C.textPrimary}}>One last thing</p>
        <p style={{...S.muted,margin:0}}>Both completely optional.</p>
      </div>
      <div style={S.card}>
        <p style={S.h2}>Give your recovery a name</p>
        <p style={{...S.muted,marginBottom:12,fontSize:13}}>Something personal - it'll show on your home screen.</p>
        <input placeholder="e.g. My Journey, Project Me, Day One..." style={S.inp} value={streakName} onChange={e=>setStreakName(e.target.value)}/>
      </div>
      <div style={S.card}>
        <p style={S.h2}>Emergency contact</p>
        <p style={{...S.muted,marginBottom:12,fontSize:13}}>One person you can call in one tap. Stays private on your device.</p>
        <div style={{marginBottom:10}}>
          <label style={S.label}>Name</label>
          <input placeholder="e.g. Alex" style={S.inp} value={ec.name} onChange={e=>setEc(c=>({...c,name:e.target.value}))}/>
        </div>
        <div>
          <label style={S.label}>Phone number</label>
          <input type="tel" placeholder="e.g. 07700 900000" style={S.inp} value={ec.phone} onChange={e=>setEc(c=>({...c,phone:e.target.value}))}/>
        </div>
      </div>
      <button style={S.btnP} onClick={()=>setScreen("app")}>Get started</button>
      <button style={{...S.btnS,fontSize:13}} onClick={()=>setScreen("app")}>Skip everything</button>
    </SetupWrap>
  );

  if (showReset) {
    if (multi&&!slipAdd) return (
      <SetupWrap>
        <div style={S.card}>
          <p style={{fontSize:20,fontWeight:500,marginTop:0,color:C.textPrimary}}>Which one did you slip on?</p>
          <p style={S.muted}>It's okay - be honest with yourself. Only that streak will reset.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:16}}>
            {addictions.map(id => { const a=adObj(id); return <button key={id} onClick={()=>setSlipAdd(id)} style={{...S.btnS,textAlign:"left",display:"flex",alignItems:"center",gap:12,padding:"16px",marginTop:0,borderRadius:14,color:C.textPrimary}}><Icon name={id} size={20} color={C.purple}/><span style={{fontSize:15}}>{a?.label}</span></button>; })}
          </div>
          <button style={{...S.btnS,marginTop:14,fontSize:13}} onClick={()=>setShowReset(false)}>Cancel</button>
        </div>
      </SetupWrap>
    );
    const sa = adObj(slipAdd);
    return (
      <SetupWrap>
        <div style={S.card}>
          <p style={{fontSize:20,fontWeight:500,marginTop:0,color:C.textPrimary}}>It's okay. You're still here.</p>
          <p style={S.muted}>A slip doesn't erase your progress. {multi&&sa?`Only your ${sa.label} streak will reset.`:"Your longest streak is always preserved."}</p>
          {multi&&sa&&<div style={{background:C.purpleFaint,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:16}}><Icon name={sa.id} size={22} color={C.purple}/><div><div style={{fontSize:12,color:C.textMuted}}>Resetting streak for</div><div style={{fontSize:15,fontWeight:500,color:C.textPrimary}}>{sa.label}</div></div></div>}
          <div style={{marginBottom:16}}>
            <label style={S.label}>Optional: what happened? (private)</label>
            <textarea rows={3} placeholder="You don't have to write anything..." style={{...S.inp,resize:"vertical",lineHeight:1.6}} value={slipNote} onChange={e=>setSlipNote(e.target.value)}/>
          </div>
          <button style={S.btnP} onClick={()=>logSlip(slipAdd)}>Start fresh</button>
          <button style={S.btnS} onClick={()=>multi?setSlipAdd(null):setShowReset(false)}>Back</button>
        </div>
      </SetupWrap>
    );
  }

  if (pickingCraving) return (
    <SetupWrap>
      <div style={S.card}>
        <p style={{fontSize:20,fontWeight:500,marginTop:0,color:C.textPrimary}}>What are you craving?</p>
        <p style={S.muted}>It's okay - pick what's pulling at you and we'll help you through it.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:16}}>
          {addictions.map(id => { const a=adObj(id); return <button key={id} onClick={()=>startTimer(id)} style={{...S.btnS,textAlign:"left",display:"flex",alignItems:"center",gap:12,padding:"16px",marginTop:0,borderRadius:14,color:C.textPrimary}}><Icon name={id} size={20} color={C.purple}/><span style={{fontSize:15}}>{a?.label}</span></button>; })}
        </div>
        <button style={{...S.btnS,marginTop:14,fontSize:13}} onClick={()=>setPickingCraving(false)}>Cancel</button>
      </div>
    </SetupWrap>
  );

  if (tab==="timer"&&activeAdd) {
    const ts=timers[activeAdd]||{secs:900,active:false,done:false};
    const tm=Math.floor(ts.secs/60), tsec=ts.secs%60, tprog=((900-ts.secs)/900)*100;
    const dist=buildDistractions(activeAdd,profile,ec);
    const tidx=dIdx[activeAdd]||0, ta=adObj(activeAdd), tip=dist[tidx%dist.length];
    return (
      <div style={{...S.app,paddingBottom:"1rem",background:C.bg,minHeight:"100vh"}}>
        <style>{globalCss}</style>
        <div style={{...S.card,textAlign:"center"}}>
          {timeNote&&!ts.active&&!ts.done&&(
            <div className="fn" style={{background:C.purpleFaint,border:`1px solid ${C.borderMid}`,borderRadius:10,padding:"10px 14px",marginBottom:14,textAlign:"left"}}>
              <p style={{fontSize:13,color:C.textSecondary,margin:0,lineHeight:1.6,fontStyle:"italic"}}>{timeNote}</p>
            </div>
          )}
          <p style={{fontSize:13,color:C.textSecondary,marginTop:0,marginBottom:6,display:"inline-flex",alignItems:"center",gap:6,justifyContent:"center"}}>{ta&&<Icon name={ta.id} size={14}/>}{ta?.label} — craving timer</p>
          {(()=>{ const size=240, sw=3, r=(size-sw)/2, circ=2*Math.PI*r, off=circ*(1-tprog/100); return (
            <div style={{position:"relative",width:size,height:size,margin:"0.75rem auto 1rem"}}>
              {ts.active&&!ts.done&&(
                <div className="breathe-circle" aria-hidden="true" style={{position:"absolute",inset:18,borderRadius:"50%",background:`radial-gradient(circle, ${C.purpleGlow||"rgba(157,133,255,0.35)"} 0%, rgba(157,133,255,0.08) 70%, transparent 100%)`,pointerEvents:"none"}}/>
              )}
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{position:"absolute",inset:0,transform:"rotate(-90deg)"}}>
                <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.surfaceHigh} strokeWidth={sw}/>
                <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.purple} strokeWidth={sw} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} style={{transition:"stroke-dashoffset 1s linear"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontSize:46,fontWeight:300,letterSpacing:2,color:C.purple,lineHeight:1}}>{pad(tm)}:{pad(tsec)}</div>
                {ts.active&&!ts.done&&<p style={{fontSize:10,color:C.textSecondary,letterSpacing:"0.18em",textTransform:"uppercase",margin:"10px 0 0"}}>Breathe</p>}
              </div>
            </div>
          ); })()}
          {!ts.done ? (
            <div>
              <div style={{...S.cardHigh,textAlign:"left",marginBottom:14}}>
                <p style={{margin:"0 0 6px",fontSize:11,color:C.purple,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>Try this right now</p>
                <p style={{margin:"0 0 12px",fontSize:14,lineHeight:1.8,color:C.textPrimary}}>{tip}</p>
                {ec?.name&&ec?.phone&&<a href={`tel:${ec.phone}`} style={{display:"block",textAlign:"center",padding:"10px",borderRadius:10,background:C.purple,color:"#fff",fontSize:14,fontWeight:500,textDecoration:"none",marginTop:4}}>Reach out<span style={{display:"block",fontSize:11,opacity:0.8,marginTop:2}}>{ec.name}</span></a>}
              </div>
              <div style={{display:"flex",gap:8}}>
                {!ts.active
                  ? <button style={S.btnP} onClick={()=>setTimers(p=>({...p,[activeAdd]:{...p[activeAdd],active:true}}))}>Start timer</button>
                  : <button style={S.btnS} onClick={()=>setDIdx(d=>({...d,[activeAdd]:(d[activeAdd]||0)+1}))}>Next tip</button>
                }
              </div>
            </div>
          ) : showTLog ? (
            <div style={{textAlign:"left"}}>
              <p style={{fontSize:15,fontWeight:500,color:C.textPrimary,margin:"0 0 4px"}}>Quick log - while it's fresh</p>
              <p style={{...S.muted,fontSize:12,margin:"0 0 14px"}}>Takes 10 seconds. Helps your patterns over time.</p>
              <div style={{marginBottom:10}}>
                <label style={S.label}>How were you feeling?</label>
                <select style={S.sel} value={tLogEmo} onChange={e=>setTLogEmo(e.target.value)}>
                  <option value="">Select...</option>
                  {EMOTIONS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{marginBottom:10}}>
                <label style={S.label}>What was the situation?</label>
                <select style={S.sel} value={tLogSit} onChange={e=>setTLogSit(e.target.value)}>
                  <option value="">Select...</option>
                  {SITUATIONS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <label style={S.label}>Anything else? (optional)</label>
                <textarea rows={2} placeholder="What was going through your mind?" style={{...S.inp,resize:"vertical",lineHeight:1.6,fontSize:13}} value={tLogNote} onChange={e=>setTLogNote(e.target.value)}/>
              </div>
              <button style={S.btnP} onClick={()=>{
                const now=new Date(), h=now.getHours();
                const tl=h<12?TIMES[0]:h<18?TIMES[1]:h<22?TIMES[2]:TIMES[3];
                if(tLogEmo&&tLogSit) setJournal(j=>[{addiction:tLogAdd,emotion:tLogEmo,situation:tLogSit,time:tl,survived:tLogSurv,note:tLogNote,date:now.toLocaleDateString(),id:Date.now()},...j]);
                setShowTLog(false);setTLogEmo("");setTLogSit("");setTLogNote("");setTab("home");
              }}>Save and go to home</button>
              <button style={{...S.btnS,marginTop:6,fontSize:13}} onClick={()=>{setShowTLog(false);setTab("home");}}>Skip</button>
            </div>
          ) : (
            <div>
              <p style={{color:C.success,fontWeight:500,fontSize:17,marginBottom:16}}>You did it. 15 minutes survived.</p>
              <button style={S.btnP} onClick={()=>{setTLogAdd(activeAdd);setTLogSurv(true);setShowTLog(true);}}>Log this moment</button>
              <button style={S.btnS} onClick={()=>setTab("home")}>Skip to home</button>
              <button style={S.btnS} onClick={handleSlip}>I slipped</button>
            </div>
          )}
          {ts.active&&!ts.done&&<button style={{...S.btnS,marginTop:6,fontSize:13}} onClick={()=>setGame("picker")}>Try a calming game</button>}
          <button style={{...S.btnS,marginTop:6,fontSize:13,color:C.textMuted,borderColor:"transparent"}} onClick={()=>setTab("home")}>Back to home</button>
        </div>
        {game==="picker"&&(
          <div role="dialog" aria-modal="true" aria-label="Pick a game" style={{position:"fixed",inset:0,background:"rgba(8,6,18,0.85)",backdropFilter:"blur(8px)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{...S.card,maxWidth:380,width:"100%"}}>
              <p style={{...S.h2,marginTop:0}}>Pick a game</p>
              <button style={{...S.btnS,textAlign:"left",marginTop:8}} onClick={()=>setGame("tap")}>Tap to 100 — slow counting</button>
              <button style={{...S.btnS,textAlign:"left",marginTop:8}} onClick={()=>setGame("color")}>Color match — 10 rounds</button>
              <button style={{...S.btnS,textAlign:"left",marginTop:8}} onClick={()=>setGame("pattern")}>Pattern tap — memory</button>
              <button style={{...S.btnS,marginTop:14,color:C.textMuted}} onClick={()=>setGame(null)}>Close</button>
            </div>
          </div>
        )}
        {(game==="tap"||game==="color"||game==="pattern")&&(
          <div role="dialog" aria-modal="true" aria-label="Calming game" style={{position:"fixed",inset:0,background:"rgba(8,6,18,0.92)",backdropFilter:"blur(8px)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{...S.card,maxWidth:380,width:"100%"}}>
              {game==="tap"&&<TapTo100 onClose={()=>setGame(null)}/>}
              {game==="color"&&<ColorMatch onClose={()=>setGame(null)}/>}
              {game==="pattern"&&<PatternTap onClose={()=>setGame(null)}/>}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{...S.app,background:C.bg,minHeight:"100vh"}}>
      <style>{globalCss}</style>
      {showOnboarding && <OnboardingCard onDone={()=>{setShowOnboarding(false); if(!localStorage.getItem("db_seen_hint")){setShowFirstHint(true); localStorage.setItem("db_seen_hint","1"); setTimeout(()=>setShowFirstHint(false),5000);}}}/>}
      {celebMs&&!showOnboarding&&<MilestoneCard days={celebMs.days} phrase={celebMs.phrase} onClose={()=>setCelebMs(null)}/>}
      {showCI&&!celebMs&&!showOnboarding&&<CheckInOverlay onDone={emo=>{if(emo)setJournal(j=>[{addiction:addictions[0],emotion:emo,situation:"Daily check-in",time:TIMES[1],survived:true,date:new Date().toLocaleDateString(),id:Date.now()},...j]);setLastCI(new Date().toDateString());setShowCI(false);}} onCraving={handleCraving}/>}
      {showWS&&!celebMs&&!showOnboarding&&!showCI&&<WeeklyOverlay journal={journal} onDone={()=>{setLastWS(getWeekKey());setShowWS(false);}} onCraving={handleCraving}/>}

      <div style={S.nav}>
        {[["home","Home"],["journal","Journal"],["milestones","Milestones"],["settings","Settings"]].map(it => (
          <button key={it[0]} style={S.navBtn(tab===it[0])} onClick={()=>setTab(it[0])}>{it[1]}</button>
        ))}
      </div>

      <div onTouchStart={onTabTouchStart} onTouchMove={onTabTouchMove} onTouchEnd={onTabTouchEnd} style={{overflow:"hidden",touchAction:"pan-y"}}>
      <div style={{display:"flex",width:`${tabOrder.length*100}%`,transform:`translateX(calc(${-tabOrder.indexOf(tab)*(100/tabOrder.length)}% + ${dragX}px))`,transition:dragging?"none":"transform 0.32s cubic-bezier(0.22,1,0.36,1)"}}>
      <div style={{width:`${100/tabOrder.length}%`,flexShrink:0,boxSizing:"border-box"}}>
      {(
        <div>
          <div style={{marginBottom:12}}>
            {(()=>{
              const lid=longestId, lAd=adObj(lid), lE=lid?elapsed(lid):null;
              const days=lE?lE.days:0, best=bests[lid]||0;
              const hero=getHeroLine(days,best,profile,lAd?.label||"");
              const showEyebrow = !streakName;
              return (<>
                {showEyebrow&&<p style={{margin:0,fontSize:T.label.eyebrow,color:C.purple,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>Today</p>}
                <p style={{margin:showEyebrow?"6px 0 4px":"0 0 4px",fontSize:22,fontWeight:600,color:C.textPrimary,letterSpacing:"-0.01em",lineHeight:1.25}}>{streakName||hero.headline}</p>
                {hero.sub&&<p style={{margin:0,fontSize:14,color:C.textSecondary,lineHeight:1.5}}>{hero.sub}</p>}
              </>);
            })()}
          </div>
          {multi&&(
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
              {sorted.map(id=>{const a=adObj(id),active=insSelected===id;return(
                <button key={id} onClick={()=>setInsId(id)} style={{padding:"8px 14px",borderRadius:20,fontSize:13,cursor:"pointer",border:active?`1.5px solid ${C.purple}`:`1px solid ${C.border}`,background:active?C.purpleFaint:C.surfaceHigh,color:active?C.textPrimary:C.textSecondary,fontWeight:active?500:400,display:"inline-flex",alignItems:"center",gap:6}}>
                  <Icon name={id} size={14} color={active?C.purple:C.textSecondary}/>{a?.label}
                </button>
              );})}
            </div>
          )}
          {insSelected&&(()=>{
            const id=insSelected, a=adObj(id), isL=id===longestId, best=bests[id]||0;
            return(
              <div style={{...S.card,border:isL&&multi?`1.5px solid ${C.purple}`:`1px solid ${C.border}`,padding:"1.5rem",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                  <span style={{fontSize:15,fontWeight:500,color:C.textPrimary,display:"inline-flex",alignItems:"center",gap:8}}><Icon name={id} size={16} color={C.purple}/>{a?.label}-free</span>
                  {isL&&multi&&<span style={S.badge("info")}>Longest streak</span>}
                </div>
                <StreakCounter startDate={startDates[id]} isLongest={isL} best={best} dailyCost={dailyCosts[id]||""}/>
              </div>
            );
          })()}
          {insSelected&&(
            <div style={S.card}>
              <p style={S.h2}>Patterns</p>
              <InsightsPanel journal={journal} addId={insSelected} tips={(TIPS[insSelected]||[]).slice(0,3)}/>
            </div>
          )}
          {EXTRA_QUESTIONS.some(q=>!profile||profile[q.id]==null)&&(
          <div style={{...S.card,marginTop:4}}>
            <p style={{fontSize:13,color:C.textSecondary,margin:"0 0 6px",fontWeight:500}}>Want better insights?</p>
            <p style={{...S.muted,fontSize:12,margin:"0 0 10px"}}>Answer a few questions to unlock more personalised distraction tips.</p>
            {!showExtra?(
              <button style={{...S.btnS,marginTop:0,fontSize:13,padding:"10px 14px"}} onClick={()=>{setShowExtra(true);setExtraStep(0);}}>Personalise further</button>
            ):(
              <div>
                {(()=>{
                  const eq=EXTRA_QUESTIONS[extraStep];
                  return(
                    <div>
                      <p style={{fontSize:14,fontWeight:500,color:C.textPrimary,margin:"0 0 12px"}}>{eq.label} <span style={{fontSize:11,color:C.textMuted}}>({extraStep+1}/{EXTRA_QUESTIONS.length})</span></p>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {eq.options.map(opt=>(
                          <button key={opt} onClick={()=>{setProfile(p=>({...p,[eq.id]:opt==="Prefer not to say"?"No":opt}));if(extraStep<EXTRA_QUESTIONS.length-1)setExtraStep(s=>s+1);else setShowExtra(false);}} style={{...S.btnS,textAlign:"left",padding:"12px 14px",fontSize:13,marginTop:0,borderRadius:10,color:C.textPrimary}}>{opt}</button>
                        ))}
                      </div>
                      <button style={{...S.btnS,marginTop:10,fontSize:12}} onClick={()=>setShowExtra(false)}>Done for now</button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          )}
          {ec?.name&&ec?.phone&&<a href={`tel:${ec.phone}`} style={{display:"block",textAlign:"center",padding:"13px",borderRadius:12,border:`1px solid ${C.border}`,color:C.textSecondary,fontSize:14,textDecoration:"none",marginTop:4,marginBottom:4}}>Reach out<span style={{display:"block",fontSize:12,color:C.textMuted,marginTop:2}}>{ec.name}</span></a>}
          <button onClick={handleSlip} style={{display:"block",margin:"24px auto 0",background:"none",border:"none",color:C.textMuted,fontSize:13,cursor:"pointer",padding:"8px 14px",textDecoration:"underline",textUnderlineOffset:3}}>I had a setback</button>
        </div>
      )}
      </div>
      <div style={{width:`${100/tabOrder.length}%`,flexShrink:0,boxSizing:"border-box"}}>
      {(
        <div>
          {showSlipFU&&(
            <div className="fu" style={{...S.card,border:`1px solid ${C.borderMid}`,background:C.purpleFaint,marginBottom:16}}>
              <p style={{fontSize:15,fontWeight:500,color:C.textPrimary,margin:"0 0 8px"}}>You came back. That matters.</p>
              <p style={{...S.muted,margin:"0 0 14px",fontSize:13}}>{slipMsg}</p>
              <button style={{...S.btnS,marginTop:0,fontSize:13,padding:"10px 16px",width:"auto"}} onClick={()=>setShowSlipFU(false)}>Thanks, I needed that</button>
            </div>
          )}
          <MoodWeek journal={journal}/>
          {(()=>{const ins=computeInsights(journal); if(!ins) return null; const cards=[]; if(ins.peakTime) cards.push({label:"Peak craving time",value:ins.peakTime,sub:`${ins.peakCount} entries logged at this time`}); if(ins.riskDay) cards.push({label:"Highest-risk day",value:ins.riskDay,sub:`${ins.riskRate}% slip rate`}); if(ins.slipEmo) cards.push({label:"Trigger emotion",value:ins.slipEmo,sub:`${ins.slipCount} slips paired with this`}); if(ins.last7Rate!=null){ const delta=ins.prev7Rate!=null?ins.last7Rate-ins.prev7Rate:null; cards.push({label:"Last 7 days",value:`${ins.last7Rate}% resisted`,sub:delta==null?"Build more history":delta>0?`Up ${delta} pts vs prior week`:delta<0?`Down ${Math.abs(delta)} pts vs prior week`:"Steady vs prior week"}); } return (
            <div style={S.card}>
              <p style={{...S.h2,marginTop:0}}>Predictive insights</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {cards.map((c,i)=>(<div key={i} style={{...S.cardHigh,padding:"12px 14px"}}><p style={{fontSize:10,color:C.textMuted,margin:"0 0 4px",letterSpacing:"0.08em",textTransform:"uppercase"}}>{c.label}</p><p style={{fontSize:15,fontWeight:600,color:C.textPrimary,margin:"0 0 4px"}}>{c.value}</p><p style={{fontSize:11,color:C.textSecondary,margin:0,lineHeight:1.4}}>{c.sub}</p></div>))}
              </div>
            </div>
          ); })()}
          {journal.length>0&&(
            <div style={S.card}>
              <p style={S.h2}>Your story ({journal.length} entries)</p>
              {journal.slice(0,20).map(e=>{const a=adObj(e.addiction);return(
                <div key={e.id} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1,marginRight:10}}>
                      {multi&&<span style={{display:"inline-flex",marginRight:6,color:C.textMuted,verticalAlign:"middle"}}><Icon name={e.addiction} size={12} color={C.textMuted}/></span>}
                      <span style={{fontSize:14,fontWeight:500,color:C.textPrimary}}>{e.emotion}</span>
                      <span style={{color:C.textSecondary,fontSize:13}}> - {e.situation}</span>
                      <div style={{fontSize:11,color:C.textMuted,marginTop:3}}>{e.time} - {e.date}</div>
                      {e.note&&<p style={{fontSize:13,color:C.textSecondary,margin:"5px 0 0",fontStyle:"italic",lineHeight:1.5}}>{e.note}</p>}
                    </div>
                    <span style={{...S.badge(e.survived?"success":"danger"),flexShrink:0}}>{e.survived?"Resisted":"Slipped"}</span>
                  </div>
                </div>
              );})}
            </div>
          )}
          {journal.length===0&&!showLogForm&&(
            <div style={{...S.card,textAlign:"center",padding:"2rem 1.5rem"}}>
              <p style={{fontSize:15,fontWeight:500,color:C.textPrimary,margin:"0 0 8px"}}>Your story starts here</p>
              <p style={{...S.muted,fontSize:13,margin:0}}>Every craving you log builds a picture of your patterns. The more you capture, the more you unlock.</p>
            </div>
          )}
          {!showLogForm ? (
            <>
              <div style={{...S.cardHigh,marginBottom:12}}>
                <p style={{fontSize:10,color:C.purple,margin:"0 0 6px",letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:600}}>Today's prompt</p>
                <p style={{fontSize:14,color:C.textPrimary,margin:0,lineHeight:1.5}}>{getDailyPrompt()}</p>
              </div>
              <button style={{...S.btnP,marginTop:4}} onClick={()=>setShowLogForm(true)}>+ Log a craving</button>
            </>
          ) : (
            <div style={S.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <p style={{...S.h2,marginBottom:0}}>Log a craving</p>
                <button onClick={()=>{setShowLogForm(false);setJEntry({addiction:"",emotion:"",situation:"",time:"",survived:null,note:""});}} style={{fontSize:13,color:C.textMuted,background:"none",border:"none",cursor:"pointer",padding:0}}>Cancel</button>
              </div>
              {multi&&(
                <div style={{marginBottom:12}}>
                  <label style={S.label}>Which addiction?</label>
                  <select style={S.sel} value={jEntry.addiction} onChange={e=>setJEntry(j=>({...j,addiction:e.target.value}))}>
                    <option value="">Select...</option>
                    {addictions.map(id=>{const a=adObj(id);return<option key={id} value={id}>{a?.label}</option>;})}
                  </select>
                </div>
              )}
              {[["emotion","How are you feeling?",EMOTIONS],["situation","What's the situation?",SITUATIONS],["time","What time of day is it?",TIMES]].map(it=>(
                <div key={it[0]} style={{marginBottom:12}}>
                  <label style={S.label}>{it[1]}</label>
                  <select style={S.sel} value={jEntry[it[0]]} onChange={e=>{const k=it[0];setJEntry(j=>({...j,[k]:e.target.value}));}}>
                    <option value="">Select...</option>
                    {it[2].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{marginBottom:14}}>
                <label style={S.label}>Anything else? (optional)</label>
                <textarea rows={2} placeholder="Add a note - what was going through your mind?" style={{...S.inp,resize:"vertical",lineHeight:1.6,fontSize:13}} value={jEntry.note||""} onChange={e=>setJEntry(j=>({...j,note:e.target.value}))}/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={S.label}>Did you resist?</label>
                <div style={{display:"flex",gap:8}}>
                  {[true,false].map(v=>(
                    <button key={String(v)} onClick={()=>setJEntry(j=>({...j,survived:v}))} style={{padding:"10px 0",borderRadius:10,fontSize:14,cursor:"pointer",fontWeight:500,flex:1,border:jEntry.survived===v?"none":`1px solid ${C.border}`,background:jEntry.survived===v?(v?C.success:C.danger):C.surfaceHigh,color:jEntry.survived===v?"#fff":C.textSecondary,marginTop:0}}>
                      {v?"Yes, I resisted":"No, I slipped"}
                    </button>
                  ))}
                </div>
              </div>
              <button style={S.btnP} onClick={()=>{saveJournal();setShowLogForm(false);}}>Save this entry</button>
            </div>
          )}
        </div>
      )}
      </div>
      <div style={{width:`${100/tabOrder.length}%`,flexShrink:0,boxSizing:"border-box"}}>
      {(
        <div>
          {addictions.map(id=>{
            const a=adObj(id), e=elapsed(id);
            const ms=e&&dailyCosts[id]&&parseFloat(dailyCosts[id])>0?(e.days*parseFloat(dailyCosts[id])).toFixed(2):null;
            const allMs=[...(MILESTONES[id]||[]),...(customMs[id]||[])].sort((x,y)=>x.days-y.days);
            const reached=allMs.filter(m=>e&&e.days>=m.days);
            const upcoming=allMs.filter(m=>!e||e.days<m.days).slice(0,3);
            return(
              <div key={id} style={S.card}>
                <p style={{...S.h2,display:"inline-flex",alignItems:"center",gap:8}}><Icon name={id} size={18} color={C.purple}/>{a?.label} milestones</p>
                {ms&&<div style={{background:C.successBg,border:"1px solid rgba(76,175,130,0.2)",borderRadius:12,padding:"14px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,color:C.success}}>Total saved over {e.days} days</div><div style={{fontSize:22,fontWeight:600,color:C.success}}>${parseFloat(ms).toLocaleString()}</div></div>}
                {reached.map(m=>(
                  <div key={`${m.days}-r`} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,marginTop:1,background:C.purple,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff"}}>✓</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{fontSize:14,fontWeight:500,color:C.textPrimary}}>{m.label}{m.custom&&<span style={{fontSize:11,color:C.purple,marginLeft:6}}>custom</span>}</div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>setCelebMs({days:m.days,phrase:m.phrase||"of showing up"})} style={{fontSize:11,color:C.purple,background:"none",border:"none",cursor:"pointer",padding:0}}>view card</button>
                          {m.custom&&<button onClick={()=>removeCustomM(id,m.days)} style={{fontSize:11,color:C.danger,background:"none",border:"none",cursor:"pointer",padding:0}}>remove</button>}
                        </div>
                      </div>
                      <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{m.detail}</div>
                    </div>
                  </div>
                ))}
                {upcoming.length>0&&(
                  <div>
                    <p style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",margin:"12px 0 8px"}}>Coming up</p>
                    {upcoming.map(m=>(
                      <div key={`${m.days}-u`} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                        <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,marginTop:1,background:C.surfaceHigh,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.textMuted}}>○</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <div style={{fontSize:14,fontWeight:400,color:C.textSecondary}}>{m.label}{m.custom&&<span style={{fontSize:11,color:C.purple,marginLeft:6}}>custom</span>}</div>
                            {m.custom&&<button onClick={()=>removeCustomM(id,m.days)} style={{fontSize:11,color:C.danger,background:"none",border:"none",cursor:"pointer",padding:0}}>remove</button>}
                          </div>
                          <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{m.detail}</div>
                          {e&&<div style={{fontSize:11,color:C.purple,marginTop:4,fontWeight:500}}>{m.days-e.days} days away</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{marginTop:14,display:"flex",gap:8,alignItems:"center"}}>
                  <input type="number" min="1" placeholder="Add a custom day goal e.g. 50" style={{...S.inp,flex:1,fontSize:13,padding:"9px 12px"}} value={newMsInput[id]||""} onChange={ev=>setNewMsInput(v=>({...v,[id]:ev.target.value}))}/>
                  <button onClick={()=>addCustomM(id)} style={{...S.btnP,width:"auto",padding:"9px 16px",marginTop:0,fontSize:13,flexShrink:0}}>Add</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
      <div style={{width:`${100/tabOrder.length}%`,flexShrink:0,boxSizing:"border-box"}}>
      {(
        <div>
          <div style={S.card}>
            <p style={S.h2}>Your recovery name</p>
            <input placeholder="e.g. My Journey, Project Me..." style={S.inp} value={streakName} onChange={e=>setStreakName(e.target.value)}/>
            <p style={{...S.muted,fontSize:11,marginTop:8}}>Shown on your home screen. Leave blank to use default.</p>
          </div>
          <div style={S.card}>
            <p style={S.h2}>Emergency contact</p>
            <div style={{marginBottom:10}}><label style={S.label}>Name</label><input placeholder="e.g. Alex" style={S.inp} value={ec.name} onChange={e=>setEc(c=>({...c,name:e.target.value}))}/></div>
            <div><label style={S.label}>Phone number</label><input type="tel" style={S.inp} value={ec.phone} onChange={e=>setEc(c=>({...c,phone:e.target.value}))}/></div>
          </div>
          <div style={S.card}>
            <p style={S.h2}>Addictions tracked</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {ADDICTIONS.map(a=>{const sel=addictions.includes(a.id);return(
                <div key={a.id} onClick={()=>toggleAdd(a.id)} style={{padding:"12px",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",gap:8,border:sel?`1.5px solid ${C.purple}`:`1px solid ${C.border}`,background:sel?C.purpleFaint:C.surfaceHigh,fontSize:13,color:sel?C.textPrimary:C.textSecondary}}>
                  <Icon name={a.id} size={14} color={sel?C.purple:C.textSecondary}/>{a.label}{sel&&<span style={{marginLeft:"auto",fontSize:10,color:C.purple}}>✓</span>}
                </div>
              );})}
            </div>
          </div>
          <div style={S.card}>
            <p style={S.h2}>Streak dates</p>
            {addictions.map(id=>{
              const a=adObj(id), e=elapsed(id), cd=e?e.days:0;
              const dv=sdInput[id]!==undefined?sdInput[id]:String(cd);
              const applyD=days=>{const d=new Date();d.setDate(d.getDate()-days);d.setHours(0,0,0,0);setStartDates(sd=>({...sd,[id]:d.toISOString()}));};
              return(
                <div key={id} style={{marginBottom:14}}>
                  <label style={{...S.label,display:"inline-flex",alignItems:"center",gap:6}}><Icon name={id} size={13} color={C.textSecondary}/>{a?.label} - days clean</label>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <button aria-label="Decrease days" onClick={()=>{const n=Math.max(0,cd-1);setSdInput(s=>({...s,[id]:String(n)}));applyD(n);}} style={{width:42,height:42,borderRadius:8,border:`1px solid ${C.border}`,background:C.surfaceHigh,color:C.textPrimary,fontSize:22,cursor:"pointer",flexShrink:0}}>-</button>
                    <input type="number" min="0" value={dv} onChange={ev=>{const r=ev.target.value;setSdInput(s=>({...s,[id]:r}));if(r===""||r==="-")return;const v=parseInt(r,10);if(!isNaN(v)&&v>=0)applyD(v);}} onBlur={()=>setSdInput(s=>({...s,[id]:String(cd)}))} style={{...S.inp,textAlign:"center",fontSize:18,fontWeight:600,color:C.purple,padding:"8px",flex:1}}/>
                    <span style={{fontSize:13,color:C.textMuted,flexShrink:0}}>days</span>
                    <button aria-label="Increase days" onClick={()=>{const n=cd+1;setSdInput(s=>({...s,[id]:String(n)}));applyD(n);}} style={{width:42,height:42,borderRadius:8,border:`1px solid ${C.border}`,background:C.surfaceHigh,color:C.textPrimary,fontSize:22,cursor:"pointer",flexShrink:0}}>+</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={S.card}>
            <p style={S.h2}>Daily cost per addiction</p>
            {addictions.map(id=>{const a=adObj(id);return(
              <div key={id} style={{marginBottom:12}}>
                <label style={{...S.label,display:"inline-flex",alignItems:"center",gap:6}}><Icon name={id} size={13} color={C.textSecondary}/>{a?.label}</label>
                <div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.textMuted,fontSize:14}}>$</span><input type="number" placeholder="0.00" style={{...S.inp,paddingLeft:24}} value={dailyCosts[id]||""} onChange={e=>setDailyCosts(d=>({...d,[id]:e.target.value}))}/></div>
              </div>
            );})}
          </div>
          <div style={S.card}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <p style={{...S.h2,marginBottom:0}}>Notifications</p>
              <div onClick={()=>setNotifOn(n=>!n)} style={{width:44,height:24,borderRadius:12,background:notifOn?C.purple:C.surfaceHigh,border:`1px solid ${C.border}`,cursor:"pointer",position:"relative",transition:"background 0.2s"}}><div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:notifOn?22:2,transition:"left 0.2s"}}/></div>
            </div>
            <p style={{...S.muted,fontSize:12,marginBottom:14}}>Notifications are discreet - they won't reveal what this app is about.</p>
            {notifOn&&(
              <div>
                <div style={{marginBottom:12}}><label style={S.label}>Reminder time</label><input type="time" style={S.inp} value={notifTime} onChange={e=>setNotifTime(e.target.value)}/></div>
                <div><label style={S.label}>Message style</label>{NOTIF_MESSAGES.map(m=><button key={m} onClick={()=>setNotifMsg(m)} style={{...S.btnS,textAlign:"left",marginTop:8,padding:"12px 14px",fontSize:13,borderRadius:10,border:notifMsg===m?`1.5px solid ${C.purple}`:`1px solid ${C.border}`,background:notifMsg===m?C.purpleFaint:"transparent",color:notifMsg===m?C.textPrimary:C.textSecondary}}>{m}</button>)}</div>
                <div style={{marginTop:14,padding:"12px 14px",background:C.surfaceHigh,borderRadius:10,border:`1px solid ${C.border}`}}><p style={{fontSize:11,color:C.textMuted,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Preview</p><p style={{fontSize:13,color:C.textPrimary,margin:0}}>{notifMsg}</p></div>
                <p style={{...S.muted,fontSize:11,marginTop:10}}>Connecting notifications requires the native app build.</p>
              </div>
            )}
          </div>
          <div style={S.card}>
            <p style={{...S.muted,fontSize:12,margin:"0 0 12px"}}>No account required. All data stays on your device. This app is not a substitute for medical or therapeutic support.</p>
            <button style={S.btnD} onClick={()=>setConfirmReset(true)}>Reset everything</button>
            {confirmReset&&(
              <div style={{marginTop:14,background:C.dangerBg,border:"1px solid rgba(224,92,106,0.3)",borderRadius:14,padding:"1.25rem 1.5rem"}}>
                <p style={{fontSize:15,fontWeight:500,color:C.danger,margin:"0 0 6px"}}>Are you sure?</p>
                <p style={{...S.muted,fontSize:13,margin:"0 0 16px"}}>This will permanently delete all your streaks, journal entries, milestones, and personal settings. There is no way to undo this.</p>
                <div style={{display:"flex",gap:8}}>
                  <button style={{...S.btnD,marginTop:0,flex:1}} onClick={doReset}>Yes, delete everything</button>
                  <button style={{...S.btnS,marginTop:0,flex:1}} onClick={()=>setConfirmReset(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
      </div>
      </div>

      {showFloat&&(
        <div style={S.fbar}>
          {showFirstHint&&(
            <div onClick={()=>setShowFirstHint(false)} style={{position:"absolute",bottom:"calc(100% - 6px)",left:0,right:0,display:"flex",justifyContent:"center",pointerEvents:"auto",cursor:"pointer"}}>
              <div className="fu" style={{background:C.purple,color:"#fff",padding:"10px 16px",borderRadius:T.radius.md,fontSize:13,fontWeight:500,boxShadow:"0 6px 20px rgba(139,110,255,0.4)",maxWidth:300,textAlign:"center",position:"relative"}}>
                Tap this anytime — even when you're not craving
                <div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent",borderTop:`7px solid ${C.purple}`}}/>
              </div>
            </div>
          )}
          <button className="cbtn" style={S.fbtn} onClick={handleCraving}>I'm craving</button>
        </div>
      )}
    </div>
  );
}
