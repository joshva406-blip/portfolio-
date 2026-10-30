import { MongoClient } from 'mongodb';
let clientPromise:Promise<MongoClient>|undefined;
export function getMongo(){const uri=process.env.MONGODB_URI;if(!uri)throw new Error('MONGODB_URI is not configured');if(!clientPromise)clientPromise=new MongoClient(uri,{maxPoolSize:10,serverSelectionTimeoutMS:5000}).connect().catch(error=>{clientPromise=undefined;throw error});return clientPromise;}
export async function getDb(){const client=await getMongo();return client.db(process.env.MONGODB_DB||'joshva_portfolio');}
