import { ago, dollars, money, type LeadIntel } from "@/lib/leads";

import { ScoreDial, TrendLine, VisitBars } from "./charts";
import { Facade } from "./Facade";
import { LintelMark } from "./LintelMark";

export function LeadPanel(props: {
  intel: LeadIntel;
  agentName?: string;
  preview: boolean;
  /** Rendered in the header's right side: the Connect button, or the connected state. */
  account: React.ReactNode;
}) {
  const { intel } = props;
  const v = intel.valuation;
  const name = intel.firstName;

  return (
    <div className="panel" data-temp={intel.temperature.toLowerCase()}>
      <header className="panel-head">
        <span className="wordmark">
          <LintelMark /> Lintel
        </span>
        <span className="last-seen">
          On your site {ago(intel.lastVisitHours)}, {intel.visitsThisWeek} visits this week
        </span>
        <span className="account">{props.account}</span>
      </header>

      {props.preview && (
        <p className="preview-note">
          Preview with sample data. When an agent opens a real contact, Lintel shows that lead&apos;s activity on their
          website.
        </p>
      )}

      <div className="lead-top">
        <section className="score" aria-labelledby="score-h">
          <h2 id="score-h">Lead score</h2>
          <div className="score-body">
            <ScoreDial score={intel.score} temperature={intel.temperature} />
            <ul className="factors">
              {intel.factors.slice(0, 4).map((f) => (
                <li key={f.label}>
                  <span>{f.label}</span>
                  <b>+{f.points}</b>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="value" aria-labelledby="value-h">
          <h2 id="value-h">{name === "This lead" ? "Home value" : `${name}'s home value`}</h2>
          <p className="address">
            {v.address}
            <span>{v.cityLine}</span>
          </p>
          <p className="estimate">{dollars(v.estimate)}</p>
          <p className="range">
            Likely {money(v.low)} to {money(v.high)}, {v.confidence.toLowerCase()} confidence
          </p>
          <TrendLine values={v.monthly} label={`Estimated value over the last 12 months, now ${dollars(v.estimate)}`} />
          <p className="change" data-up={v.change12mo >= 0 || undefined}>
            {v.change12mo >= 0 ? "Up" : "Down"} {Math.abs(v.change12mo * 100).toFixed(1)}% in 12 months
            <span>
              {v.beds} bd, {v.baths} ba, {v.sqft.toLocaleString("en-US")} sq ft
            </span>
          </p>
        </section>
      </div>

      <section className="homes" aria-labelledby="homes-h">
        <div className="section-head">
          <h2 id="homes-h">Homes {name === "This lead" ? "they" : name} keep{name === "This lead" ? "" : "s"} coming back to</h2>
          <span>
            Mostly {intel.topNeighborhood}, {money(intel.priceBand[0])} to {money(intel.priceBand[1])}
          </span>
        </div>
        <ul className="home-row">
          {intel.homes.map((home) => (
            <li key={home.id} className="home">
              <div className="home-photo">
                <Facade spec={home.facade} label={`Illustration of ${home.address}`} />
                <span className="status" data-status={home.status}>{home.status}</span>
                {home.saved && (
                  <span className="saved" title="Saved">
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-label="Saved">
                      <path d="M8 14s-5.5-3.3-5.5-7.2A3 3 0 0 1 8 4.6a3 3 0 0 1 5.5 2.2C13.5 10.7 8 14 8 14z" fill="#f0562e" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="home-body">
                <strong>{dollars(home.price)}</strong>
                <span className="home-addr">{home.address}</span>
                <span className="home-spec">
                  {home.beds} bd, {home.baths} ba, {home.sqft.toLocaleString("en-US")} sq ft
                </span>
                <span className="home-views">
                  Viewed {home.views === 1 ? "once" : `${home.views} times`}, {ago(home.lastViewedHours)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="lead-bottom">
        <section aria-labelledby="searches-h">
          <h2 id="searches-h">Saved searches</h2>
          <ul className="searches">
            {intel.searches.map((s, i) => (
              <li key={i}>
                <div>
                  <strong>{s.name}</strong>
                  <span>{s.criteria}</span>
                </div>
                <div className="search-meta">
                  {s.newMatches > 0 ? <b>{s.newMatches} new</b> : <span>No new</span>}
                  <span>{s.alerts} alerts</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="visits-h">
          <h2 id="visits-h">Site visits, last 30 days</h2>
          <VisitBars values={intel.daily} />
          <p className="bars-legend">
            <span>30 days ago</span>
            <span>This week</span>
          </p>
        </section>
      </div>

      <footer className="panel-foot">
        {props.agentName ? `From ${props.agentName}'s Lintel website` : "From your Lintel website"}. Scores update as{" "}
        {name === "This lead" ? "they browse" : `${name} browses`}.
      </footer>
    </div>
  );
}
