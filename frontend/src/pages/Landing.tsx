import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown, ArrowUpRight, Users, LayoutDashboard, Handshake, CheckSquare, Activity, Check, LockKeyhole } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import "./landing.css";

export function FrextBrand() {
  return <Link className="frext-brand" to="/" aria-label="Frext CRM home"><span className="frext-mark">f<span>.</span></span><span>frext<span className="frext-brand-sub">CRM</span></span></Link>;
}

export default function Landing() {
  const { user } = useAuth();
  const destination = user ? "/dashboard" : "/login";
  return <div className="frext-public">
    <header className="frext-header frext-wrap"><FrextBrand /><nav aria-label="Main navigation"><a href="#workspace">Workspace</a><a href="#workflow">How it works</a></nav><Link className="frext-nav-login" to={destination}>{user ? "Open dashboard" : "Admin sign in"}<ArrowUpRight size={16} /></Link></header>
    <main>
      <section className="frext-hero frext-wrap">
        <div className="frext-hero-copy"><p className="frext-eyebrow"><span /> YOUR CUSTOMER WORKSPACE</p><h1>Good relationships.<br />Better business.</h1><p className="frext-intro">A clear view of your customers, your pipeline, and what needs to happen next. Give your team one place to get the work done.</p><div className="frext-actions"><Link className="frext-button" to={destination}>{user ? "Open your workspace" : "Sign in to your workspace"}<ArrowRight size={17} /></Link><a className="frext-text-link" href="#workspace">Take a closer look <ArrowDown size={13} style={{ display: "inline", marginLeft: 8 }} /></a></div><p className="frext-access"><LockKeyhole size={13} /> A dedicated workspace for your business and team.</p></div>
        <div className="frext-hero-note"><span>01 / THE BIG PICTURE</span><p>Less searching.<br />More following through.</p></div>
      </section>
      <section className="frext-wrap" id="workspace" aria-label="Workspace preview">
        <div className="frext-preview-label"><span>YOUR DAY, AT A GLANCE</span><span>Illustrative workspace � Sample data</span></div>
        <div className="frext-preview">
          <aside className="frext-preview-sidebar" aria-hidden="true"><div className="frext-preview-brand">f<span>.</span></div>{[LayoutDashboard, Users, Handshake, CheckSquare, Activity].map((Icon,i)=><div key={i} className={i===0?"selected":""}><Icon size={19}/></div>)}<span className="frext-avatar">JD</span></aside>
          <div className="frext-preview-main"><div className="frext-preview-top"><span>Workspace <span>/ Overview</span></span><span className="frext-preview-team">Acme sales team</span></div><div className="frext-preview-heading"><div><p>MONDAY, 09 SEPTEMBER</p><h2>A little clarity for the week ahead.</h2></div><span className="frext-period">This month</span></div>
            <div className="frext-metrics">{[["Active customers","128","Relationships in progress"],["Open pipeline","\u20b98,40,000","Across 24 opportunities"],["Tasks due today","06","Your next steps, in order"]].map(([label,value,note])=><div key={label}><p>{label}</p><strong>{value}</strong><span>{note}</span></div>)}</div>
            <div className="frext-preview-bottom"><div className="frext-pipeline"><div className="frext-panel-title"><h3>Deal pipeline</h3><span>24 open deals</span></div>{[["Lead",9,90,"\u20b93,20,000"],["Qualified",7,72,"\u20b92,40,000"],["Proposal",5,52,"\u20b91,80,000"],["Negotiation",3,33,"\u20b91,00,000"]].map(([label,count,width,value])=><div className="frext-pipeline-row" key={label}><span>{label}</span><div><i style={{width:width+"%"}} /></div><span>{count}</span><strong>{value}</strong></div>)}</div><div className="frext-followups"><div className="frext-panel-title"><h3>Next up</h3><span>Today</span></div>{[["Proposal follow-up","Northstar Studio","10:00"],["Review account notes","Atlas & Co.","11:30"],["Schedule a check-in","Fieldwork Labs","14:00"]].map(([title,company,time])=><div className="frext-followup" key={title}><span className="frext-check-box"/><div><strong>{title}</strong><span>{company}</span></div><time>{time}</time></div>)}</div></div>
          </div>
        </div>
      </section>
      <section className="frext-capabilities frext-wrap" id="workflow"><div className="frext-section-heading"><p className="frext-eyebrow">BUILT AROUND THE WAY YOU WORK</p><h2>Everything connected.<br />Nothing lost in the handover.</h2></div><div className="frext-feature-grid">{[{n:"01",icon:Users,title:"Know the customer",text:"Keep contact details and notes together, so every conversation starts with the right context."},{n:"02",icon:Handshake,title:"Keep deals moving",text:"Follow each opportunity through your pipeline and see where your team's attention is needed."},{n:"03",icon:CheckSquare,title:"Follow through",text:"Assign tasks, track progress, and review activity. Make the next step clear for everyone."}].map(({n,icon:Icon,title,text})=><article key={n}><div className="frext-feature-top"><Icon size={23} strokeWidth={1.5}/><span>{n}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="frext-cta frext-wrap"><div><p className="frext-eyebrow">READY FOR THE WORKDAY</p><h2>Your team. Your customers.<br />One shared view.</h2><p><Check size={15}/> Customer records <Check size={15}/> Deal tracking <Check size={15}/> Team tasks</p></div><div><Link className="frext-button" to={destination}>{user ? "Go to dashboard" : "Admin sign in"}<ArrowRight size={17}/></Link><span className="frext-cta-note">Use your existing workspace account.</span></div></section>
    </main><footer className="frext-footer frext-wrap"><FrextBrand/><span>Customer relationships, thoughtfully managed.</span><span>� {new Date().getFullYear()} Frext</span></footer>
  </div>;
}
