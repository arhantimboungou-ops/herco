
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput,
  FlatList, Modal, StyleSheet, Alert, useWindowDimensions,
  KeyboardAvoidingView, Platform, StatusBar
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── HELPERS ────────────────────────────────────────────────
// Responsive breakpoints — réactif au redimensionnement (rotation, navigateur)
// Téléphone < 600px | Tablette 600-1023px | Ordinateur / grande tablette ≥1024px
function getBreakpoint(width) {
  const isPhone    = width < 600;
  const isTablet   = width >= 600 && width < 1024;
  const isDesktop  = width >= 1024;
  const isTabletUp = width >= 600; // tablette OU ordinateur → mise en page côte à côte
  let numCols = 2;
  if (width >= 1400) numCols = 6;
  else if (width >= 1100) numCols = 5;
  else if (width >= 600)  numCols = 4;
  else if (width >= 420)  numCols = 3;
  else numCols = 2;
  return { width, isPhone, isTablet, isDesktop, isTabletUp, numCols };
}
function useBP() {
  const { width, height } = useWindowDimensions();
  return { ...getBreakpoint(width), height };
}
const B = { dark:'#0B2619', mid:'#1A4D2E', accent:'#C97D1A', sidebar:'#111827',
            bg:'#F4F6F9', danger:'#DC2626', info:'#1A7AB5', purple:'#7B5EA7' };
const CFA = (n) => Math.round(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ') + ' FCFA';
const TVA = 0.18;
const ht  = (ttc) => Math.round(ttc / 1.18);
const mg  = (ttc, cost) => ht(ttc) - cost;
const mgP = (ttc, cost) => ht(ttc)>0 ? Math.round(mg(ttc,cost)/ht(ttc)*100) : 0;
const fmtD= (d)=>`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
const fmtT= (d)=>`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
const fmtDT=(d)=>`${fmtD(d)} ${fmtT(d)}`;
const genTk=()=>'HRC-'+String(Date.now()).slice(-6);

// ─── DATA ────────────────────────────────────────────────────
const CATS=[
  {id:1,name:'Plats Chauds',icon:'🍽️',color:'#C97D1A'},
  {id:2,name:'Poissons',icon:'🐟',color:'#1A7AB5'},
  {id:3,name:'Grillades',icon:'🔥',color:'#C84B1A'},
  {id:4,name:'Entrées',icon:'🥗',color:'#2E9E6B'},
  {id:5,name:'Bières',icon:'🍺',color:'#E6AC00'},
  {id:6,name:'Softs',icon:'🥤',color:'#7B5EA7'},
  {id:7,name:'Alcools',icon:'🥃',color:'#1A6B7A'},
  {id:8,name:'Desserts',icon:'🍰',color:'#C91A7A'},
];

const INIT_PRODS=[
  {id:1,catId:1,name:'Saka-Saka au Poisson',unit:'Portion',costPrice:1500,priceTTC:3500,stock:20,stockMin:5,active:true},
  {id:2,catId:1,name:'Moambe Poulet',unit:'Portion',costPrice:2000,priceTTC:4500,stock:15,stockMin:4,active:true},
  {id:3,catId:1,name:'Maboke Capitaine',unit:'Portion',costPrice:2500,priceTTC:5500,stock:10,stockMin:3,active:true},
  {id:4,catId:1,name:'Riz Sauce Arachide',unit:'Portion',costPrice:1200,priceTTC:3000,stock:25,stockMin:6,active:true},
  {id:5,catId:1,name:'Ntoba Mbinzo',unit:'Portion',costPrice:1800,priceTTC:4000,stock:12,stockMin:3,active:true},
  {id:6,catId:2,name:'Capitaine Braisé',unit:'Pièce',costPrice:3000,priceTTC:6500,stock:8,stockMin:2,active:true},
  {id:7,catId:2,name:'Silure Fumé',unit:'Portion',costPrice:2000,priceTTC:4500,stock:10,stockMin:3,active:true},
  {id:8,catId:2,name:'Carpe Braisée',unit:'Pièce',costPrice:2200,priceTTC:5000,stock:8,stockMin:2,active:true},
  {id:9,catId:3,name:'Poulet Braisé ½',unit:'½ Poulet',costPrice:2500,priceTTC:5500,stock:15,stockMin:4,active:true},
  {id:10,catId:3,name:'Poulet Entier',unit:'Entier',costPrice:4500,priceTTC:10000,stock:8,stockMin:2,active:true},
  {id:11,catId:3,name:'Brochettes Bœuf',unit:'Brochette',costPrice:1200,priceTTC:3000,stock:20,stockMin:5,active:true},
  {id:12,catId:3,name:'Côtes de Porc',unit:'Portion',costPrice:1800,priceTTC:4500,stock:12,stockMin:3,active:true},
  {id:13,catId:4,name:'Salade Mixte',unit:'Assiette',costPrice:700,priceTTC:2000,stock:15,stockMin:4,active:true},
  {id:14,catId:4,name:'Beignets Crevettes',unit:'Assiette',costPrice:1500,priceTTC:3500,stock:10,stockMin:3,active:true},
  {id:15,catId:5,name:'Primus 65cl',unit:'Bouteille',costPrice:700,priceTTC:1500,stock:100,stockMin:20,active:true},
  {id:16,catId:5,name:'Ngok 65cl',unit:'Bouteille',costPrice:700,priceTTC:1500,stock:80,stockMin:20,active:true},
  {id:17,catId:5,name:'Beaufort 65cl',unit:'Bouteille',costPrice:700,priceTTC:1500,stock:60,stockMin:15,active:true},
  {id:18,catId:5,name:'Guinness 60cl',unit:'Bouteille',costPrice:900,priceTTC:2000,stock:50,stockMin:10,active:true},
  {id:19,catId:5,name:'Flag 65cl',unit:'Bouteille',costPrice:700,priceTTC:1500,stock:70,stockMin:15,active:true},
  {id:20,catId:6,name:'Coca-Cola 50cl',unit:'Bouteille',costPrice:350,priceTTC:800,stock:100,stockMin:20,active:true},
  {id:21,catId:6,name:'Fanta 50cl',unit:'Bouteille',costPrice:350,priceTTC:800,stock:80,stockMin:15,active:true},
  {id:22,catId:6,name:'Eau Minérale 50cl',unit:'Bouteille',costPrice:200,priceTTC:500,stock:150,stockMin:30,active:true},
  {id:23,catId:6,name:'Eau Minérale 1.5L',unit:'Bouteille',costPrice:400,priceTTC:1000,stock:100,stockMin:20,active:true},
  {id:24,catId:6,name:'Jus de Fruits 1L',unit:'Bouteille',costPrice:600,priceTTC:1500,stock:40,stockMin:10,active:true},
  {id:25,catId:7,name:'Whisky J&B verre',unit:'Verre',costPrice:1200,priceTTC:3000,stock:30,stockMin:5,active:true},
  {id:26,catId:7,name:"Gin Gordon's verre",unit:'Verre',costPrice:900,priceTTC:2500,stock:25,stockMin:5,active:true},
  {id:27,catId:7,name:'Vin Rouge verre',unit:'Verre',costPrice:700,priceTTC:2000,stock:40,stockMin:8,active:true},
  {id:28,catId:8,name:'Salade de Fruits',unit:'Verrine',costPrice:700,priceTTC:2000,stock:15,stockMin:4,active:true},
  {id:29,catId:8,name:'Crème Caramel',unit:'Verrine',costPrice:500,priceTTC:1500,stock:10,stockMin:3,active:true},
];

const INIT_TABLES=[
  {id:1,name:'T01',zone:'Salle',cap:4,status:'libre'},{id:2,name:'T02',zone:'Salle',cap:4,status:'libre'},
  {id:3,name:'T03',zone:'Salle',cap:6,status:'libre'},{id:4,name:'T04',zone:'Salle',cap:2,status:'libre'},
  {id:5,name:'T05',zone:'Salle',cap:4,status:'libre'},{id:6,name:'T06',zone:'Salle',cap:8,status:'libre'},
  {id:7,name:'P01',zone:'Terrasse',cap:4,status:'libre'},{id:8,name:'P02',zone:'Terrasse',cap:6,status:'libre'},
  {id:9,name:'B01',zone:'Bar',cap:2,status:'libre'},{id:10,name:'B02',zone:'Bar',cap:2,status:'libre'},
  {id:11,name:'B03',zone:'Bar',cap:2,status:'libre'},{id:12,name:'VIP1',zone:'VIP',cap:8,status:'libre'},
];

const INIT_USERS=[
  {id:1,name:'Admin HERCO',pin:'1234',role:'admin',active:true},
  {id:2,name:'Caissier 1',pin:'0001',role:'caissier',active:true},
  {id:3,name:'Serveur 1',pin:'0002',role:'serveur',active:true},
];

const genOrders=()=>{
  const res=[]; let id=1;
  const now=new Date();
  const tbls=['T01','T02','T03','T05','P01','B01','VIP1'];
  const cash=['Caissier 1','Serveur 1'];
  const pays=['Espèces','Espèces','Mobile Money','Carte Bancaire'];
  for(let d=14;d>=0;d--){
    const base=new Date(now); base.setDate(base.getDate()-d);
    const cnt=4+Math.floor(Math.random()*7);
    for(let i=0;i<cnt;i++){
      const hr=11+Math.floor(Math.random()*11);
      const dt=new Date(base.getFullYear(),base.getMonth(),base.getDate(),hr,Math.floor(Math.random()*60));
      const tot=(3+Math.floor(Math.random()*25))*1000;
      res.push({id:id++,t:`HRC-${String(100000+id).slice(1)}`,tb:tbls[Math.floor(Math.random()*tbls.length)],
        u:cash[Math.floor(Math.random()*cash.length)],dt,tot,sub:Math.round(tot/1.18),
        tva:tot-Math.round(tot/1.18),pay:pays[Math.floor(Math.random()*pays.length)],
        st:'Payé',items:1+Math.floor(Math.random()*4)});
    }
  }
  return res.reverse();
};

// ─── SHARED COMPONENTS ──────────────────────────────────────
const Chip=({label,active,onPress,color})=>(
  <TouchableOpacity onPress={onPress} style={[cs.chip,active&&{backgroundColor:color||B.dark,borderColor:color||B.dark}]}>
    <Text style={[cs.chipTxt,active&&{color:'#fff'}]}>{label}</Text>
  </TouchableOpacity>
);

const KpiCard=({label,value,sub,icon,color})=>(
  <View style={[cs.kpiCard,{borderLeftColor:color||B.accent}]}>
    <Text style={cs.kpiIcon}>{icon}</Text>
    <Text style={[cs.kpiVal,{color:color||B.dark}]}>{value}</Text>
    {sub&&<Text style={cs.kpiSub}>{sub}</Text>}
    <Text style={cs.kpiLabel}>{label}</Text>
  </View>
);

const SimpleBar=({data})=>{
  const max=Math.max(...data.map(d=>d.v),1);
  return(
    <View style={{flexDirection:'row',alignItems:'flex-end',height:100,gap:4,paddingHorizontal:4}}>
      {data.map((d,i)=>(
        <View key={i} style={{flex:1,alignItems:'center'}}>
          <View style={{width:'80%',height:Math.max((d.v/max)*90,2),backgroundColor:d.c||B.accent,borderRadius:3}}/>
          <Text style={{fontSize:7,color:'#999',marginTop:2,textAlign:'center'}}>{d.l}</Text>
        </View>
      ))}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════
function LoginScreen({users,onLogin}){
  const bp=useBP();
  const [step,setStep]=useState('user');
  const [sel,setSel]=useState(null);
  const [pin,setPin]=useState('');
  const [err,setErr]=useState('');
  const ROLE_C={admin:B.accent,caissier:B.mid,serveur:B.info};
  const ROLE_L={admin:'Administrateur',caissier:'Caissier',serveur:'Serveur'};

  const pressKey=(k)=>{
    if(k==='⌫'){setPin(p=>p.slice(0,-1));setErr('');return;}
    if(pin.length>=4)return;
    const np=pin+k;
    setPin(np);
    if(np.length===4){
      const u=users.find(u=>u.id===sel.id&&u.pin===np&&u.active);
      if(u){onLogin(u);}
      else{setErr('PIN incorrect');setTimeout(()=>{setPin('');setErr('');},1000);}
    }
  };

  const keys=['1','2','3','4','5','6','7','8','9','⌫','0','✓'];

  return(
    <View style={[cs.flex1,{backgroundColor:B.dark}]}>
      <StatusBar barStyle="light-content"/>
      <ScrollView contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false}>
        <View style={[cs.loginBg,{flexDirection:bp.isTabletUp?'row':'column',minHeight:bp.isTabletUp?bp.height:undefined}]}>
          {/* Left branding */}
          <View style={[cs.loginLeft,!bp.isTabletUp&&{padding:24,alignItems:'center'}]}>
            <View style={cs.logoBox}><Text style={{fontSize:40}}>🍽️</Text></View>
            <Text style={cs.logoTitle}>HERCO</Text>
            <Text style={cs.logoSub}>Restaurant & Lounge Bar</Text>
            <Text style={cs.logoCity}>Brazzaville, Congo</Text>
            {bp.isTabletUp&&(
              <View style={{marginTop:32,gap:12}}>
                {[['🍽️','Restaurant'],['🍺','Bar'],['💰','Caisse'],['📊','Rapports']].map(([ic,t])=>(
                  <View key={t} style={cs.featurePill}>
                    <Text style={{fontSize:20}}>{ic}</Text>
                    <Text style={{color:'rgba(255,255,255,0.8)',fontWeight:'600',fontSize:13}}>{t}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right login */}
          <View style={[cs.loginRight, bp.isTabletUp ? {width:bp.isDesktop?420:360} : {width:'100%',flex:1}]}>
            {step==='user'?(
              <>
                <Text style={cs.loginTitle}>Connexion</Text>
                <Text style={cs.loginHint}>Sélectionnez votre profil</Text>
                <View style={{gap:10,marginTop:16}}>
                  {users.filter(u=>u.active).map(u=>(
                    <TouchableOpacity key={u.id} onPress={()=>{setSel(u);setStep('pin');setPin('');setErr('');}} style={cs.userCard}>
                      <View style={[cs.userAvatar,{backgroundColor:ROLE_C[u.role]||B.mid}]}>
                        <Text style={{color:'#fff',fontWeight:'900',fontSize:18}}>{u.name.charAt(0)}</Text>
                      </View>
                      <View style={{flex:1}}>
                        <Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>{u.name}</Text>
                        <Text style={{color:ROLE_C[u.role],fontSize:12,marginTop:2}}>{ROLE_L[u.role]}</Text>
                      </View>
                      <Text style={{color:'rgba(255,255,255,0.3)',fontSize:20}}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ):(
              <>
                <TouchableOpacity onPress={()=>{setStep('user');setPin('');setErr('');}} style={{marginBottom:12}}>
                  <Text style={{color:'#6EE7B7',fontSize:13}}>‹ Retour</Text>
                </TouchableOpacity>
                <View style={cs.selUserCard}>
                  <View style={[cs.userAvatar,{backgroundColor:ROLE_C[sel?.role]||B.mid,width:36,height:36,borderRadius:10}]}>
                    <Text style={{color:'#fff',fontWeight:'900',fontSize:14}}>{sel?.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>{sel?.name}</Text>
                    <Text style={{color:ROLE_C[sel?.role],fontSize:11}}>{ROLE_L[sel?.role]}</Text>
                  </View>
                </View>
                <Text style={[cs.loginTitle,{fontSize:18,marginTop:16,marginBottom:4}]}>Code PIN</Text>
                <View style={{flexDirection:'row',justifyContent:'center',gap:14,marginBottom:8}}>
                  {[0,1,2,3].map(i=>(
                    <View key={i} style={[cs.pinDot,pin.length>i&&{backgroundColor:B.accent,borderColor:B.accent}]}/>
                  ))}
                </View>
                {!!err&&<Text style={{color:'#F87171',textAlign:'center',fontSize:12,marginBottom:4}}>{err}</Text>}
                <View style={{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:8}}>
                  {keys.map(k=>(
                    <TouchableOpacity key={k} onPress={()=>pressKey(k)} activeOpacity={0.7}
                      style={[cs.pinKey,k==='✓'&&{backgroundColor:B.accent},k==='⌫'&&{backgroundColor:'rgba(220,38,38,0.3)'}]}>
                      <Text style={[cs.pinKeyTxt,k==='⌫'&&{color:'#FCA5A5'}]}>{k}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN — DASHBOARD
// ═══════════════════════════════════════════════════════════
function AdminDashboard({orders,products}){
  const today=fmtD(new Date());
  const todayOrd=orders.filter(o=>fmtD(o.dt)===today&&o.st==='Payé');
  const todayCA=todayOrd.reduce((s,o)=>s+o.tot,0);
  const weekOrd=orders.filter(o=>{const d=new Date();d.setDate(d.getDate()-7);return o.dt>=d&&o.st==='Payé';});
  const weekCA=weekOrd.reduce((s,o)=>s+o.tot,0);
  const lowStock=products.filter(p=>p.active&&p.stock<=p.stockMin).length;
  const ticket=todayOrd.length?Math.round(todayCA/todayOrd.length):0;

  const barData=Array.from({length:7},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-(6-i));
    const day=orders.filter(o=>fmtD(o.dt)===fmtD(d)&&o.st==='Payé');
    const days=['D-6','D-5','D-4','D-3','D-2','Hier','Auj.'];
    return{l:days[i],v:day.reduce((s,o)=>s+o.tot,0),c:i===6?B.accent:B.mid};
  });

  const recentOrds=orders.filter(o=>o.st==='Payé').slice(0,8);

  return(
    <ScrollView style={cs.flex1} showsVerticalScrollIndicator={false}>
      <View style={cs.adminContent}>
        {/* KPIs */}
        <View style={cs.kpiRow}>
          <KpiCard label="CA Aujourd'hui" value={CFA(todayCA)} sub={`${todayOrd.length} ticket(s)`} icon="💰" color={B.accent}/>
          <KpiCard label="CA Cette semaine" value={CFA(weekCA)} sub={`${weekOrd.length} tickets`} icon="📅" color={B.mid}/>
          <KpiCard label="Ticket moyen" value={CFA(ticket)} sub="Aujourd'hui" icon="🎫" color={B.info}/>
          <KpiCard label="Alertes stock" value={`${lowStock}`} sub={lowStock>0?'articles en rupture':'Tout OK ✓'} icon="⚠️" color={lowStock>0?B.danger:'#15803D'}/>
        </View>

        {/* Bar chart */}
        <View style={cs.adminCard}>
          <Text style={cs.cardTitle}>📊 Chiffre d'Affaires — 7 derniers jours</Text>
          <SimpleBar data={barData}/>
          <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:4}}>
            <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
              <View style={{width:10,height:10,borderRadius:2,backgroundColor:B.accent}}/>
              <Text style={{fontSize:10,color:'#999'}}>Aujourd'hui</Text>
            </View>
          </View>
        </View>

        {/* Payment methods */}
        {(()=>{
          const payTot=orders.filter(o=>o.st==='Payé').reduce((s,o)=>s+o.tot,0);
          const methods=['Espèces','Mobile Money','Carte Bancaire'];
          const payData=methods.map(m=>({
            m, tot:orders.filter(o=>o.pay===m&&o.st==='Payé').reduce((s,o)=>s+o.tot,0),
            cnt:orders.filter(o=>o.pay===m&&o.st==='Payé').length,
          }));
          return(
            <View style={cs.adminCard}>
              <Text style={cs.cardTitle}>💳 Ventilation par mode de paiement</Text>
              {payData.map((p,i)=>(
                <View key={p.m} style={cs.payRow}>
                  <Text style={{fontSize:13,color:'#555',flex:1}}>{p.m}</Text>
                  <View style={{flex:2,height:8,backgroundColor:'#F0F0F0',borderRadius:4,overflow:'hidden'}}>
                    <View style={{width:`${payTot?Math.round(p.tot/payTot*100):0}%`,height:'100%',backgroundColor:[B.accent,B.mid,B.info][i],borderRadius:4}}/>
                  </View>
                  <Text style={{fontSize:12,fontWeight:'700',color:B.dark,marginLeft:8,minWidth:60,textAlign:'right'}}>{CFA(p.tot)}</Text>
                </View>
              ))}
            </View>
          );
        })()}

        {/* Recent orders */}
        <View style={cs.adminCard}>
          <Text style={cs.cardTitle}>📋 Transactions récentes</Text>
          <View style={cs.tableHeader}>
            {['Ticket','Table','Caissier','Date','Montant','Paiement'].map(h=>(
              <Text key={h} style={cs.thCell}>{h}</Text>
            ))}
          </View>
          {recentOrds.map(o=>(
            <View key={o.id} style={cs.tableRow}>
              <Text style={[cs.tdCell,{fontFamily:Platform.OS==='ios'?'Courier':'monospace',fontSize:10,color:'#777'}]}>{o.t}</Text>
              <Text style={[cs.tdCell,{fontWeight:'700'}]}>{o.tb}</Text>
              <Text style={cs.tdCell}>{o.u}</Text>
              <Text style={[cs.tdCell,{fontSize:10,color:'#888'}]}>{fmtDT(o.dt)}</Text>
              <Text style={[cs.tdCell,{fontWeight:'900',color:B.dark}]}>{CFA(o.tot)}</Text>
              <View style={[cs.badge,{backgroundColor:'#F3F4F6'}]}><Text style={{fontSize:9,color:'#555',fontWeight:'600'}}>{o.pay}</Text></View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN — PRODUITS
// ═══════════════════════════════════════════════════════════
function AdminProduits({products,setProducts,cats}){
  const [search,setSearch]=useState('');
  const [fCat,setFCat]=useState(0);
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState({name:'',catId:1,unit:'Portion',costPrice:'',priceTTC:'',stock:'',stockMin:'5',active:true});

  const UNITS=['Portion','Assiette','Verre','Bouteille','Pièce','½ Poulet','Entier','Brochette','Verrine','Unité'];

  const filtered=products.filter(p=>
    (!search||p.name.toLowerCase().includes(search.toLowerCase()))&&
    (fCat===0||p.catId===fCat)
  );

  const pHT=(p)=>ht(p.priceTTC);
  const pM=(p)=>mgP(p.priceTTC,p.costPrice);
  const mClr=(pct)=>pct>=40?'#15803D':pct>=20?B.accent:B.danger;

  const openEdit=(p)=>{setForm({...p,costPrice:String(p.costPrice),priceTTC:String(p.priceTTC),stock:String(p.stock),stockMin:String(p.stockMin)});setEditId(p.id);setShowForm(true);};
  const openAdd=()=>{setForm({name:'',catId:cats[0]?.id||1,unit:'Portion',costPrice:'',priceTTC:'',stock:'',stockMin:'5',active:true});setEditId(null);setShowForm(true);};

  const save=()=>{
    if(!form.name||!form.priceTTC||!form.costPrice){Alert.alert('Erreur','Veuillez remplir tous les champs obligatoires.');return;}
    const prod={...form,id:editId||Date.now(),catId:+form.catId,costPrice:+form.costPrice,priceTTC:+form.priceTTC,stock:+form.stock||0,stockMin:+form.stockMin||5};
    if(editId) setProducts(p=>p.map(x=>x.id===editId?prod:x));
    else setProducts(p=>[...p,prod]);
    setShowForm(false);
  };

  const calcHT=form.priceTTC?ht(+form.priceTTC):0;
  const calcM=calcHT&&form.costPrice?calcHT-(+form.costPrice):0;
  const calcMP=calcHT?Math.round(calcM/calcHT*100):0;

  return(
    <View style={cs.flex1}>
      {/* Filters */}
      <View style={cs.filterBar}>
        <TextInput style={cs.searchInput} value={search} onChangeText={setSearch} placeholder="🔍 Rechercher..."/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flex:1,maxWidth:300}}>
          <View style={{flexDirection:'row',gap:6,paddingHorizontal:8}}>
            {[{id:0,name:'Tous'},...cats].map(c=>(
              <Chip key={c.id} label={c.name} active={fCat===c.id} onPress={()=>setFCat(c.id)} color={cats.find(x=>x.id===c.id)?.color||B.dark}/>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity onPress={openAdd} style={cs.addBtn}>
          <Text style={{color:'#fff',fontWeight:'800',fontSize:13}}>＋ Article</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={cs.flex1}>
        <View style={cs.adminContent}>
          <View style={cs.adminCard}>
            <View style={cs.tableHeader}>
              {['Article','Catégorie','Coût','Prix TTC','Marge','Stock','Statut'].map(h=>(
                <Text key={h} style={cs.thCell}>{h}</Text>
              ))}
            </View>
            {filtered.map(p=>{
              const mp=pM(p);
              const mc=mClr(mp);
              const stAlert=p.stock<=p.stockMin;
              return(
                <TouchableOpacity key={p.id} onPress={()=>openEdit(p)} style={cs.tableRow}>
                  <View style={cs.tdCell}>
                    <Text style={{fontSize:12,fontWeight:'700',color:'#1C2826'}} numberOfLines={1}>{p.name}</Text>
                    <Text style={{fontSize:10,color:'#888'}}>{p.unit}</Text>
                  </View>
                  <View style={[cs.badge,{backgroundColor:cats.find(c=>c.id===p.catId)?.color+'22'}]}>
                    <Text style={{fontSize:9,fontWeight:'700',color:cats.find(c=>c.id===p.catId)?.color}}>{cats.find(c=>c.id===p.catId)?.icon}</Text>
                  </View>
                  <Text style={cs.tdCell}>{CFA(p.costPrice)}</Text>
                  <Text style={[cs.tdCell,{fontWeight:'900',color:B.dark}]}>{CFA(p.priceTTC)}</Text>
                  <View style={cs.tdCell}>
                    <Text style={{fontSize:11,fontWeight:'900',color:mc}}>{mp}%</Text>
                    <View style={{width:40,height:4,backgroundColor:'#F0F0F0',borderRadius:2,marginTop:2}}>
                      <View style={{width:`${Math.min(mp,100)}%`,height:'100%',backgroundColor:mc,borderRadius:2}}/>
                    </View>
                  </View>
                  <Text style={[cs.tdCell,stAlert&&{color:B.danger,fontWeight:'700'}]}>{p.stock}{stAlert?' ⚠':''}</Text>
                  <View style={[cs.badge,{backgroundColor:p.active?'#DCFCE7':'#F3F4F6'}]}>
                    <Text style={{fontSize:9,fontWeight:'700',color:p.active?'#15803D':'#9CA3AF'}}>{p.active?'Actif':'Inactif'}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Product Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent onRequestClose={onClose}>
        <View style={cs.modalOverlay}>
          <View style={[cs.modalBox,{maxHeight:'90%'}]}>
            <View style={[cs.modalHeader,{backgroundColor:B.dark}]}>
              <Text style={{color:'#fff',fontWeight:'800',fontSize:16}}>{editId?'✏️ Modifier':'➕ Nouvel Article'}</Text>
              <TouchableOpacity onPress={()=>setShowForm(false)}><Text style={{color:'#fff',fontSize:20,opacity:0.7}}>✕</Text></TouchableOpacity>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'}>
              <ScrollView style={{maxHeight:500}} showsVerticalScrollIndicator={false}>
                <View style={{padding:16,gap:12}}>
                  <View style={cs.sectionLabel}><View style={cs.sectionLine}/><Text style={cs.sectionLabelTxt}>INFORMATIONS GÉNÉRALES</Text><View style={cs.sectionLine}/></View>
                  <View style={cs.formGroup}>
                    <Text style={cs.formLabel}>Nom de l'article *</Text>
                    <TextInput style={cs.formInput} value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="Ex : Poulet Braisé ½"/>
                  </View>
                  <View style={{flexDirection:'row',gap:10}}>
                    <View style={[cs.formGroup,{flex:1}]}>
                      <Text style={cs.formLabel}>Catégorie *</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:4}}>
                        <View style={{flexDirection:'row',gap:6}}>
                          {cats.map(c=>(
                            <TouchableOpacity key={c.id} onPress={()=>setForm(f=>({...f,catId:c.id}))}
                              style={[cs.catPill,{borderColor:c.color},{backgroundColor:form.catId===c.id?c.color:'transparent'}]}>
                              <Text style={{fontSize:11,fontWeight:'700',color:form.catId===c.id?'#fff':c.color}}>{c.icon} {c.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                  <View style={cs.formGroup}>
                    <Text style={cs.formLabel}>Unité de vente *</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={{flexDirection:'row',gap:6,marginTop:4}}>
                        {UNITS.map(u=>(
                          <TouchableOpacity key={u} onPress={()=>setForm(f=>({...f,unit:u}))}
                            style={[cs.unitPill,form.unit===u&&{backgroundColor:B.mid,borderColor:B.mid}]}>
                            <Text style={[{fontSize:11,fontWeight:'600',color:'#555'},form.unit===u&&{color:'#fff'}]}>{u}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  <View style={cs.sectionLabel}><View style={cs.sectionLine}/><Text style={cs.sectionLabelTxt}>TARIFICATION</Text><View style={cs.sectionLine}/></View>
                  <View style={{flexDirection:'row',gap:10}}>
                    <View style={[cs.formGroup,{flex:1}]}>
                      <Text style={cs.formLabel}>Coût de revient (FCFA) *</Text>
                      <TextInput style={cs.formInput} value={String(form.costPrice)} onChangeText={v=>setForm(f=>({...f,costPrice:v}))} keyboardType="numeric" placeholder="0"/>
                    </View>
                    <View style={[cs.formGroup,{flex:1}]}>
                      <Text style={cs.formLabel}>Prix vente TTC (FCFA) *</Text>
                      <TextInput style={cs.formInput} value={String(form.priceTTC)} onChangeText={v=>setForm(f=>({...f,priceTTC:v}))} keyboardType="numeric" placeholder="0"/>
                    </View>
                  </View>
                  {calcHT>0&&(
                    <View style={cs.calcBox}>
                      <View style={cs.calcItem}><Text style={cs.calcLabel}>Prix HT</Text><Text style={cs.calcVal}>{CFA(calcHT)}</Text></View>
                      <View style={cs.calcItem}><Text style={cs.calcLabel}>Marge brute</Text><Text style={[cs.calcVal,{color:mClr(calcMP)}]}>{CFA(calcM)}</Text></View>
                      <View style={cs.calcItem}><Text style={cs.calcLabel}>Taux marge</Text><Text style={[cs.calcVal,{color:mClr(calcMP)}]}>{calcMP}% {calcMP>=40?'✓':calcMP>=20?'~':'⚠'}</Text></View>
                    </View>
                  )}

                  <View style={cs.sectionLabel}><View style={cs.sectionLine}/><Text style={cs.sectionLabelTxt}>STOCK</Text><View style={cs.sectionLine}/></View>
                  <View style={{flexDirection:'row',gap:10}}>
                    <View style={[cs.formGroup,{flex:1}]}>
                      <Text style={cs.formLabel}>Stock initial</Text>
                      <TextInput style={cs.formInput} value={String(form.stock)} onChangeText={v=>setForm(f=>({...f,stock:v}))} keyboardType="numeric" placeholder="0"/>
                    </View>
                    <View style={[cs.formGroup,{flex:1}]}>
                      <Text style={cs.formLabel}>Stock minimum alerte</Text>
                      <TextInput style={cs.formInput} value={String(form.stockMin)} onChangeText={v=>setForm(f=>({...f,stockMin:v}))} keyboardType="numeric" placeholder="5"/>
                    </View>
                  </View>

                  <TouchableOpacity onPress={()=>setForm(f=>({...f,active:!f.active}))} style={cs.toggleRow}>
                    <View>
                      <Text style={{fontWeight:'700',color:'#333',fontSize:13}}>Article actif</Text>
                      <Text style={{fontSize:11,color:'#888'}}>Visible en caisse</Text>
                    </View>
                    <View style={[cs.toggle,form.active&&{backgroundColor:B.mid}]}>
                      <View style={[cs.toggleThumb,form.active&&{left:22}]}/>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
            <View style={cs.modalFooter}>
              <TouchableOpacity onPress={()=>setShowForm(false)} style={cs.btnCancel}><Text style={{fontWeight:'700',color:'#666',fontSize:14}}>Annuler</Text></TouchableOpacity>
              <TouchableOpacity onPress={save} style={[cs.btnSave,{backgroundColor:B.accent}]}><Text style={{color:'#fff',fontWeight:'900',fontSize:14}}>✓ {editId?'Mettre à jour':'Enregistrer'}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN — VENTES
// ═══════════════════════════════════════════════════════════
function AdminVentes({orders}){
  const paid=orders.filter(o=>o.st==='Payé');
  const totCA=paid.reduce((s,o)=>s+o.tot,0);
  const totHT=paid.reduce((s,o)=>s+o.sub,0);
  const totTVA=paid.reduce((s,o)=>s+o.tva,0);
  return(
    <ScrollView style={cs.flex1}>
      <View style={cs.adminContent}>
        <View style={cs.kpiRow}>
          <KpiCard label="CA Total TTC" value={CFA(totCA)} icon="💰" color={B.accent}/>
          <KpiCard label="Total HT" value={CFA(totHT)} icon="📄" color={B.mid}/>
          <KpiCard label="TVA Collectée" value={CFA(totTVA)} icon="🏦" color={B.info}/>
          <KpiCard label="Nb. Tickets" value={String(paid.length)} icon="🎫" color={B.purple}/>
        </View>
        <View style={cs.adminCard}>
          <Text style={cs.cardTitle}>Historique des ventes ({paid.length} tickets)</Text>
          <View style={cs.tableHeader}>
            {['Ticket','Table','Caissier','Date & Heure','Montant TTC','Paiement','Statut'].map(h=>(
              <Text key={h} style={cs.thCell}>{h}</Text>
            ))}
          </View>
          {orders.slice(0,30).map(o=>(
            <View key={o.id} style={cs.tableRow}>
              <Text style={[cs.tdCell,{fontSize:10,color:'#777'}]}>{o.t}</Text>
              <Text style={[cs.tdCell,{fontWeight:'700'}]}>{o.tb}</Text>
              <Text style={cs.tdCell}>{o.u}</Text>
              <Text style={[cs.tdCell,{fontSize:10}]}>{fmtDT(o.dt)}</Text>
              <Text style={[cs.tdCell,{fontWeight:'900',color:B.dark}]}>{CFA(o.tot)}</Text>
              <View style={[cs.badge,{backgroundColor:'#F3F4F6'}]}><Text style={{fontSize:9,color:'#555'}}>{o.pay}</Text></View>
              <View style={[cs.badge,{backgroundColor:'#DCFCE7'}]}><Text style={{fontSize:9,color:'#15803D',fontWeight:'700'}}>{o.st}</Text></View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN — TABLES
// ═══════════════════════════════════════════════════════════
function AdminTables({tables,setTables}){
  const zones=[...new Set(tables.map(t=>t.zone))];
  const SC={libre:{bg:'#F0FDF4',bd:'#86EFAC',tx:'#15803D'},occupée:{bg:'#FFF7ED',bd:'#FCA5A5',tx:'#C2410C'},réservée:{bg:'#EFF6FF',bd:'#93C5FD',tx:'#1D4ED8'}};
  const cycle={libre:'occupée',occupée:'réservée',réservée:'libre'};
  const stats={libre:tables.filter(t=>t.status==='libre').length,occupée:tables.filter(t=>t.status==='occupée').length,réservée:tables.filter(t=>t.status==='réservée').length};
  return(
    <ScrollView style={cs.flex1}>
      <View style={cs.adminContent}>
        <View style={cs.kpiRow}>
          <KpiCard label="Tables libres" value={String(stats.libre)} icon="🟢" color="#15803D"/>
          <KpiCard label="Tables occupées" value={String(stats.occupée)} icon="🟠" color={B.danger}/>
          <KpiCard label="Tables réservées" value={String(stats.réservée)} icon="🔵" color={B.info}/>
          <TouchableOpacity onPress={()=>setTables(p=>p.map(t=>({...t,status:'libre'})))} style={[cs.kpiCard,{borderLeftColor:'#888',justifyContent:'center',alignItems:'center'}]}>
            <Text style={{fontSize:20}}>♻️</Text>
            <Text style={{fontSize:11,fontWeight:'700',color:'#555',textAlign:'center',marginTop:4}}>Libérer tout</Text>
          </TouchableOpacity>
        </View>
        {zones.map(z=>(
          <View key={z} style={cs.adminCard}>
            <Text style={cs.cardTitle}>📍 Zone {z}</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>
              {tables.filter(t=>t.zone===z).map(tbl=>{
                const s=SC[tbl.status]||SC.libre;
                return(
                  <TouchableOpacity key={tbl.id} onPress={()=>setTables(p=>p.map(t=>t.id===tbl.id?{...t,status:cycle[t.status]||'libre'}:t))}
                    style={[cs.tableBtn,{backgroundColor:s.bg,borderColor:s.bd}]}>
                    <Text style={{fontWeight:'900',color:B.dark,fontSize:14}}>{tbl.name}</Text>
                    <Text style={{fontSize:10,fontWeight:'700',color:s.tx,marginTop:2,textTransform:'capitalize'}}>{tbl.status}</Text>
                    <Text style={{fontSize:9,color:'#888'}}>👥 {tbl.cap}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
        <Text style={{textAlign:'center',color:'#aaa',fontSize:11,paddingBottom:20}}>Appuyer sur une table pour changer son statut</Text>
      </View>
    </ScrollView>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN — UTILISATEURS
// ═══════════════════════════════════════════════════════════
function AdminUsers({users,setUsers}){
  const bp=useBP();
  const [form,setForm]=useState({name:'',pin:'',role:'caissier'});
  const [editId,setEditId]=useState(null);
  const ROLE_C={admin:B.accent,caissier:B.mid,serveur:B.info};
  const ROLE_L={admin:'Administrateur',caissier:'Caissier',serveur:'Serveur'};
  const save=()=>{
    if(!form.name||form.pin.length!==4){Alert.alert('Erreur','Nom requis et PIN de 4 chiffres obligatoire.');return;}
    if(editId) setUsers(p=>p.map(u=>u.id===editId?{...u,...form}:u));
    else setUsers(p=>[...p,{id:Date.now(),...form,active:true}]);
    setForm({name:'',pin:'',role:'caissier'});setEditId(null);
  };
  return(
    <ScrollView style={cs.flex1}>
      <View style={cs.adminContent}>
        <View style={{flexDirection:bp.isTabletUp?'row':'column',gap:16}}>
          {/* User list */}
          <View style={[cs.adminCard,{flex:bp.isTabletUp?2:undefined}]}>
            <Text style={cs.cardTitle}>Utilisateurs du système</Text>
            <Text style={{fontSize:11,color:'#888',marginBottom:12}}>Admin → Back Office uniquement | Caissier/Serveur → Caisse uniquement</Text>
            {users.map(u=>(
              <TouchableOpacity key={u.id} onPress={()=>{setForm({name:u.name,pin:u.pin,role:u.role});setEditId(u.id);}}
                style={cs.userListItem}>
                <View style={[cs.userAvatarSm,{backgroundColor:ROLE_C[u.role]||B.mid}]}>
                  <Text style={{color:'#fff',fontWeight:'900',fontSize:14}}>{u.name.charAt(0)}</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={{fontWeight:'700',fontSize:14,color:'#1C2826'}}>{u.name}</Text>
                  <Text style={{fontSize:11,color:ROLE_C[u.role],marginTop:2}}>{ROLE_L[u.role]}</Text>
                </View>
                <View style={{flexDirection:'row',gap:8,alignItems:'center'}}>
                  <View style={[cs.badge,{backgroundColor:u.active?'#DCFCE7':'#F3F4F6'}]}>
                    <Text style={{fontSize:10,fontWeight:'700',color:u.active?'#15803D':'#9CA3AF'}}>{u.active?'Actif':'Inactif'}</Text>
                  </View>
                  <TouchableOpacity onPress={()=>setUsers(p=>p.map(x=>x.id===u.id?{...x,active:!x.active}:x))}
                    style={[cs.badge,{backgroundColor:u.active?'#FEF3C7':'#DCFCE7'}]}>
                    <Text style={{fontSize:10,color:u.active?'#B45309':'#15803D'}}>{u.active?'🔒':'🔓'}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add/Edit form */}
          <View style={[cs.adminCard,{flex:bp.isTabletUp?1:undefined}]}>
            <Text style={cs.cardTitle}>{editId?'Modifier':'Nouvel Utilisateur'}</Text>
            <View style={cs.formGroup}>
              <Text style={cs.formLabel}>Nom complet *</Text>
              <TextInput style={cs.formInput} value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="Ex: Caissier 3"/>
            </View>
            <View style={cs.formGroup}>
              <Text style={cs.formLabel}>Code PIN (4 chiffres) *</Text>
              <TextInput style={cs.formInput} value={form.pin} maxLength={4} onChangeText={v=>setForm(f=>({...f,pin:v.replace(/\D/g,'')}))} keyboardType="numeric" secureTextEntry placeholder="0000"/>
            </View>
            <View style={cs.formGroup}>
              <Text style={cs.formLabel}>Rôle *</Text>
              <View style={{flexDirection:'row',gap:8,marginTop:4}}>
                {['caissier','serveur','admin'].map(r=>(
                  <TouchableOpacity key={r} onPress={()=>setForm(f=>({...f,role:r}))}
                    style={[cs.rolePill,{borderColor:ROLE_C[r]},{backgroundColor:form.role===r?ROLE_C[r]:'transparent'}]}>
                    <Text style={[{fontSize:11,fontWeight:'700',color:ROLE_C[r]},form.role===r&&{color:'#fff'}]}>{ROLE_L[r]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{flexDirection:'row',gap:8,marginTop:12}}>
              {editId&&<TouchableOpacity onPress={()=>{setEditId(null);setForm({name:'',pin:'',role:'caissier'});}} style={[cs.btnCancel,{flex:1}]}><Text style={{fontWeight:'700',color:'#666'}}>Annuler</Text></TouchableOpacity>}
              <TouchableOpacity onPress={save} style={[cs.btnSave,{flex:1,backgroundColor:B.accent}]}><Text style={{color:'#fff',fontWeight:'900',fontSize:14}}>✓ {editId?'Mettre à jour':'Créer'}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ═══════════════════════════════════════════════════════════
// BACK OFFICE SCREEN (Admin uniquement)
// ═══════════════════════════════════════════════════════════
function BackOfficeScreen({user,orders,products,setProducts,cats,tables,setTables,users,setUsers,onLogout}){
  const bp=useBP();
  const insets=useSafeAreaInsets();
  const [tab,setTab]=useState('dashboard');
  const [time,setTime]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);

  const NAV=[
    {id:'dashboard',icon:'📊',label:'Tableau de bord'},
    {id:'produits',icon:'🍽️',label:'Menu & Produits'},
    {id:'ventes',icon:'📋',label:'Historique Ventes'},
    {id:'tables',icon:'🪑',label:'Plan des Tables'},
    {id:'users',icon:'👥',label:'Utilisateurs'},
  ];

  return(
    <SafeAreaView style={[cs.flex1,{backgroundColor:B.sidebar}]}>
      <StatusBar barStyle="light-content" backgroundColor={B.sidebar}/>
      <View style={[cs.flex1,{flexDirection:bp.isTabletUp?'row':'column'}]}>

        {bp.isTabletUp?(
          // Tablette / Ordinateur : barre latérale verticale
          <View style={[cs.adminSidebar,bp.isDesktop&&{width:240}]}>
            <View style={cs.sidebarLogo}>
              <View style={[cs.logoBox,{width:40,height:40,borderRadius:10}]}><Text style={{fontSize:22}}>🍽️</Text></View>
              <View>
                <Text style={{color:'#fff',fontWeight:'900',fontSize:18,letterSpacing:3}}>HERCO</Text>
                <Text style={{color:B.accent,fontSize:10,fontWeight:'600'}}>Back Office</Text>
              </View>
            </View>
            {NAV.map(n=>(
              <TouchableOpacity key={n.id} onPress={()=>setTab(n.id)}
                style={[cs.sidebarItem,tab===n.id&&{backgroundColor:B.accent}]}>
                <Text style={{fontSize:16}}>{n.icon}</Text>
                <Text style={[cs.sidebarItemTxt,tab===n.id&&{color:'#fff'}]}>{n.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={{flex:1}}/>
            <View style={cs.sidebarUser}>
              <View style={[cs.userAvatarSm,{backgroundColor:B.accent}]}>
                <Text style={{color:'#fff',fontWeight:'900',fontSize:14}}>{user.name.charAt(0)}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={{color:'#fff',fontSize:12,fontWeight:'700'}} numberOfLines={1}>{user.name}</Text>
                <Text style={{color:B.accent,fontSize:10}}>Administrateur</Text>
              </View>
              <TouchableOpacity onPress={onLogout}><Text style={{color:'#F87171',fontSize:12,fontWeight:'700'}}>⏏</Text></TouchableOpacity>
            </View>
          </View>
        ):null}

        {/* Content */}
        <View style={[cs.flex1,{backgroundColor:B.bg}]}>
          {/* Top bar */}
          <View style={cs.adminTopBar}>
            <View>
              <Text style={cs.adminPageTitle}>{NAV.find(n=>n.id===tab)?.icon} {NAV.find(n=>n.id===tab)?.label}</Text>
              <Text style={{fontSize:11,color:'#888'}}>HERCO · Brazzaville, Congo</Text>
            </View>
            <View style={{alignItems:'flex-end'}}>
              <Text style={{fontWeight:'800',fontSize:14,color:'#333'}}>{fmtT(time)}</Text>
              <Text style={{fontSize:11,color:'#888'}}>{fmtD(time)}</Text>
            </View>
          </View>

          {/* Screen content */}
          <View style={[cs.flex1,bp.isDesktop&&{maxWidth:1400,width:'100%',alignSelf:'center'}]}>
            {tab==='dashboard'&&<AdminDashboard orders={orders} products={products}/>}
            {tab==='produits'&&<AdminProduits products={products} setProducts={setProducts} cats={cats}/>}
            {tab==='ventes'&&<AdminVentes orders={orders}/>}
            {tab==='tables'&&<AdminTables tables={tables} setTables={setTables}/>}
            {tab==='users'&&<AdminUsers users={users} setUsers={setUsers}/>}
          </View>
        </View>

        {/* Téléphone : onglets en bas */}
        {!bp.isTabletUp&&(
          <View style={[cs.bottomTabs,{paddingBottom:Math.max(insets.bottom,8)}]}>
            {NAV.map(n=>(
              <TouchableOpacity key={n.id} onPress={()=>setTab(n.id)} style={cs.bottomTab}>
                <Text style={{fontSize:18}}>{n.icon}</Text>
                <Text style={[cs.bottomTabTxt,tab===n.id&&{color:B.accent,fontWeight:'700'}]}>{n.label.split(' ')[0]}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={onLogout} style={cs.bottomTab}>
              <Text style={{fontSize:18}}>⏏</Text>
              <Text style={[cs.bottomTabTxt,{color:'#F87171'}]}>Sortie</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════
// CASHIER / POS SCREEN
// ═══════════════════════════════════════════════════════════
function CashierScreen({user,products,cats,tables,setTables,orders,setOrders,onLogout}){
  const bp=useBP();
  const insets=useSafeAreaInsets();
  const [cart,setCart]=useState([]);
  const [selCat,setSelCat]=useState(0);
  const [selTable,setSelTable]=useState(null);
  const [showTables,setShowTables]=useState(false);
  const [showPay,setShowPay]=useState(false);
  const [showReceipt,setShowReceipt]=useState(false);
  const [lastOrder,setLastOrder]=useState(null);
  const [payMethod,setPayMethod]=useState('Espèces');
  const [payAmt,setPayAmt]=useState('');
  const [time,setTime]=useState(new Date());

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);

  const addItem=(p)=>setCart(prev=>{const f=prev.find(i=>i.id===p.id);if(f)return prev.map(i=>i.id===p.id?{...i,q:i.q+1}:i);return[...prev,{...p,q:1}];});
  const chgQty=(id,d)=>setCart(prev=>prev.map(i=>i.id===id?{...i,q:Math.max(0,i.q+d)}:i).filter(i=>i.q>0));
  const clearCart=()=>{setCart([]);setSelTable(null);};

  const subTot=cart.reduce((s,i)=>s+i.priceTTC*i.q,0);
  const tvaTot=Math.round(subTot*TVA);
  const total=subTot+tvaTot;
  const cartQty=cart.reduce((s,i)=>s+i.q,0);

  const received=parseFloat(payAmt.replace(/\s/g,''))||0;
  const change=received-total;
  const canPay=payMethod!=='Espèces'||received>=total;

  const finalize=()=>{
    const o={id:orders.length+1,t:genTk(),tb:selTable?.name||'À emporter',u:user.name,
      dt:new Date(),tot:total,sub:Math.round(total/1.18),tva:tvaTot,
      pay:payMethod,st:'Payé',items:cartQty,lines:[...cart],recv:received,change};
    setOrders(p=>[o,...p]);
    if(selTable)setTables(p=>p.map(t=>t.id===selTable.id?{...t,status:'libre'}:t));
    setLastOrder(o);clearCart();setShowPay(false);setPayAmt('');setShowReceipt(true);
  };

  const filtered=products.filter(p=>p.active&&(selCat===0||p.catId===selCat));
  const allCats=[{id:0,name:'Tout',icon:'🏠',color:'#888'},...cats];

  const numCols=bp.numCols;

  return(
    <SafeAreaView style={[cs.flex1,{backgroundColor:B.dark}]}>
      <StatusBar barStyle="light-content" backgroundColor={B.dark}/>

      {/* POS Header */}
      <View style={cs.posHeader}>
        <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
          <View style={[cs.logoBox,{width:36,height:36,borderRadius:10}]}><Text style={{fontSize:18}}>🍽️</Text></View>
          <View>
            <Text style={{color:'#fff',fontWeight:'900',fontSize:16,letterSpacing:3}}>HERCO</Text>
            <Text style={{color:B.accent,fontSize:10}}>Caisse — {selTable?selTable.name:'Sans table'}</Text>
          </View>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
          <TouchableOpacity onPress={()=>setShowTables(true)} style={[cs.posHeaderBtn,selTable&&{backgroundColor:B.accent}]}>
            <Text style={{color:'#fff',fontWeight:'700',fontSize:13}}>🪑 {selTable?selTable.name:'Table'}</Text>
          </TouchableOpacity>
          <View style={cs.posHeaderBtn}>
            <Text style={{color:'#fff',fontWeight:'800',fontSize:13}}>{fmtT(time)}</Text>
          </View>
          <View style={cs.posHeaderBtn}>
            <Text style={{color:'#fff',fontSize:12,fontWeight:'600'}}>{user.name}</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={[cs.posHeaderBtn,{backgroundColor:'#7F1D1D'}]}>
            <Text style={{color:'#fff',fontWeight:'700',fontSize:12}}>⏏</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[cs.flex1,{flexDirection:bp.isTabletUp?'row':'column'}]}>

        {/* Products panel */}
        <View style={[cs.flex1,{backgroundColor:'#F8F5EF'}]}>
          {/* Category filter */}
          <View style={cs.catBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{flexDirection:'row',gap:6,paddingHorizontal:12}}>
                {allCats.map(c=>(
                  <TouchableOpacity key={c.id} onPress={()=>setSelCat(c.id)}
                    style={[cs.catTab,selCat===c.id&&{backgroundColor:B.dark,borderColor:B.dark}]}>
                    <Text style={{fontSize:14}}>{c.icon}</Text>
                    <Text style={[cs.catTabTxt,selCat===c.id&&{color:'#fff'}]}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Product grid */}
          <FlatList
            data={filtered}
            keyExtractor={i=>String(i.id)}
            numColumns={numCols}
            key={numCols}
            contentContainerStyle={{padding:10,gap:8}}
            columnWrapperStyle={{gap:8}}
            renderItem={({item:p})=>{
              const inCart=cart.find(i=>i.id===p.id);
              const catClr=cats.find(c=>c.id===p.catId)?.color||'#888';
              return(
                <TouchableOpacity onPress={()=>p.stock>0&&addItem(p)} disabled={p.stock===0}
                  style={[cs.prodCard,{borderColor:inCart?catClr:'#E8E3DC',opacity:p.stock===0?0.5:1}]}>
                  <View style={[cs.prodCardTop,{backgroundColor:catClr}]}/>
                  <View style={{padding:8}}>
                    <Text style={{fontSize:22,textAlign:'center',marginBottom:4}}>{cats.find(c=>c.id===p.catId)?.icon}</Text>
                    <Text style={{fontSize:11,fontWeight:'700',color:'#1C2826',lineHeight:14,minHeight:28}} numberOfLines={2}>{p.name}</Text>
                    <Text style={{fontSize:12,fontWeight:'900',color:B.dark,marginTop:6}}>{CFA(p.priceTTC)}</Text>
                    {p.stock<p.stockMin&&p.stock>0&&<Text style={{fontSize:9,color:'#EA580C',marginTop:2}}>{p.stock} restants ⚠</Text>}
                    {p.stock===0&&<Text style={{fontSize:9,color:B.danger,marginTop:2}}>Épuisé</Text>}
                  </View>
                  {inCart&&(
                    <View style={[cs.cartBadge,{backgroundColor:catClr}]}>
                      <Text style={{color:'#fff',fontWeight:'900',fontSize:10}}>{inCart.q}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Cart panel */}
        <View style={[cs.cartPanel, bp.isTabletUp ? {width:bp.isDesktop?320:280} : {maxHeight:Math.round(bp.height*0.42)}]}>
          <View style={cs.cartHeader}>
            <Text style={{color:'#fff',fontWeight:'800',fontSize:14}}>
              🧾 Bon {cartQty>0&&`(${cartQty})`}
            </Text>
            {cart.length>0&&<TouchableOpacity onPress={clearCart}><Text style={{color:'#F87171',fontSize:12}}>✕ Vider</Text></TouchableOpacity>}
          </View>

          {cart.length===0?(
            <View style={cs.cartEmpty}>
              <Text style={{fontSize:40,marginBottom:8}}>🛒</Text>
              <Text style={{color:'#999',fontSize:13}}>Panier vide</Text>
            </View>
          ):(
            <ScrollView style={{flex:1}}>
              {cart.map(item=>(
                <View key={item.id} style={cs.cartItem}>
                  <View style={{flex:1}}>
                    <Text style={{fontSize:12,fontWeight:'700',color:'#333'}} numberOfLines={1}>{item.name}</Text>
                    <Text style={{fontSize:11,color:'#888'}}>{CFA(item.priceTTC)}</Text>
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                    <TouchableOpacity onPress={()=>chgQty(item.id,-1)} style={cs.qtyBtn}><Text style={{color:B.danger,fontWeight:'900',fontSize:14}}>−</Text></TouchableOpacity>
                    <Text style={{fontWeight:'900',fontSize:14,minWidth:20,textAlign:'center'}}>{item.q}</Text>
                    <TouchableOpacity onPress={()=>chgQty(item.id,1)} style={[cs.qtyBtn,{backgroundColor:'#DCFCE7'}]}><Text style={{color:'#15803D',fontWeight:'900',fontSize:14}}>+</Text></TouchableOpacity>
                  </View>
                  <Text style={{fontSize:12,fontWeight:'900',color:B.dark,minWidth:80,textAlign:'right'}}>{CFA(item.priceTTC*item.q)}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Totals */}
          <View style={cs.cartTotals}>
            <View style={cs.totalRow}><Text style={cs.totalLabel}>Sous-total HT</Text><Text style={cs.totalVal}>{CFA(Math.round(total/1.18))}</Text></View>
            <View style={cs.totalRow}><Text style={cs.totalLabel}>TVA (18%)</Text><Text style={cs.totalVal}>{CFA(tvaTot)}</Text></View>
            <View style={[cs.totalRow,{borderTopWidth:2,borderTopColor:'#333',paddingTop:8,marginTop:4}]}>
              <Text style={{color:'#fff',fontWeight:'900',fontSize:16}}>Total TTC</Text>
              <Text style={{color:B.accent,fontWeight:'900',fontSize:18}}>{CFA(total)}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={()=>cart.length>0&&setShowPay(true)} disabled={cart.length===0}
            style={[cs.payBtn,{backgroundColor:cart.length>0?B.accent:'#374151'},!bp.isTabletUp&&{marginBottom:Math.max(insets.bottom,12)}]}>
            <Text style={{color:'#fff',fontWeight:'900',fontSize:15}}>💳 ENCAISSER {cart.length>0&&CFA(total)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TABLE MODAL */}
      <Modal visible={showTables} animationType="fade" transparent onRequestClose={()=>setShowTables(false)}>
        <View style={cs.modalOverlay}>
          <View style={[cs.modalBox,{maxHeight:'80%'}]}>
            <View style={[cs.modalHeader,{backgroundColor:B.dark}]}>
              <Text style={{color:'#fff',fontWeight:'800',fontSize:16}}>🪑 Sélectionner une Table</Text>
              <TouchableOpacity onPress={()=>setShowTables(false)}><Text style={{color:'#fff',fontSize:20}}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight:400}}>
              <View style={{padding:16}}>
                {[...new Set(tables.map(t=>t.zone))].map(z=>(
                  <View key={z} style={{marginBottom:16}}>
                    <Text style={{fontWeight:'800',color:B.mid,fontSize:12,textTransform:'uppercase',letterSpacing:2,marginBottom:8}}>📍 {z}</Text>
                    <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
                      {tables.filter(t=>t.zone===z).map(tbl=>{
                        const isSel=selTable?.id===tbl.id;
                        const cl={libre:{bg:'#F0FDF4',bd:'#86EFAC',tx:'#15803D'},occupée:{bg:'#FFF7ED',bd:'#FCA5A5',tx:'#C2410C'},réservée:{bg:'#EFF6FF',bd:'#93C5FD',tx:'#1D4ED8'}}[tbl.status]||{bg:'#F0FDF4',bd:'#86EFAC',tx:'#15803D'};
                        return(
                          <TouchableOpacity key={tbl.id} onPress={()=>{if(tbl.status==='libre'||isSel){setSelTable(isSel?null:tbl);if(!isSel)setTables(p=>p.map(t=>t.id===tbl.id?{...t,status:'occupée'}:t));setShowTables(false);}}}
                            style={{backgroundColor:isSel?B.accent:cl.bg,borderWidth:2,borderColor:isSel?B.accent:cl.bd,borderRadius:12,padding:12,minWidth:70,alignItems:'center',opacity:tbl.status!=='libre'&&!isSel?0.45:1}}>
                            <Text style={{fontWeight:'900',color:isSel?'#fff':B.dark,fontSize:14}}>{tbl.name}</Text>
                            <Text style={{fontSize:10,color:isSel?'rgba(255,255,255,0.8)':cl.tx,marginTop:2,textTransform:'capitalize'}}>{isSel?'Actuelle':tbl.status}</Text>
                            <Text style={{fontSize:9,color:isSel?'rgba(255,255,255,0.6)':'#888'}}>👥 {tbl.cap}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* PAYMENT MODAL */}
      <Modal visible={showPay} animationType="slide" transparent onRequestClose={()=>setShowPay(false)}>
        <View style={cs.modalOverlay}>
          <View style={cs.modalBox}>
            <View style={[cs.modalHeader,{backgroundColor:B.dark,paddingBottom:16}]}>
              <View>
                <Text style={{color:'rgba(255,255,255,0.6)',fontSize:12}}>Montant à encaisser</Text>
                <Text style={{color:'#fff',fontWeight:'900',fontSize:28}}>{CFA(total)}</Text>
                <Text style={{color:'#6EE7B7',fontSize:11}}>dont TVA: {CFA(tvaTot)}</Text>
              </View>
              <TouchableOpacity onPress={()=>setShowPay(false)}><Text style={{color:'rgba(255,255,255,0.6)',fontSize:22}}>✕</Text></TouchableOpacity>
            </View>
            <View style={{padding:16,gap:14}}>
              <View>
                <Text style={cs.formLabel}>Mode de paiement</Text>
                <View style={{flexDirection:'row',gap:8,marginTop:6}}>
                  {[{id:'Espèces',ic:'💵'},{id:'Mobile Money',ic:'📱'},{id:'Carte Bancaire',ic:'💳'}].map(m=>(
                    <TouchableOpacity key={m.id} onPress={()=>setPayMethod(m.id)} style={{flex:1,padding:12,borderRadius:12,borderWidth:2,borderColor:payMethod===m.id?B.accent:'#E5E7EB',backgroundColor:payMethod===m.id?'#FFF8F0':'#fff',alignItems:'center'}}>
                      <Text style={{fontSize:20}}>{m.ic}</Text>
                      <Text style={{fontSize:10,fontWeight:'700',color:payMethod===m.id?B.accent:'#888',marginTop:4,textAlign:'center'}}>{m.id}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {payMethod==='Espèces'&&(
                <View>
                  <Text style={cs.formLabel}>Montant reçu (FCFA)</Text>
                  <TextInput style={[cs.formInput,{fontSize:22,fontWeight:'900',textAlign:'center',borderColor:B.mid,borderWidth:2}]}
                    value={payAmt} onChangeText={setPayAmt} keyboardType="numeric" placeholder="0"/>
                  <View style={{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:8}}>
                    {[...new Set([Math.ceil(total/1000)*1000,Math.ceil(total/5000)*5000,Math.ceil(total/10000)*10000,50000])].filter(v=>v>=total).slice(0,4).map(q=>(
                      <TouchableOpacity key={q} onPress={()=>setPayAmt(String(q))}
                        style={{flex:1,paddingVertical:8,borderRadius:10,borderWidth:2,borderColor:B.accent,alignItems:'center',backgroundColor:'#FFF8F0'}}>
                        <Text style={{fontSize:11,fontWeight:'800',color:B.accent}}>{CFA(q)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {received>0&&(
                    <View style={{padding:12,borderRadius:10,marginTop:8,backgroundColor:change>=0?'#F0FDF4':'#FEF2F2'}}>
                      <Text style={{fontWeight:'800',textAlign:'center',color:change>=0?'#15803D':B.danger,fontSize:14}}>
                        {change>=0?`✓ Monnaie à rendre : ${CFA(change)}`:`✗ Insuffisant de ${CFA(-change)}`}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              <View style={{flexDirection:'row',gap:10}}>
                <TouchableOpacity onPress={()=>setShowPay(false)} style={[cs.btnCancel,{flex:1}]}><Text style={{fontWeight:'700',color:'#666',fontSize:14}}>Annuler</Text></TouchableOpacity>
                <TouchableOpacity onPress={canPay?finalize:undefined} style={[cs.btnSave,{flex:2,backgroundColor:canPay?B.accent:'#9CA3AF'}]}>
                  <Text style={{color:'#fff',fontWeight:'900',fontSize:15}}>✓ Valider le paiement</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* RECEIPT MODAL */}
      <Modal visible={showReceipt} animationType="fade" transparent onRequestClose={()=>setShowReceipt(false)}>
        <View style={cs.modalOverlay}>
          <View style={[cs.modalBox,{maxWidth:320,maxHeight:'90%'}]}>
            <View style={[cs.modalHeader,{backgroundColor:B.dark,justifyContent:'center',flexDirection:'column',alignItems:'center',gap:2}]}>
              <TouchableOpacity onPress={()=>setShowReceipt(false)} style={cs.modalCloseX} hitSlop={{top:12,bottom:12,left:12,right:12}}>
                <Text style={{color:'rgba(255,255,255,0.75)',fontSize:18,fontWeight:'900'}}>✕</Text>
              </TouchableOpacity>
              <Text style={{color:'#fff',fontWeight:'900',fontSize:22,letterSpacing:4}}>HERCO</Text>
              <Text style={{color:B.accent,fontSize:11}}>Restaurant & Lounge Bar</Text>
              <Text style={{color:'rgba(255,255,255,0.5)',fontSize:10}}>Brazzaville, Congo</Text>
            </View>
            {lastOrder&&(
              <ScrollView style={{maxHeight:Math.round(bp.height*0.5)}} showsVerticalScrollIndicator={false}>
                <View style={{padding:16,backgroundColor:'#FFFBF5'}}>
                  {[['Ticket',lastOrder.t],['Date',fmtDT(lastOrder.dt)],['Table',lastOrder.tb],['Caissier',lastOrder.u]].map(([l,v])=>(
                    <View key={l} style={{flexDirection:'row',justifyContent:'space-between',marginBottom:4}}>
                      <Text style={{fontSize:11,color:'#888'}}>{l}</Text>
                      <Text style={{fontSize:11,fontWeight:'700',color:'#333'}}>{v}</Text>
                    </View>
                  ))}
                  <View style={{borderTopWidth:1,borderStyle:'dashed',borderColor:'#CCC',marginVertical:8}}/>
                  {lastOrder.lines?.map((l,i)=>(
                    <View key={i} style={{flexDirection:'row',justifyContent:'space-between',marginBottom:2}}>
                      <Text style={{fontSize:11,color:'#555',flex:1}} numberOfLines={1}>{l.q}× {l.name}</Text>
                      <Text style={{fontSize:11,fontWeight:'700',marginLeft:4}}>{CFA(l.priceTTC*l.q)}</Text>
                    </View>
                  ))}
                  <View style={{borderTopWidth:1,borderStyle:'dashed',borderColor:'#CCC',marginVertical:8}}/>
                  {[['Sous-total HT',lastOrder.sub],['TVA (18%)',lastOrder.tva]].map(([l,v])=>(
                    <View key={l} style={{flexDirection:'row',justifyContent:'space-between',marginBottom:2}}>
                      <Text style={{fontSize:11,color:'#888'}}>{l}</Text><Text style={{fontSize:11}}>{CFA(v)}</Text>
                    </View>
                  ))}
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:4}}>
                    <Text style={{fontSize:15,fontWeight:'900',color:B.dark}}>TOTAL TTC</Text>
                    <Text style={{fontSize:15,fontWeight:'900',color:B.dark}}>{CFA(lastOrder.tot)}</Text>
                  </View>
                  <View style={{borderTopWidth:1,borderStyle:'dashed',borderColor:'#CCC',marginVertical:8}}/>
                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontSize:11,color:'#888'}}>Paiement</Text><Text style={{fontSize:11,fontWeight:'700'}}>{lastOrder.pay}</Text>
                  </View>
                  {lastOrder.recv>lastOrder.tot&&(<>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{fontSize:11,color:'#888'}}>Reçu</Text><Text style={{fontSize:11}}>{CFA(lastOrder.recv)}</Text></View>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{fontSize:11,fontWeight:'700',color:'#15803D'}}>Monnaie</Text><Text style={{fontSize:11,fontWeight:'700',color:'#15803D'}}>{CFA(lastOrder.change)}</Text></View>
                  </>)}
                  <Text style={{textAlign:'center',color:'#AAA',fontSize:10,marginTop:12}}>Merci pour votre visite ! 🍽️</Text>
                </View>
              </ScrollView>
            )}
            <TouchableOpacity onPress={()=>setShowReceipt(false)}
              style={[cs.btnSave,{backgroundColor:B.dark,margin:0,borderRadius:0,paddingBottom:Math.max(insets.bottom,14)}]}>
              <Text style={{color:'#fff',fontWeight:'900',fontSize:14}}>✓ Fermer — Nouvelle vente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App(){
  const [screen,setScreen]=useState('login');
  const [user,setUser]=useState(null);
  const [products,setProducts]=useState(INIT_PRODS);
  const [cats]=useState(CATS);
  const [tables,setTables]=useState(INIT_TABLES);
  const [users,setUsers]=useState(INIT_USERS);
  const [orders,setOrders]=useState(()=>genOrders());

  const doLogin=(u)=>{
    setUser(u);
    setScreen(u.role==='admin'?'admin':'cashier');
  };
  const doLogout=()=>{setUser(null);setScreen('login');};

  let content=null;
  if(screen==='login') content=<LoginScreen users={users} onLogin={doLogin}/>;
  else if(screen==='admin') content=<BackOfficeScreen user={user} orders={orders} products={products} setProducts={setProducts} cats={cats} tables={tables} setTables={setTables} users={users} setUsers={setUsers} onLogout={doLogout}/>;
  else if(screen==='cashier') content=<CashierScreen user={user} products={products} cats={cats} tables={tables} setTables={setTables} orders={orders} setOrders={setOrders} onLogout={doLogout}/>;

  return <SafeAreaProvider>{content}</SafeAreaProvider>;
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════
const cs=StyleSheet.create({
  flex1:{flex:1},
  // Login
  loginBg:{flex:1},
  loginLeft:{flex:1,padding:32,justifyContent:'center',alignItems:'flex-start'},
  loginRight:{padding:28,backgroundColor:'rgba(0,0,0,0.35)',justifyContent:'center'},
  loginTitle:{color:'#fff',fontWeight:'900',fontSize:22,marginBottom:4},
  loginHint:{color:'rgba(255,255,255,0.5)',fontSize:13,marginBottom:4},
  logoBox:{width:64,height:64,borderRadius:18,backgroundColor:B.accent,alignItems:'center',justifyContent:'center',marginBottom:12,shadowColor:'#000',shadowOpacity:0.3,shadowRadius:10},
  logoTitle:{color:'#fff',fontWeight:'900',fontSize:36,letterSpacing:6},
  logoSub:{color:'rgba(255,255,255,0.7)',fontSize:14,marginTop:2},
  logoCity:{color:'rgba(255,255,255,0.4)',fontSize:11,marginTop:2},
  featurePill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:'rgba(255,255,255,0.08)',borderRadius:10,paddingHorizontal:12,paddingVertical:8},
  userCard:{flexDirection:'row',alignItems:'center',gap:14,padding:14,borderRadius:14,backgroundColor:'rgba(255,255,255,0.08)',borderWidth:1,borderColor:'rgba(255,255,255,0.12)'},
  userAvatar:{width:48,height:48,borderRadius:14,alignItems:'center',justifyContent:'center'},
  userAvatarSm:{width:36,height:36,borderRadius:10,alignItems:'center',justifyContent:'center'},
  selUserCard:{flexDirection:'row',alignItems:'center',gap:12,padding:12,borderRadius:12,backgroundColor:'rgba(255,255,255,0.1)'},
  pinDot:{width:14,height:14,borderRadius:7,borderWidth:2,borderColor:'rgba(255,255,255,0.3)',backgroundColor:'transparent'},
  pinKey:{width:'30%',padding:16,alignItems:'center',backgroundColor:'rgba(255,255,255,0.1)',borderRadius:12,borderWidth:1,borderColor:'rgba(255,255,255,0.1)'},
  pinKeyTxt:{color:'#fff',fontWeight:'800',fontSize:20},
  // Admin layout
  adminSidebar:{width:200,backgroundColor:B.sidebar,paddingTop:0},
  sidebarLogo:{flexDirection:'row',alignItems:'center',gap:10,padding:16,borderBottomWidth:1,borderBottomColor:'rgba(255,255,255,0.08)'},
  sidebarItem:{flexDirection:'row',alignItems:'center',gap:10,marginHorizontal:8,marginVertical:2,paddingHorizontal:12,paddingVertical:10,borderRadius:10},
  sidebarItemTxt:{color:'rgba(255,255,255,0.55)',fontSize:13,fontWeight:'600'},
  sidebarUser:{flexDirection:'row',alignItems:'center',gap:10,padding:16,borderTopWidth:1,borderTopColor:'rgba(255,255,255,0.08)'},
  adminTopBar:{backgroundColor:'#fff',paddingHorizontal:20,paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#F0F0F0',flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  adminPageTitle:{fontSize:18,fontWeight:'900',color:'#1C2826'},
  adminContent:{padding:16,gap:14},
  adminCard:{backgroundColor:'#fff',borderRadius:16,padding:16,shadowColor:'#000',shadowOpacity:0.04,shadowRadius:8,shadowOffset:{width:0,height:2},elevation:2},
  cardTitle:{fontSize:14,fontWeight:'800',color:'#1C2826',marginBottom:14},
  // KPI
  kpiRow:{flexDirection:'row',gap:10,flexWrap:'wrap'},
  kpiCard:{flex:1,minWidth:140,backgroundColor:'#fff',borderRadius:14,padding:14,borderLeftWidth:4,shadowColor:'#000',shadowOpacity:0.04,shadowRadius:6,elevation:2},
  kpiIcon:{fontSize:22,marginBottom:6},
  kpiVal:{fontSize:20,fontWeight:'900',color:B.dark},
  kpiSub:{fontSize:10,color:'#888',marginTop:2},
  kpiLabel:{fontSize:10,fontWeight:'700',color:'#888',textTransform:'uppercase',letterSpacing:0.5,marginTop:4},
  payRow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:10},
  // Table
  tableHeader:{flexDirection:'row',backgroundColor:'#F8F6F2',borderRadius:8,padding:8,marginBottom:4},
  thCell:{flex:1,fontSize:9,fontWeight:'800',color:'#9CA3AF',textTransform:'uppercase',letterSpacing:0.5},
  tableRow:{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderBottomColor:'#F8F6F2'},
  tdCell:{flex:1,fontSize:12,color:'#4B5563'},
  badge:{borderRadius:20,paddingHorizontal:6,paddingVertical:2},
  // Filters
  filterBar:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#fff',paddingHorizontal:12,paddingVertical:10,borderBottomWidth:1,borderBottomColor:'#F0F0F0'},
  searchInput:{flex:1,borderWidth:1,borderColor:'#E5E7EB',borderRadius:10,paddingHorizontal:12,paddingVertical:8,fontSize:13,backgroundColor:'#F9FAFB'},
  addBtn:{backgroundColor:B.accent,paddingHorizontal:14,paddingVertical:9,borderRadius:10},
  chip:{paddingHorizontal:10,paddingVertical:5,borderRadius:20,backgroundColor:'#F0EBE1',borderWidth:1,borderColor:'transparent'},
  chipTxt:{fontSize:11,fontWeight:'700',color:'#555'},
  // Form
  formGroup:{gap:4},
  formLabel:{fontSize:11,fontWeight:'700',color:'#6B7280',textTransform:'uppercase',letterSpacing:0.5},
  formInput:{borderWidth:1.5,borderColor:'#E5E7EB',borderRadius:10,paddingHorizontal:12,paddingVertical:10,fontSize:14,backgroundColor:'#fff'},
  sectionLabel:{flexDirection:'row',alignItems:'center',gap:8,marginVertical:4},
  sectionLine:{flex:1,height:1,backgroundColor:'#E5E7EB'},
  sectionLabelTxt:{fontSize:10,fontWeight:'900',color:'#9CA3AF',letterSpacing:1},
  calcBox:{flexDirection:'row',backgroundColor:'#F8F9FA',borderRadius:10,padding:10,gap:0},
  calcItem:{flex:1,alignItems:'center',borderRightWidth:1,borderRightColor:'#E5E7EB'},
  calcLabel:{fontSize:9,color:'#9CA3AF',fontWeight:'600'},
  calcVal:{fontSize:13,fontWeight:'900',color:B.dark,marginTop:2},
  toggleRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#F9FAFB',padding:12,borderRadius:10},
  toggle:{width:44,height:24,backgroundColor:'#D1D5DB',borderRadius:12,justifyContent:'center',position:'relative'},
  toggleThumb:{position:'absolute',left:2,width:20,height:20,borderRadius:10,backgroundColor:'#fff',shadowColor:'#000',shadowOpacity:0.2,shadowRadius:2,elevation:2},
  catPill:{paddingHorizontal:10,paddingVertical:5,borderRadius:20,borderWidth:1.5},
  unitPill:{paddingHorizontal:10,paddingVertical:5,borderRadius:10,borderWidth:1,borderColor:'#E5E7EB',backgroundColor:'#F9FAFB'},
  rolePill:{paddingHorizontal:12,paddingVertical:6,borderRadius:10,borderWidth:1.5},
  tableBtn:{padding:12,borderRadius:12,borderWidth:2,alignItems:'center',minWidth:80},
  userListItem:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#F8F6F2'},
  // Bottom tabs
  bottomTabs:{flexDirection:'row',backgroundColor:B.sidebar,borderTopWidth:1,borderTopColor:'rgba(255,255,255,0.08)'},
  bottomTab:{flex:1,alignItems:'center',paddingVertical:8},
  bottomTabTxt:{fontSize:9,color:'rgba(255,255,255,0.5)',marginTop:2,fontWeight:'600'},
  // POS
  posHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:14,paddingVertical:10,backgroundColor:B.dark},
  posHeaderBtn:{paddingHorizontal:10,paddingVertical:6,borderRadius:10,backgroundColor:'rgba(255,255,255,0.12)',borderWidth:1,borderColor:'rgba(255,255,255,0.15)'},
  catBar:{backgroundColor:'#fff',paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#EAE4DC'},
  catTab:{flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:12,paddingVertical:6,borderRadius:20,backgroundColor:'#F0EBE1',borderWidth:1,borderColor:'transparent'},
  catTabTxt:{fontSize:11,fontWeight:'700',color:'#555'},
  prodCard:{flex:1,backgroundColor:'#fff',borderRadius:12,borderWidth:2,overflow:'hidden',position:'relative'},
  prodCardTop:{height:5},
  cartBadge:{position:'absolute',top:6,right:6,width:22,height:22,borderRadius:11,alignItems:'center',justifyContent:'center'},
  cartPanel:{backgroundColor:B.dark,paddingTop:0},
  cartHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:12,borderBottomWidth:1,borderBottomColor:'rgba(255,255,255,0.1)'},
  cartEmpty:{flex:1,alignItems:'center',justifyContent:'center',padding:24},
  cartItem:{flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:12,paddingVertical:9,borderBottomWidth:1,borderBottomColor:'rgba(255,255,255,0.06)'},
  qtyBtn:{width:26,height:26,borderRadius:8,backgroundColor:'#FEE2E2',alignItems:'center',justifyContent:'center'},
  cartTotals:{padding:12,borderTopWidth:1,borderTopColor:'rgba(255,255,255,0.1)'},
  totalRow:{flexDirection:'row',justifyContent:'space-between',marginBottom:4},
  totalLabel:{color:'rgba(255,255,255,0.5)',fontSize:12},
  totalVal:{color:'rgba(255,255,255,0.8)',fontSize:12},
  payBtn:{margin:12,marginTop:0,padding:16,borderRadius:14,alignItems:'center',justifyContent:'center'},
  // Modal
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.65)',justifyContent:'center',alignItems:'center',padding:16},
  modalBox:{backgroundColor:'#fff',borderRadius:20,width:'100%',maxWidth:500,maxHeight:'92%',overflow:'hidden'},
  modalHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:16},
  modalCloseX:{position:'absolute',top:10,right:10,width:30,height:30,alignItems:'center',justifyContent:'center',zIndex:10},
  modalFooter:{flexDirection:'row',gap:10,padding:16,borderTopWidth:1,borderTopColor:'#F0F0F0'},
  btnCancel:{flex:1,paddingVertical:12,borderRadius:12,alignItems:'center',borderWidth:2,borderColor:'#E5E7EB'},
  btnSave:{flex:2,paddingVertical:12,borderRadius:12,alignItems:'center'},
});
