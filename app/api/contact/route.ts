import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createHash } from 'node:crypto';
import { contactSchema } from '@/lib/validators';
import { getDb } from '@/lib/mongo';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 const length=Number(req.headers.get('content-length')||0);if(length>16000)return NextResponse.json({error:'Message is too large.'},{status:413});
 let raw:unknown;try{raw=await req.json()}catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
 // A filled honeypot is quietly discarded; no storage or email is performed.
 if(typeof raw==='object'&&raw!==null&&'website' in raw&&(raw as {website?:unknown}).website)return NextResponse.json({ok:true});
 const result=contactSchema.safeParse(raw);if(!result.success)return NextResponse.json({error:result.error.issues[0]?.message||'Please check your details.'},{status:400});
 if(!process.env.MONGODB_URI||!process.env.RESEND_API_KEY||!process.env.CONTACT_FROM_EMAIL)return NextResponse.json({error:'Contact service is not configured yet. Please email Joshva directly.'},{status:503});
 try{
  const db=await getDb();const now=Date.now();const hour=Math.floor(now/3600000);const forwarded=req.headers.get('x-forwarded-for');const ip=(forwarded?.split(',')[0]?.trim()||req.headers.get('x-real-ip')||'unknown').slice(0,128);const key=createHash('sha256').update(`${ip}:${hour}`).digest('hex');
  // Atomic fixed-window counter stored in MongoDB so it works across serverless instances.
  const counters=db.collection('contact_rate_limits');await counters.createIndex({expiresAt:1},{expireAfterSeconds:0});const count=await counters.findOneAndUpdate({_id:key as never},{$inc:{count:1},$setOnInsert:{expiresAt:new Date((hour+2)*3600000)}},{upsert:true,returnDocument:'after'});if((count?.count||0)>5)return NextResponse.json({error:'Too many messages. Please try again later.'},{status:429,headers:{'Retry-After':String(Math.ceil(((hour+1)*3600000-now)/1000))}});
  const {name,email,message}=result.data;const messages=db.collection('contact_messages');const inserted=await messages.insertOne({name,email,message,createdAt:new Date(),deliveryStatus:'pending'});
  const resend=new Resend(process.env.RESEND_API_KEY);const sent=await resend.emails.send({from:process.env.CONTACT_FROM_EMAIL,to:process.env.CONTACT_TO_EMAIL||'joshvajoshva406@gmail.com',replyTo:email,subject:`Portfolio message from ${name}`,text:`Name: ${name}\nEmail: ${email}\n\n${message}`});
  if(sent.error){await messages.updateOne({_id:inserted.insertedId},{$set:{deliveryStatus:'failed'}});console.error('Contact email delivery failed:',sent.error.message);return NextResponse.json({error:'Your message was saved, but email delivery failed. Please email Joshva directly.'},{status:502});}
  await messages.updateOne({_id:inserted.insertedId},{$set:{deliveryStatus:'sent',resendId:sent.data?.id}});return NextResponse.json({ok:true});
 }catch(error){console.error('Contact service failed:',error instanceof Error?error.message:'unknown error');return NextResponse.json({error:'The contact service is unavailable. Please email Joshva directly.'},{status:503});}
}
