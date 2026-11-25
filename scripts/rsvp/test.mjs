import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
function load(path, resolve) {
 const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const compiled = {exports:{}};
 new Function('require','module','exports',code)(resolve,compiled,compiled.exports);
 return compiled.exports;
}
const wedding = load('app/wedding.ts', () => { throw new Error('Unexpected import'); }).wedding;
const {POST} = load('app/api/rsvp/route.ts',()=>({wedding}));
const data = {name:'Integration test',guests:2,side:'bride',events:[wedding.events[0].name],food:{day1:'Veg',day2:'Non-veg'},note:'Test only',submissionId:'12345678-1234-1234-1234-123456789012'};
function request(body, origin='http://localhost:3000') { return new Request('http://localhost:3000/api/rsvp',{method:'POST',headers:{origin},body:JSON.stringify(body)}); }
(async()=>{
 assert.equal((await POST(request(data,'https://example.com'))).status,403);
 assert.equal((await POST(request({...data,events:[]}))).status,400);
 assert.equal((await POST(request({...data,guests:21}))).status,400);
 assert.equal((await POST(request({...data,food:{day1:'Invalid'}}))).status,400);
 assert.equal((await POST(request({...data,name:'  '}))).status,400);
 delete process.env.RSVP_SCRIPT_URL; delete process.env.RSVP_SCRIPT_SECRET;
 assert.equal((await POST(request(data))).status,503);
 process.env.RSVP_SCRIPT_URL='https://script.google.com/example'; process.env.RSVP_SCRIPT_SECRET='test-secret';
 global.fetch = async (url,options)=>{const payload=JSON.parse(options.body); assert.equal(payload.secret,'test-secret'); assert.deepEqual(payload.events,data.events); return Response.json({ok:true,receipt:'receipt-1'});};
 assert.deepEqual(await (await POST(request(data))).json(),{ok:true,receipt:'receipt-1'});
 global.fetch = async ()=>Response.json({ok:false});
 assert.equal((await POST(request(data))).status,502);
 global.fetch = async ()=>{throw new Error('network failure')};
 assert.equal((await POST(request(data))).status,502);
 console.log('Passed 9 RSVP API checks: validation, origin, configuration, saving, rejection and network failure.');
})().catch(e=>{console.error(e); process.exitCode=1});
